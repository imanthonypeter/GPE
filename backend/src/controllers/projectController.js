const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.createProject = async (req, res) => {
  try {
    const { title, description, subject } = req.body;
    const leader_id = req.user.id; // o utilizador que cria torna-se o líder do projeto

    // Usar transação para criar projeto e adicionar o líder aos membros
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const projectResult = await client.query(
        'INSERT INTO projects (title, description, subject, leader_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, description, subject, leader_id]
      );
      const project = projectResult.rows[0];

      await client.query(
        'INSERT INTO project_members (project_id, user_id, role_in_project) VALUES ($1, $2, $3)',
        [project.id, leader_id, 'leader']
      );

      await client.query('COMMIT');
      res.status(201).json({ project });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const projectResult = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    const project = projectResult.rows[0];

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const membersResult = await db.query(
      `SELECT pm.id, pm.user_id, pm.role_in_project, u.name, u.email 
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = $1`,
      [id]
    );

    res.json({ project, members: membersResult.rows });
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getProjectsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o utilizador está a solicitar os seus próprios projetos ou se é um professor
    if (req.user.id !== parseInt(id) && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Proibido' });
    }

    const result = await db.query(
      `SELECT p.*, pm.role_in_project 
       FROM projects p
       JOIN project_members pm ON p.id = pm.project_id
       WHERE pm.user_id = $1
       ORDER BY p.created_at DESC`,
      [id]
    );

    res.json({ projects: result.rows });
  } catch (error) {
    console.error('Error getting user projects:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, email, name, password, role_in_project } = req.body;

    const projectResult = await db.query('SELECT leader_id FROM projects WHERE id = $1', [id]);
    const project = projectResult.rows[0];
    
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.leader_id !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Apenas o líder do projeto ou um professor podem adicionar membros' });
    }

    let targetUserId = user_id;
    
    // Se enviou o email, procura o user_id correspondente
    if (email && !targetUserId) {
      const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userRes.rows.length === 0) {
        if (!name) {
          return res.status(400).json({ error: 'O utilizador não existe. Por favor, forneça o Nome para criar a conta.' });
        }
        // Criar o utilizador
        const saltRounds = 10;
        const plainPassword = password || 'gpe123456';
        const password_hash = await bcrypt.hash(plainPassword, saltRounds);
        
        const newUserRes = await db.query(
          'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
          [name, email, password_hash, 'student']
        );
        targetUserId = newUserRes.rows[0].id;
      } else {
        targetUserId = userRes.rows[0].id;
      }
    }

    if (!targetUserId) {
      return res.status(400).json({ error: 'É necessário fornecer um email válido.' });
    }

    const result = await db.query(
      'INSERT INTO project_members (project_id, user_id, role_in_project) VALUES ($1, $2, $3) RETURNING *',
      [id, targetUserId, role_in_project || 'Membro']
    );

    res.status(201).json({ member: result.rows[0] });
  } catch (error) {
    console.error('Error adding member:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'O utilizador já é membro deste projeto' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.updateMemberRole = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { role_in_project } = req.body;

    const projectResult = await db.query('SELECT leader_id FROM projects WHERE id = $1', [id]);
    const project = projectResult.rows[0];
    
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.leader_id !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Apenas o líder do projeto ou um professor podem alterar membros' });
    }

    const result = await db.query(
      'UPDATE project_members SET role_in_project = $1 WHERE id = $2 AND project_id = $3 RETURNING *',
      [role_in_project, memberId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Membro não encontrado neste projeto' });
    }

    res.json({ member: result.rows[0] });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    const projectResult = await db.query('SELECT leader_id FROM projects WHERE id = $1', [id]);
    const project = projectResult.rows[0];
    
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.leader_id !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Apenas o líder do projeto ou um professor podem remover membros' });
    }

    // Verificar se não está a tentar remover o líder
    const memberResult = await db.query('SELECT user_id FROM project_members WHERE id = $1', [memberId]);
    if (memberResult.rows.length > 0 && memberResult.rows[0].user_id === project.leader_id) {
      return res.status(400).json({ error: 'Não é possível remover o líder do projeto' });
    }

    const result = await db.query(
      'DELETE FROM project_members WHERE id = $1 AND project_id = $2 RETURNING id',
      [memberId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Membro não encontrado neste projeto' });
    }

    res.json({ message: 'Membro removido com sucesso', deletedId: memberId });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.finishProject = async (req, res) => {
  try {
    const { id } = req.params;

    const projectResult = await db.query('SELECT leader_id FROM projects WHERE id = $1', [id]);
    const project = projectResult.rows[0];
    
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.leader_id !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Apenas o líder do projeto ou um professor podem finalizar o projeto' });
    }

    const result = await db.query(
      "UPDATE projects SET status = 'finished' WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Error finishing project:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

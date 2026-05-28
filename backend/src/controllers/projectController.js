const db = require('../config/db');

exports.createProject = async (req, res) => {
  try {
    const { title, description, subject } = req.body;
    const leader_id = req.user.id; // leader is the one creating it

    if (req.user.role !== 'leader' && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only leaders or teachers can create projects' });
    }

    // Use transaction to create project and add leader to members
    const client = await db.query('BEGIN');
    try {
      const projectResult = await db.query(
        'INSERT INTO projects (title, description, subject, leader_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, description, subject, leader_id]
      );
      const project = projectResult.rows[0];

      await db.query(
        'INSERT INTO project_members (project_id, user_id, role_in_project) VALUES ($1, $2, $3)',
        [project.id, leader_id, 'leader']
      );

      await db.query('COMMIT');
      res.status(201).json({ project });
    } catch (e) {
      await db.query('ROLLBACK');
      throw e;
    }
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const projectResult = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    const project = projectResult.rows[0];

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProjectsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is requesting their own projects or if it's a teacher
    if (req.user.id !== parseInt(id) && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Forbidden' });
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, role_in_project } = req.body;

    const projectResult = await db.query('SELECT leader_id FROM projects WHERE id = $1', [id]);
    const project = projectResult.rows[0];
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.leader_id !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only the project leader or a teacher can add members' });
    }

    const result = await db.query(
      'INSERT INTO project_members (project_id, user_id, role_in_project) VALUES ($1, $2, $3) RETURNING *',
      [id, user_id, role_in_project || 'member']
    );

    res.status(201).json({ member: result.rows[0] });
  } catch (error) {
    console.error('Error adding member:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'User is already a member of this project' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

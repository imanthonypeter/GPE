const db = require('../config/db');

exports.createPhase = async (req, res) => {
  try {
    const { project_id, title, description } = req.body;

    // verificar permissões
    const projectResult = await db.query('SELECT leader_id FROM projects WHERE id = $1', [project_id]);
    const project = projectResult.rows[0];

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.leader_id !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Apenas líderes ou professores podem criar fases' });
    }

    const result = await db.query(
      'INSERT INTO phases (project_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [project_id, title, description, 'open']
    );

    res.status(201).json({ phase: result.rows[0] });
  } catch (error) {
    console.error('Error creating phase:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getPhasesByProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM phases WHERE project_id = $1 ORDER BY created_at ASC', [id]);
    res.json({ phases: result.rows });
  } catch (error) {
    console.error('Error getting phases:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.updatePhaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const phaseResult = await db.query('SELECT project_id FROM phases WHERE id = $1', [id]);
    const phase = phaseResult.rows[0];

    if (!phase) {
      return res.status(404).json({ error: 'Fase não encontrada' });
    }

    const projectResult = await db.query('SELECT leader_id FROM projects WHERE id = $1', [phase.project_id]);
    const project = projectResult.rows[0];

    if (project.leader_id !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Apenas líderes ou professores podem atualizar o estado da fase' });
    }

    const result = await db.query(
      'UPDATE phases SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({ phase: result.rows[0] });
  } catch (error) {
    console.error('Error updating phase status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

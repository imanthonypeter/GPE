const db = require('../config/db');

exports.addEvaluation = async (req, res) => {
  try {
    const { phase_id, user_id, participation_score, justification_text, work_done } = req.body;

    if (participation_score < 0 || participation_score > 100) {
      return res.status(400).json({ error: 'A pontuação deve estar entre 0 e 100' });
    }

    // Verificar se a fase existe e está aberta
    const phaseResult = await db.query('SELECT project_id, status FROM phases WHERE id = $1', [phase_id]);
    const phase = phaseResult.rows[0];
    if (!phase) return res.status(404).json({ error: 'Fase não encontrada' });
    if (phase.status !== 'open') return res.status(400).json({ error: 'Fase está encerrada' });

    // Verificar permissões do avaliador (deve ser professor ou líder do projeto)
    const projectResult = await db.query('SELECT leader_id FROM projects WHERE id = $1', [phase.project_id]);
    const project = projectResult.rows[0];

    if (project.leader_id !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Apenas líderes ou professores podem adicionar avaliações' });
    }

    // Verificar se o utilizador avaliado é membro do projeto
    const memberResult = await db.query('SELECT id FROM project_members WHERE project_id = $1 AND user_id = $2', [phase.project_id, user_id]);
    if (memberResult.rows.length === 0) {
      return res.status(400).json({ error: 'O utilizador não é membro deste projeto' });
    }

    const result = await db.query(
      `INSERT INTO phase_evaluations (phase_id, user_id, participation_score, justification_text, work_done, evaluated_by) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (phase_id, user_id) 
       DO UPDATE SET participation_score = EXCLUDED.participation_score, justification_text = EXCLUDED.justification_text, work_done = EXCLUDED.work_done, evaluated_by = EXCLUDED.evaluated_by, created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [phase_id, user_id, participation_score, justification_text, work_done, req.user.id]
    );

    res.status(201).json({ evaluation: result.rows[0] });
  } catch (error) {
    console.error('Error adding evaluation:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getEvaluationsByPhase = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o utilizador faz parte do projeto ou é professor
    const phaseResult = await db.query('SELECT project_id FROM phases WHERE id = $1', [id]);
    const phase = phaseResult.rows[0];
    if (!phase) return res.status(404).json({ error: 'Fase não encontrada' });

    const memberResult = await db.query('SELECT id FROM project_members WHERE project_id = $1 AND user_id = $2', [phase.project_id, req.user.id]);
    if (memberResult.rows.length === 0 && req.user.role !== 'teacher') {
       return res.status(403).json({ error: 'Proibido' });
    }

    const result = await db.query(
      `SELECT pe.*, u.name as user_name, u.email as user_email, e.name as evaluator_name
       FROM phase_evaluations pe
       JOIN users u ON pe.user_id = u.id
       JOIN users e ON pe.evaluated_by = e.id
       WHERE pe.phase_id = $1
       ORDER BY u.name ASC`,
      [id]
    );

    res.json({ evaluations: result.rows });
  } catch (error) {
    console.error('Error getting evaluations:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

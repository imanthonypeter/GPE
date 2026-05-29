const db = require('../config/db');

exports.getProjectResults = async (req, res) => {
  try {
    const { id } = req.params; // id_do_projeto
    
    // Verificar acesso
    const memberResult = await db.query('SELECT id FROM project_members WHERE project_id = $1 AND user_id = $2', [id, req.user.id]);
    if (memberResult.rows.length === 0 && req.user.role !== 'teacher') {
       return res.status(403).json({ error: 'Proibido' });
    }

    // Calcular médias
    const query = `
      SELECT 
        pm.user_id,
        u.name as user_name,
        COUNT(pe.id) as evaluated_phases,
        (SELECT COUNT(id) FROM phases WHERE project_id = $1) as total_phases,
        COALESCE(AVG(pe.participation_score), 0) as final_average
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      LEFT JOIN phases ph ON ph.project_id = pm.project_id
      LEFT JOIN phase_evaluations pe ON pe.phase_id = ph.id AND pe.user_id = pm.user_id
      WHERE pm.project_id = $1
      GROUP BY pm.user_id, u.name
    `;

    const result = await db.query(query, [id]);

    const resultsWithEligibility = result.rows.map(row => {
      const finalAvg = parseFloat(row.final_average).toFixed(2);
      const isEligible = finalAvg >= 50.0;
      return {
        ...row,
        final_average: finalAvg,
        eligible_for_defense: isEligible
      };
    });

    // Guardar ou atualizar os resultados finais na base de dados
    // Idealmente, apenas o professor ou líder deveria guardar, mas vamos guardar automaticamente no cálculo
    for (const r of resultsWithEligibility) {
      await db.query(
        `INSERT INTO final_results (project_id, user_id, final_average, eligible_for_defense)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (project_id, user_id)
         DO UPDATE SET final_average = EXCLUDED.final_average, eligible_for_defense = EXCLUDED.eligible_for_defense, computed_at = CURRENT_TIMESTAMP`,
        [id, r.user_id, r.final_average, r.eligible_for_defense]
      );
    }

    res.json({ results: resultsWithEligibility });
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

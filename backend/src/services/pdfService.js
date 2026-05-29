const PDFDocument = require('pdfkit');
const db = require('../config/db');

exports.exportProjectPDF = async (req, res) => {
  try {
    const { id } = req.params;

    // Check access
    const memberResult = await db.query('SELECT id FROM project_members WHERE project_id = $1 AND user_id = $2', [id, req.user.id]);
    if (memberResult.rows.length === 0 && req.user.role !== 'teacher') {
       return res.status(403).json({ error: 'Forbidden' });
    }

    // Gather Project Info
    const projectResult = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    const project = projectResult.rows[0];
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Gather Members and Final Results
    const resultsQuery = `
      SELECT u.name, u.email, pm.role_in_project, fr.final_average, fr.eligible_for_defense
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      LEFT JOIN final_results fr ON fr.project_id = pm.project_id AND fr.user_id = pm.user_id
      WHERE pm.project_id = $1
      ORDER BY u.name ASC
    `;
    const membersResult = await db.query(resultsQuery, [id]);

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Stream the PDF to the response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="project_${id}_report.pdf"`);
    doc.pipe(res);

    // Document Header
    doc.fontSize(20).text('Relatório Final do Projeto', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Projeto: ${project.title}`);
    doc.fontSize(12).text(`Disciplina: ${project.subject || 'N/A'}`);
    doc.fontSize(12).text(`Descrição: ${project.description || 'N/A'}`);
    doc.moveDown();

    // Results section
    doc.fontSize(16).text('Resultados Finais e Membros');
    doc.moveDown(0.5);

    membersResult.rows.forEach(m => {
      const avg = m.final_average !== null ? parseFloat(m.final_average).toFixed(2) : 'N/A';
      const status = m.eligible_for_defense === true ? 'APURADO PARA DEFESA' : (m.eligible_for_defense === false ? 'NÃO APURADO' : 'Pendente');
      
      doc.fontSize(12).text(`Nome: ${m.name} (${m.role_in_project})`);
      doc.fontSize(10).text(`Email: ${m.email}`);
      doc.fontSize(10).text(`Média Final: ${avg}%`);
      doc.fontSize(10).text(`Status: ${status}`);
      doc.moveDown(0.5);
    });

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error while generating PDF' });
    }
  }
};

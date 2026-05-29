const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');
const phaseController = require('../controllers/phaseController');
const evaluationController = require('../controllers/evaluationController');
const resultController = require('../controllers/resultController');
const pdfService = require('../services/pdfService');

const { authenticateToken } = require('../middlewares/authMiddleware');

// Rotas de Autenticação
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Rotas de Projetos
router.post('/projects', authenticateToken, projectController.createProject);
router.get('/projects/:id', authenticateToken, projectController.getProjectById);
router.get('/projects/user/:id', authenticateToken, projectController.getProjectsByUser);
router.post('/projects/:id/members', authenticateToken, projectController.addMember);

// Rotas de Fases
router.post('/phases', authenticateToken, phaseController.createPhase);
router.get('/phases/project/:id', authenticateToken, phaseController.getPhasesByProject);
router.put('/phases/:id/status', authenticateToken, phaseController.updatePhaseStatus);

// Rotas de Avaliação
router.post('/evaluations', authenticateToken, evaluationController.addEvaluation);
router.get('/evaluations/phase/:id', authenticateToken, evaluationController.getEvaluationsByPhase);

// Rotas de Resultados e Exportação PDF
router.get('/results/project/:id', authenticateToken, resultController.getProjectResults);
router.get('/projects/:id/export/pdf', authenticateToken, pdfService.exportProjectPDF);

module.exports = router;

import express from 'express';
import { reportCrime, getReports, updateReportStatus, assignOfficer, deleteReport, searchReports, getReportStats, getOfficerReports } from '../controllers/reportController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, reportCrime);
router.get('/', authMiddleware, getReports);
router.put('/:reportId/status', authMiddleware, updateReportStatus);
router.delete('/:reportId', authMiddleware, deleteReport);
router.get('/stats', authMiddleware, getReportStats);
router.get('/officers/:id/reports', authMiddleware, getOfficerReports);
router.get('/search', authMiddleware, searchReports);
router.put('/:reportId/assign', authMiddleware, assignOfficer);

export default router;

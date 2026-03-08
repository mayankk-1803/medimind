import express from 'express';
import { getUserReports, getReportById, deleteReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getUserReports);
    
router.route('/:id')
    .get(protect, getReportById)
    .delete(protect, deleteReport);

export default router;

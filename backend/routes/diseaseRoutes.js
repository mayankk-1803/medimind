import express from 'express';
import { checkSymptoms, getDiseases } from '../controllers/diseaseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/check', protect, checkSymptoms);
router.get('/', getDiseases);

export default router;

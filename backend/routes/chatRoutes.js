import express from 'express';
import { processChat, getUserChats, getChatById } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All chat routes are protected

router.post('/', processChat);
router.get('/', getUserChats);
router.get('/:id', getChatById);

export default router;

import { Router } from 'express';
import {
  getUserProgress,
  getDueReviews,
  submitReview,
  startStudySession,
  endStudySession
} from '../controllers/progress.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getUserProgress);
router.get('/due', authenticateToken, getDueReviews);
router.post('/review', authenticateToken, submitReview);
router.post('/session/start', authenticateToken, startStudySession);
router.post('/session/end', authenticateToken, endStudySession);

export default router;

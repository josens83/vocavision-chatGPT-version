import { Router } from 'express';
import {
  getDailyGoal,
  setDailyGoal,
  updateDailyProgress,
} from '../controllers/goals.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/daily', authenticateToken, getDailyGoal);
router.post('/daily', authenticateToken, setDailyGoal);
router.post('/daily/progress', authenticateToken, updateDailyProgress);

export default router;

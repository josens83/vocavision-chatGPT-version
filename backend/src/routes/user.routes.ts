import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Placeholder routes - to be implemented
router.get('/stats', authenticateToken, (req, res) => {
  res.json({ message: 'User stats endpoint' });
});

router.get('/achievements', authenticateToken, (req, res) => {
  res.json({ message: 'User achievements endpoint' });
});

export default router;

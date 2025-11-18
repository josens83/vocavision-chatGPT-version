import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Placeholder routes - to be implemented
router.get('/methods/:wordId', authenticateToken, (req, res) => {
  res.json({ message: 'Learning methods for word endpoint' });
});

router.post('/generate-mnemonic', authenticateToken, (req, res) => {
  res.json({ message: 'Generate AI mnemonic endpoint' });
});

router.post('/generate-image', authenticateToken, (req, res) => {
  res.json({ message: 'Generate AI image endpoint' });
});

export default router;

import { Router } from 'express';
import {
  getWords,
  getWordById,
  createWord,
  getRandomWords
} from '../controllers/word.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getWords);
router.get('/random', authenticateToken, getRandomWords);
router.get('/:id', authenticateToken, getWordById);
router.post('/', authenticateToken, requireAdmin, createWord);

export default router;

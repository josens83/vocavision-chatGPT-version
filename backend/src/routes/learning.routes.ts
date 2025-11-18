import { Router } from 'express';
import {
  getLearningMethods,
  generateMnemonic,
  generateImage,
} from '../controllers/learning.controller';
import { authenticateToken, requireSubscription } from '../middleware/auth.middleware';

const router = Router();

router.get('/methods/:wordId', authenticateToken, getLearningMethods);
router.post('/generate-mnemonic', authenticateToken, requireSubscription, generateMnemonic);
router.post('/generate-image', authenticateToken, requireSubscription, generateImage);

export default router;

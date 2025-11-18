import { Router } from 'express';
import {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription
} from '../controllers/subscription.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/create-checkout', authenticateToken, createCheckoutSession);
router.post('/webhook', handleWebhook); // No auth - Stripe webhook
router.get('/status', authenticateToken, getSubscriptionStatus);
router.post('/cancel', authenticateToken, cancelSubscription);

export default router;

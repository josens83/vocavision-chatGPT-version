import { Router } from 'express';
import {
  getMyLeague,
  getLeaderboard,
  getLeagueHistory,
  getLeagueInfo,
  addXP,
} from '../controllers/league.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Get current user's league info
router.get('/my', authMiddleware, getMyLeague);

// Get leaderboard for current week
router.get('/leaderboard', authMiddleware, getLeaderboard);

// Get league history
router.get('/history', authMiddleware, getLeagueHistory);

// Get league tier info
router.get('/info/:tier', getLeagueInfo);

// Add XP (internal use - called by other controllers)
router.post('/xp', authMiddleware, addXP);

export default router;

import { Router } from 'express';
import {
  getDecks,
  getPublicDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
  cloneDeck,
  addWordToDeck,
  removeWordFromDeck,
} from '../controllers/deck.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Get user's decks (requires auth)
router.get('/', authMiddleware, getDecks);

// Get public/community decks (optional auth)
router.get('/public', optionalAuthMiddleware, getPublicDecks);

// Get single deck by ID (optional auth for public decks)
router.get('/:id', optionalAuthMiddleware, getDeckById);

// Create a new deck (requires auth)
router.post('/', authMiddleware, createDeck);

// Update a deck (requires auth)
router.put('/:id', authMiddleware, updateDeck);

// Delete a deck (requires auth)
router.delete('/:id', authMiddleware, deleteDeck);

// Clone a public deck (requires auth)
router.post('/:id/clone', authMiddleware, cloneDeck);

// Add word to deck (requires auth)
router.post('/:id/words', authMiddleware, addWordToDeck);

// Remove word from deck (requires auth)
router.delete('/:id/words/:wordId', authMiddleware, removeWordFromDeck);

export default router;

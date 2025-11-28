import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth.middleware';

// Get user's decks
export const getDecks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decks = await prisma.deck.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    const decksWithCount = decks.map((deck) => ({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      userId: deck.userId,
      userName: deck.user.name,
      isPublic: deck.isPublic,
      tags: deck.tags,
      wordCount: deck.wordIds?.length || 0,
      createdAt: deck.createdAt.toISOString(),
      updatedAt: deck.updatedAt.toISOString(),
    }));

    res.json({ decks: decksWithCount });
  } catch (error) {
    next(error);
  }
};

// Get public decks
export const getPublicDecks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 20, offset = 0, search } = req.query;

    const whereClause: any = { isPublic: true };

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { tags: { has: search as string } },
      ];
    }

    const decks = await prisma.deck.findMany({
      where: whereClause,
      orderBy: [{ cloneCount: 'desc' }, { updatedAt: 'desc' }],
      take: Number(limit),
      skip: Number(offset),
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    const decksWithCount = decks.map((deck) => ({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      userId: deck.userId,
      userName: deck.user.name,
      isPublic: deck.isPublic,
      tags: deck.tags,
      wordCount: deck.wordIds?.length || 0,
      cloneCount: deck.cloneCount,
      createdAt: deck.createdAt.toISOString(),
      updatedAt: deck.updatedAt.toISOString(),
    }));

    res.json({ decks: decksWithCount });
  } catch (error) {
    next(error);
  }
};

// Get deck by ID
export const getDeckById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const deck = await prisma.deck.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    // Check access: owner or public deck
    if (!deck.isPublic && deck.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get words in the deck
    const words = deck.wordIds?.length
      ? await prisma.word.findMany({
          where: { id: { in: deck.wordIds } },
          select: {
            id: true,
            word: true,
            definition: true,
            pronunciation: true,
            difficulty: true,
          },
        })
      : [];

    res.json({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      userId: deck.userId,
      userName: deck.user.name,
      isPublic: deck.isPublic,
      tags: deck.tags,
      words,
      wordCount: words.length,
      createdAt: deck.createdAt.toISOString(),
      updatedAt: deck.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// Create a new deck
export const createDeck = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { name, description, isPublic = false, tags = [], wordIds = [] } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Deck name is required' });
    }

    const deck = await prisma.deck.create({
      data: {
        name,
        description,
        userId,
        isPublic,
        tags,
        wordIds,
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    res.status(201).json({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      userId: deck.userId,
      userName: deck.user.name,
      isPublic: deck.isPublic,
      tags: deck.tags,
      wordCount: deck.wordIds?.length || 0,
      createdAt: deck.createdAt.toISOString(),
      updatedAt: deck.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// Update a deck
export const updateDeck = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check ownership
    const existingDeck = await prisma.deck.findUnique({ where: { id } });

    if (!existingDeck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    if (existingDeck.userId !== userId) {
      return res.status(403).json({ message: 'You can only edit your own decks' });
    }

    const { name, description, isPublic, tags, wordIds } = req.body;

    const deck = await prisma.deck.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic }),
        ...(tags !== undefined && { tags }),
        ...(wordIds !== undefined && { wordIds }),
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    res.json({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      userId: deck.userId,
      userName: deck.user.name,
      isPublic: deck.isPublic,
      tags: deck.tags,
      wordCount: deck.wordIds?.length || 0,
      createdAt: deck.createdAt.toISOString(),
      updatedAt: deck.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// Delete a deck
export const deleteDeck = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check ownership
    const existingDeck = await prisma.deck.findUnique({ where: { id } });

    if (!existingDeck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    if (existingDeck.userId !== userId) {
      return res.status(403).json({ message: 'You can only delete your own decks' });
    }

    await prisma.deck.delete({ where: { id } });

    res.json({ success: true, message: 'Deck deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Clone a public deck
export const cloneDeck = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the source deck
    const sourceDeck = await prisma.deck.findUnique({ where: { id } });

    if (!sourceDeck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    if (!sourceDeck.isPublic && sourceDeck.userId !== userId) {
      return res.status(403).json({ message: 'Cannot clone private deck' });
    }

    // Create a clone
    const clonedDeck = await prisma.deck.create({
      data: {
        name: `${sourceDeck.name} (복사본)`,
        description: sourceDeck.description,
        userId,
        isPublic: false,
        tags: sourceDeck.tags,
        wordIds: sourceDeck.wordIds,
        clonedFromId: sourceDeck.id,
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    // Increment clone count on source deck
    await prisma.deck.update({
      where: { id },
      data: { cloneCount: { increment: 1 } },
    });

    res.status(201).json({
      id: clonedDeck.id,
      name: clonedDeck.name,
      description: clonedDeck.description,
      userId: clonedDeck.userId,
      userName: clonedDeck.user.name,
      isPublic: clonedDeck.isPublic,
      tags: clonedDeck.tags,
      wordCount: clonedDeck.wordIds?.length || 0,
      createdAt: clonedDeck.createdAt.toISOString(),
      updatedAt: clonedDeck.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// Add word to deck
export const addWordToDeck = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { wordId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const deck = await prisma.deck.findUnique({ where: { id } });

    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    if (deck.userId !== userId) {
      return res.status(403).json({ message: 'You can only modify your own decks' });
    }

    // Check if word exists
    const word = await prisma.word.findUnique({ where: { id: wordId } });
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    // Check if word already in deck
    if (deck.wordIds?.includes(wordId)) {
      return res.status(400).json({ message: 'Word already in deck' });
    }

    const updatedDeck = await prisma.deck.update({
      where: { id },
      data: {
        wordIds: { push: wordId },
      },
    });

    res.json({
      success: true,
      wordCount: updatedDeck.wordIds?.length || 0,
    });
  } catch (error) {
    next(error);
  }
};

// Remove word from deck
export const removeWordFromDeck = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, wordId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const deck = await prisma.deck.findUnique({ where: { id } });

    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    if (deck.userId !== userId) {
      return res.status(403).json({ message: 'You can only modify your own decks' });
    }

    const newWordIds = (deck.wordIds || []).filter((wId) => wId !== wordId);

    const updatedDeck = await prisma.deck.update({
      where: { id },
      data: { wordIds: newWordIds },
    });

    res.json({
      success: true,
      wordCount: updatedDeck.wordIds?.length || 0,
    });
  } catch (error) {
    next(error);
  }
};

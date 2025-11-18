import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const getBookmarks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        user: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch word details for each bookmark
    const wordIds = bookmarks.map(b => b.wordId);
    const words = await prisma.word.findMany({
      where: { id: { in: wordIds } },
      include: {
        images: { take: 1 },
        mnemonics: { take: 1, orderBy: { rating: 'desc' } },
      },
    });

    const bookmarksWithWords = bookmarks.map(bookmark => ({
      ...bookmark,
      word: words.find(w => w.id === bookmark.wordId),
    }));

    res.json({ bookmarks: bookmarksWithWords });
  } catch (error) {
    next(error);
  }
};

export const addBookmark = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const { wordId, notes } = req.body;

    if (!wordId) {
      throw new AppError('Word ID is required', 400);
    }

    // Check if word exists
    const word = await prisma.word.findUnique({
      where: { id: wordId },
    });

    if (!word) {
      throw new AppError('Word not found', 404);
    }

    // Check if already bookmarked
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
    });

    if (existing) {
      throw new AppError('Word already bookmarked', 409);
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        wordId,
        notes,
      },
    });

    res.status(201).json({
      message: 'Bookmark added successfully',
      bookmark,
    });
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const { wordId } = req.params;

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
    });

    if (!bookmark) {
      throw new AppError('Bookmark not found', 404);
    }

    await prisma.bookmark.delete({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
    });

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateBookmarkNotes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const { wordId } = req.params;
    const { notes } = req.body;

    const bookmark = await prisma.bookmark.update({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
      data: {
        notes,
      },
    });

    res.json({
      message: 'Notes updated successfully',
      bookmark,
    });
  } catch (error) {
    next(error);
  }
};

import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllCollections = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    const collections = await prisma.collection.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'asc' },
    });

    // Calculate progress for each collection if user is logged in
    // Only count PUBLISHED words
    const collectionsWithProgress = await Promise.all(
      collections.map(async (collection) => {
        // Count only PUBLISHED words in the collection
        const publishedWordCount = collection.wordIds?.length
          ? await prisma.word.count({
              where: {
                id: { in: collection.wordIds },
                status: 'PUBLISHED',
              },
            })
          : 0;

        let progressCount = 0;
        let masteredCount = 0;

        if (userId && publishedWordCount > 0) {
          // Get published word IDs first
          const publishedWords = await prisma.word.findMany({
            where: {
              id: { in: collection.wordIds || [] },
              status: 'PUBLISHED',
            },
            select: { id: true },
          });
          const publishedWordIds = publishedWords.map((w) => w.id);

          // Get user's progress for published words in this collection
          const userProgress = await prisma.userProgress.findMany({
            where: {
              userId,
              wordId: { in: publishedWordIds },
            },
          });

          progressCount = userProgress.length;
          masteredCount = userProgress.filter(
            (p) => p.masteryLevel === 'MASTERED'
          ).length;
        }

        const progressPercentage = publishedWordCount > 0
          ? Math.round((masteredCount / publishedWordCount) * 100)
          : 0;

        return {
          ...collection,
          wordCount: publishedWordCount,
          progressCount,
          masteredCount,
          progressPercentage,
        };
      })
    );

    res.json({ collections: collectionsWithProgress });
  } catch (error) {
    next(error);
  }
};

export const getCollectionById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const collection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Get words by IDs from the collection (only PUBLISHED words)
    const words = collection.wordIds?.length
      ? await prisma.word.findMany({
          where: {
            id: { in: collection.wordIds },
            status: 'PUBLISHED', // Only show published words to users
          },
          select: {
            id: true,
            word: true,
            definition: true,
            pronunciation: true,
            difficulty: true,
          },
        })
      : [];

    // Get user progress if authenticated
    interface WordProgress {
      masteryLevel: string;
      correctCount: number;
      totalReviews: number;
      lastReviewDate: Date | null;
    }

    let wordsWithProgress: Array<{
      id: string;
      word: string;
      definition: string;
      pronunciation: string | null;
      difficulty: string;
      progress: WordProgress | null;
    }> = words.map((word) => ({
      ...word,
      progress: null,
    }));

    if (userId && words.length > 0) {
      const wordIds = words.map((w) => w.id);
      const userProgress = await prisma.userProgress.findMany({
        where: {
          userId,
          wordId: { in: wordIds },
        },
      });

      wordsWithProgress = words.map((word) => {
        const progress = userProgress.find((p) => p.wordId === word.id);
        return {
          ...word,
          progress: progress
            ? {
                masteryLevel: progress.masteryLevel,
                correctCount: progress.correctCount,
                totalReviews: progress.totalReviews,
                lastReviewDate: progress.lastReviewDate,
              }
            : null,
        };
      });
    }

    res.json({
      ...collection,
      words: wordsWithProgress,
      wordCount: words.length,
    });
  } catch (error) {
    next(error);
  }
};

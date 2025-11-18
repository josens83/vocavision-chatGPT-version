import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDailyGoal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        dailyGoal: true,
        dailyProgress: true,
        lastGoalReset: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if we need to reset daily progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastReset = user.lastGoalReset ? new Date(user.lastGoalReset) : null;
    const needsReset = !lastReset || lastReset < today;

    if (needsReset) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          dailyProgress: 0,
          lastGoalReset: today,
        },
      });

      res.json({
        dailyGoal: user.dailyGoal,
        dailyProgress: 0,
        completed: false,
        percentage: 0,
      });
    } else {
      const percentage = Math.min(100, Math.round((user.dailyProgress / user.dailyGoal) * 100));
      const completed = user.dailyProgress >= user.dailyGoal;

      res.json({
        dailyGoal: user.dailyGoal,
        dailyProgress: user.dailyProgress,
        completed,
        percentage,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const setDailyGoal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const { goal } = req.body;

    if (!goal || goal < 1 || goal > 100) {
      throw new AppError('Goal must be between 1 and 100', 400);
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyGoal: goal,
      },
    });

    res.json({
      message: 'Daily goal updated successfully',
      dailyGoal: goal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDailyProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const { increment = 1 } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        dailyProgress: true,
        dailyGoal: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const newProgress = user.dailyProgress + increment;

    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyProgress: newProgress,
      },
    });

    const completed = newProgress >= user.dailyGoal;

    res.json({
      dailyProgress: newProgress,
      dailyGoal: user.dailyGoal,
      completed,
    });
  } catch (error) {
    next(error);
  }
};

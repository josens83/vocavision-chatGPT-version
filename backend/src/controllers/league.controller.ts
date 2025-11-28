import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth.middleware';

// Helper to get current week's Monday
function getCurrentWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Helper to get current week's Sunday
function getCurrentWeekEnd(): Date {
  const monday = getCurrentWeekStart();
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
}

// Get or create league for user
async function getOrCreateUserLeague(userId: string) {
  const weekStart = getCurrentWeekStart();
  const weekEnd = getCurrentWeekEnd();

  // Check if user has a league membership for this week
  let membership = await prisma.leagueMembership.findFirst({
    where: {
      userId,
      league: {
        weekStart: weekStart,
      },
    },
    include: {
      league: true,
    },
  });

  if (!membership) {
    // Get user's last league tier or default to BRONZE
    const lastMembership = await prisma.leagueMembership.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { league: true },
    });

    let tier: any = 'BRONZE';
    if (lastMembership) {
      // Apply promotion/demotion from last week
      if (lastMembership.result === 'PROMOTED') {
        const tiers = ['BRONZE', 'SILVER', 'GOLD', 'SAPPHIRE', 'RUBY', 'EMERALD', 'AMETHYST', 'PEARL', 'OBSIDIAN', 'DIAMOND'];
        const currentIndex = tiers.indexOf(lastMembership.league.tier);
        tier = tiers[Math.min(currentIndex + 1, tiers.length - 1)];
      } else if (lastMembership.result === 'DEMOTED') {
        const tiers = ['BRONZE', 'SILVER', 'GOLD', 'SAPPHIRE', 'RUBY', 'EMERALD', 'AMETHYST', 'PEARL', 'OBSIDIAN', 'DIAMOND'];
        const currentIndex = tiers.indexOf(lastMembership.league.tier);
        tier = tiers[Math.max(currentIndex - 1, 0)];
      } else {
        tier = lastMembership.league.tier;
      }
    }

    // Get or create league for this tier and week
    let league = await prisma.league.findUnique({
      where: {
        tier_weekStart: {
          tier,
          weekStart,
        },
      },
    });

    if (!league) {
      league = await prisma.league.create({
        data: {
          tier,
          weekStart,
          weekEnd,
          promotionZone: 10,
          demotionZone: 5,
        },
      });
    }

    // Create membership
    membership = await prisma.leagueMembership.create({
      data: {
        userId,
        leagueId: league.id,
        weeklyXP: 0,
      },
      include: {
        league: true,
      },
    });
  }

  return membership;
}

// Get current user's league info
export const getMyLeague = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const membership = await getOrCreateUserLeague(userId);

    res.json({
      tier: membership.league.tier,
      currentXP: membership.weeklyXP,
      weekStartDate: membership.league.weekStart.toISOString(),
      weekEndDate: membership.league.weekEnd.toISOString(),
      promotionZone: membership.league.promotionZone,
      demotionZone: membership.league.demotionZone,
      stayZone: 50 - membership.league.promotionZone - membership.league.demotionZone,
    });
  } catch (error) {
    next(error);
  }
};

// Get leaderboard for current week
export const getLeaderboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const { limit = 50 } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get user's current league
    const membership = await getOrCreateUserLeague(userId);
    const leagueId = membership.leagueId;

    // Get all members of the league sorted by XP
    const members = await prisma.leagueMembership.findMany({
      where: { leagueId },
      orderBy: { weeklyXP: 'desc' },
      take: Number(limit),
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    const leaderboard = members.map((member, index) => ({
      rank: index + 1,
      userId: member.userId,
      userName: member.user.name || 'Anonymous',
      xp: member.weeklyXP,
      isCurrentUser: member.userId === userId,
    }));

    res.json({ leaderboard });
  } catch (error) {
    next(error);
  }
};

// Get league history
export const getLeagueHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const memberships = await prisma.leagueMembership.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      include: {
        league: true,
      },
    });

    const history = memberships.map((m) => ({
      weekStart: m.league.weekStart.toISOString(),
      weekEnd: m.league.weekEnd.toISOString(),
      tier: m.league.tier,
      xp: m.weeklyXP,
      finalRank: m.finalRank,
      result: m.result,
    }));

    res.json({ history });
  } catch (error) {
    next(error);
  }
};

// Get league tier info
export const getLeagueInfo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tier } = req.params;

    const LEAGUE_INFO: Record<string, any> = {
      BRONZE: { name: '브론즈', icon: '🥉', nextLeague: 'SILVER' },
      SILVER: { name: '실버', icon: '🥈', nextLeague: 'GOLD' },
      GOLD: { name: '골드', icon: '🥇', nextLeague: 'SAPPHIRE' },
      SAPPHIRE: { name: '사파이어', icon: '💎', nextLeague: 'RUBY' },
      RUBY: { name: '루비', icon: '💍', nextLeague: 'EMERALD' },
      EMERALD: { name: '에메랄드', icon: '💚', nextLeague: 'AMETHYST' },
      AMETHYST: { name: '자수정', icon: '🔮', nextLeague: 'PEARL' },
      PEARL: { name: '진주', icon: '⚪', nextLeague: 'OBSIDIAN' },
      OBSIDIAN: { name: '흑요석', icon: '⚫', nextLeague: 'DIAMOND' },
      DIAMOND: { name: '다이아몬드', icon: '💎', nextLeague: null },
    };

    const info = LEAGUE_INFO[tier?.toUpperCase()];

    if (!info) {
      return res.status(404).json({ message: 'League tier not found' });
    }

    res.json({
      tier,
      ...info,
    });
  } catch (error) {
    next(error);
  }
};

// Add XP to user (called when user completes learning activities)
export const addXP = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const { xp, reason } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!xp || typeof xp !== 'number' || xp <= 0) {
      return res.status(400).json({ message: 'Valid XP amount required' });
    }

    // Get user's current league membership
    const membership = await getOrCreateUserLeague(userId);

    // Update XP
    const updated = await prisma.leagueMembership.update({
      where: { id: membership.id },
      data: {
        weeklyXP: { increment: xp },
      },
    });

    res.json({
      success: true,
      currentXP: updated.weeklyXP,
      addedXP: xp,
      reason,
    });
  } catch (error) {
    next(error);
  }
};

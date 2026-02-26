import { prisma } from '../../config/database';
import { logger } from '../../utils/logger';
import { POINTS_CONFIG } from '../../types/gamification';
import { pointsService } from './PointsService';

export class StreakService {
  async updateContributionStreak(userId: string): Promise<{
    streak: number;
    bonusAwarded: boolean;
  }> {
    return await prisma.$transaction(async (tx) => {
      const gamification = await tx.userGamification.findUnique({
        where: { userId },
      });

      if (!gamification) {
        await tx.userGamification.create({
          data: {
            userId,
            contributionStreak: 1,
            lastContribution: new Date(),
          },
        });
        return { streak: 1, bonusAwarded: false };
      }

      const now = new Date();
      const lastContribution = gamification.lastContribution;
      let newStreak = 1;
      let bonusAwarded = false;

      if (lastContribution) {
        const daysDiff = this.getDaysDifference(lastContribution, now);

        if (daysDiff === 0) {
          // Same day, no streak update
          return { streak: gamification.contributionStreak, bonusAwarded: false };
        } else if (daysDiff === 1) {
          // Consecutive day
          newStreak = gamification.contributionStreak + 1;
          bonusAwarded = true;
        } else {
          // Streak broken
          newStreak = 1;
        }
      }

      await tx.userGamification.update({
        where: { userId },
        data: {
          contributionStreak: newStreak,
          lastContribution: now,
        },
      });

      // Award streak bonus if applicable
      if (bonusAwarded && newStreak > 1) {
        await pointsService.awardPoints(
          userId,
          POINTS_CONFIG.STREAK_BONUS,
          `Contribution streak: ${newStreak} days`,
          `streak-${userId}-${now.toISOString().split('T')[0]}`,
          undefined,
          { streakDays: newStreak }
        );
      }

      logger.info('Contribution streak updated', {
        userId,
        newStreak,
        bonusAwarded,
      });

      return { streak: newStreak, bonusAwarded };
    });
  }

  async updateLoginStreak(userId: string): Promise<{ streak: number }> {
    return await prisma.$transaction(async (tx) => {
      const gamification = await tx.userGamification.findUnique({
        where: { userId },
      });

      if (!gamification) {
        await tx.userGamification.create({
          data: {
            userId,
            loginStreak: 1,
            lastLogin: new Date(),
          },
        });
        return { streak: 1 };
      }

      const now = new Date();
      const lastLogin = gamification.lastLogin;

      // Check if already logged in today
      if (lastLogin && this.isSameDay(lastLogin, now)) {
        return { streak: gamification.loginStreak };
      }

      let newStreak = 1;

      if (lastLogin) {
        const daysDiff = this.getDaysDifference(lastLogin, now);
        if (daysDiff === 1) {
          newStreak = gamification.loginStreak + 1;
        }
      }

      await tx.userGamification.update({
        where: { userId },
        data: {
          loginStreak: newStreak,
          lastLogin: now,
        },
      });

      logger.info('Login streak updated', { userId, newStreak });

      return { streak: newStreak };
    });
  }

  private getDaysDifference(date1: Date, date2: Date): number {
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  async getStreaks(userId: string): Promise<{
    contributionStreak: number;
    loginStreak: number;
  }> {
    const gamification = await prisma.userGamification.findUnique({
      where: { userId },
      select: {
        contributionStreak: true,
        loginStreak: true,
      },
    });

    return {
      contributionStreak: gamification?.contributionStreak || 0,
      loginStreak: gamification?.loginStreak || 0,
    };
  }
}

export const streakService = new StreakService();

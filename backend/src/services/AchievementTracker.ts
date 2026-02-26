import { PrismaClient } from '@prisma/client';
import { RewardEngine } from './RewardEngine';

/**
 * Service for tracking user actions and unlocking achievements
 */
export class AchievementTracker {
  constructor(
    private prisma: PrismaClient,
    private rewardEngine: RewardEngine
  ) {}

  /**
   * Handle group creation event
   * @param userId - User who created the group
   * @param groupId - Created group ID
   */
  async handleGroupCreation(userId: string, groupId: string): Promise<void> {
    // Check if this is user's first group
    const groupCount = await this.prisma.group.count({
      where: {
        members: {
          some: { userId },
        },
      },
    });

    if (groupCount === 1) {
      // First group created - unlock achievement
      await this.unlockAchievement(userId, 'first_group_created');
    }
  }

  /**
   * Handle contribution completion event
   * @param userId - User who made contribution
   * @param contributionId - Contribution ID
   */
  async handleContributionComplete(userId: string, contributionId: string): Promise<void> {
    // Increment successful contribution count
    const contributionCount = await this.prisma.contribution.count({
      where: { userId },
    });

    // Check for 10 contributions achievement
    if (contributionCount === 10) {
      await this.unlockAchievement(userId, 'ten_contributions');
    }
  }

  /**
   * Handle cycle completion event
   * @param userId - User who completed cycle
   * @param groupId - Group ID
   * @param hadLatePayment - Whether user had any late payments in this cycle
   */
  async handleCycleComplete(
    userId: string,
    groupId: string,
    hadLatePayment: boolean
  ): Promise<void> {
    // Get or create user gamification record
    const gamification = await this.prisma.userGamification.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    if (hadLatePayment) {
      // Reset perfect cycle count
      await this.prisma.userGamification.update({
        where: { userId },
        data: { contributionStreak: 0 },
      });
    } else {
      // Increment perfect cycle count
      const newStreak = (gamification.contributionStreak || 0) + 1;

      await this.prisma.userGamification.update({
        where: { userId },
        data: { contributionStreak: newStreak },
      });

      // Check for perfect attendance achievement (3 consecutive perfect cycles)
      if (newStreak === 3) {
        await this.unlockAchievement(userId, 'perfect_attendance');
      }
    }
  }

  /**
   * Handle referral completion event
   * @param referrerId - User who made the referral
   */
  async handleReferralComplete(referrerId: string): Promise<void> {
    // Count completed referrals (where referee has made at least one contribution)
    const completedReferrals = await this.prisma.referral.count({
      where: {
        referrerId,
        status: 'COMPLETED',
      },
    });

    // Check for community helper achievement (5 completed referrals)
    if (completedReferrals === 5) {
      await this.unlockAchievement(referrerId, 'community_helper');
    }
  }

  /**
   * Unlock an achievement for a user
   * @param userId - User ID
   * @param achievementId - Achievement identifier
   */
  private async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    // Check if achievement already unlocked
    const existing = await this.prisma.userAchievement.findFirst({
      where: {
        userId,
        achievement: {
          name: achievementId,
        },
      },
    });

    if (existing) {
      return; // Already unlocked
    }

    // Get achievement from database
    const achievement = await this.prisma.achievement.findUnique({
      where: { name: achievementId },
    });

    if (!achievement) {
      // Achievement doesn't exist in database yet
      // This would be seeded from the configuration
      return;
    }

    // Create achievement unlock record
    await this.prisma.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
      },
    });

    // Create activity feed entry
    await this.prisma.activityFeed.create({
      data: {
        userId,
        type: 'ACHIEVEMENT',
        title: `Achievement Unlocked: ${achievement.name}`,
        description: achievement.description,
        metadata: JSON.stringify({ achievementId }),
      },
    });

    // Distribute achievement rewards
    await this.rewardEngine.distributeAchievementReward(userId, achievementId);
  }

  /**
   * Get user's unlocked achievements
   * @param userId - User ID
   * @returns List of unlocked achievements
   */
  async getUserAchievements(userId: string): Promise<any[]> {
    return this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });
  }

  /**
   * Get achievement progress for a user
   * @param userId - User ID
   * @param achievementId - Achievement identifier
   * @returns Progress information
   */
  async getAchievementProgress(
    userId: string,
    achievementId: string
  ): Promise<{ current: number; required: number; unlocked: boolean }> {
    let current = 0;
    let required = 0;

    switch (achievementId) {
      case 'first_group_created':
        current = await this.prisma.group.count({
          where: {
            members: {
              some: { userId },
            },
          },
        });
        required = 1;
        break;

      case 'ten_contributions':
        current = await this.prisma.contribution.count({
          where: { userId },
        });
        required = 10;
        break;

      case 'perfect_attendance':
        const gamification = await this.prisma.userGamification.findUnique({
          where: { userId },
        });
        current = gamification?.contributionStreak || 0;
        required = 3;
        break;

      case 'community_helper':
        current = await this.prisma.referral.count({
          where: {
            referrerId: userId,
            status: 'COMPLETED',
          },
        });
        required = 5;
        break;
    }

    const unlocked = await this.prisma.userAchievement.findFirst({
      where: {
        userId,
        achievement: {
          name: achievementId,
        },
      },
    });

    return {
      current,
      required,
      unlocked: unlocked !== null,
    };
  }
}

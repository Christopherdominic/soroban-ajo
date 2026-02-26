import { prisma } from '../../config/database';
import { logger } from '../../utils/logger';
import {
  AchievementNotFoundError,
  DuplicateRewardError,
} from '../../errors/GamificationError';
import {
  AchievementCategory,
  AchievementRequirement,
  achievementRequirementSchema,
  RewardType,
} from '../../types/gamification';
import { pointsService } from './PointsService';

export class AchievementService {
  async checkAndAwardAchievements(userId: string): Promise<string[]> {
    const awardedIds: string[] = [];

    const [gamification, contributions, achievements, existingAchievements] =
      await Promise.all([
        prisma.userGamification.findUnique({ where: { userId } }),
        prisma.contribution.count({ where: { userId } }),
        prisma.achievement.findMany({ where: { isActive: true } }),
        prisma.userAchievement.findMany({
          where: { userId },
          select: { achievementId: true },
        }),
      ]);

    if (!gamification) return awardedIds;

    const existingIds = new Set(existingAchievements.map((a) => a.achievementId));

    for (const achievement of achievements) {
      if (existingIds.has(achievement.id)) continue;

      const requirement = this.parseRequirement(achievement.requirement);
      const shouldAward = await this.checkRequirement(
        userId,
        achievement.category as AchievementCategory,
        requirement,
        gamification,
        contributions
      );

      if (shouldAward) {
        try {
          await this.awardAchievement(userId, achievement.id);
          awardedIds.push(achievement.id);
        } catch (error) {
          if (error instanceof DuplicateRewardError) {
            // Already awarded, skip
            continue;
          }
          throw error;
        }
      }
    }

    return awardedIds;
  }

  private async checkRequirement(
    userId: string,
    category: AchievementCategory,
    requirement: AchievementRequirement,
    gamification: { contributionStreak: number; totalInvites: number; groupsCompleted: number },
    contributionCount: number
  ): Promise<boolean> {
    switch (category) {
      case AchievementCategory.CONTRIBUTION:
        if (requirement.type === 'first' && contributionCount >= 1) return true;
        if (requirement.type === 'count' && contributionCount >= (requirement.count || 0))
          return true;
        if (
          requirement.type === 'streak' &&
          gamification.contributionStreak >= (requirement.days || 0)
        )
          return true;
        break;

      case AchievementCategory.SOCIAL:
        if (requirement.type === 'invites' && gamification.totalInvites >= (requirement.count || 0))
          return true;
        if (requirement.type === 'follows') {
          const followCount = await prisma.userFollow.count({
            where: { followerId: userId },
          });
          if (followCount >= (requirement.count || 0)) return true;
        }
        break;

      case AchievementCategory.MILESTONE:
        if (
          requirement.type === 'groups' &&
          gamification.groupsCompleted >= (requirement.count || 0)
        )
          return true;
        break;

      case AchievementCategory.SPECIAL:
        // Special achievements require manual awarding
        return false;
    }

    return false;
  }

  async awardAchievement(userId: string, achievementId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Check for duplicate
      const existing = await tx.rewardHistory.findUnique({
        where: {
          userId_rewardType_rewardId: {
            userId,
            rewardType: RewardType.ACHIEVEMENT,
            rewardId: achievementId,
          },
        },
      });

      if (existing) {
        throw new DuplicateRewardError(`Achievement already awarded: ${achievementId}`);
      }

      const achievement = await tx.achievement.findUnique({
        where: { id: achievementId },
      });

      if (!achievement) {
        throw new AchievementNotFoundError(achievementId);
      }

      // Create user achievement
      await tx.userAchievement.create({
        data: { userId, achievementId },
      });

      // Record reward
      await tx.rewardHistory.create({
        data: {
          userId,
          rewardType: RewardType.ACHIEVEMENT,
          rewardId: achievementId,
          points: achievement.points,
          metadata: JSON.stringify({ achievementName: achievement.name }),
        },
      });

      // Award points
      await pointsService.awardPoints(
        userId,
        achievement.points,
        `Achievement unlocked: ${achievement.name}`,
        achievementId,
        undefined,
        { achievementName: achievement.name }
      );

      logger.info('Achievement awarded', {
        userId,
        achievementId,
        achievementName: achievement.name,
        points: achievement.points,
      });
    });
  }

  private parseRequirement(requirementJson: string): AchievementRequirement {
    const parsed = JSON.parse(requirementJson);
    const validated = achievementRequirementSchema.parse(parsed);
    return validated;
  }

  async getUserAchievements(userId: string): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      category: string;
      points: number;
      unlockedAt: Date;
    }>
  > {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            category: true,
            points: true,
          },
        },
      },
      orderBy: { unlockedAt: 'desc' },
    });

    return userAchievements.map((ua) => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      category: ua.achievement.category,
      points: ua.achievement.points,
      unlockedAt: ua.unlockedAt,
    }));
  }
}

export const achievementService = new AchievementService();

import { prisma } from '../../config/database';
import { logger } from '../../utils/logger';
import { DuplicateRewardError } from '../../errors/GamificationError';
import { ReferenceType, UserLevel, LEVEL_THRESHOLDS } from '../../types/gamification';

export class PointsService {
  async awardPoints(
    userId: string,
    points: number,
    reason: string,
    referenceId?: string,
    referenceType?: ReferenceType,
    metadata?: Record<string, unknown>
  ): Promise<{ points: number; newLevel?: UserLevel; leveledUp: boolean }> {
    if (points <= 0) {
      throw new Error('Points must be positive');
    }

    return await prisma.$transaction(async (tx) => {
      // Check for duplicate reward if referenceId provided
      if (referenceId && referenceType) {
        const existing = await tx.pointTransaction.findUnique({
          where: {
            userId_referenceId_referenceType: {
              userId,
              referenceId,
              referenceType,
            },
          },
        });

        if (existing) {
          throw new DuplicateRewardError(
            `Points already awarded for ${referenceType}: ${referenceId}`
          );
        }
      }

      // Create point transaction
      await tx.pointTransaction.create({
        data: {
          userId,
          points,
          reason,
          referenceId: referenceId || null,
          referenceType: referenceType || null,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });

      // Update user gamification
      const gamification = await tx.userGamification.upsert({
        where: { userId },
        update: {
          points: { increment: points },
          updatedAt: new Date(),
        },
        create: {
          userId,
          points,
          level: UserLevel.BRONZE,
        },
      });

      const newPoints = gamification.points + points;
      const currentLevel = gamification.level as UserLevel;
      const newLevel = this.calculateLevel(newPoints);
      const leveledUp = newLevel !== currentLevel;

      // Update level if changed
      if (leveledUp) {
        await tx.userGamification.update({
          where: { userId },
          data: { level: newLevel },
        });
      }

      logger.info('Points awarded', {
        userId,
        points,
        reason,
        referenceId,
        referenceType,
        newPoints,
        leveledUp,
        newLevel: leveledUp ? newLevel : undefined,
      });

      return {
        points: newPoints,
        newLevel: leveledUp ? newLevel : undefined,
        leveledUp,
      };
    });
  }

  calculateLevel(points: number): UserLevel {
    if (points >= LEVEL_THRESHOLDS[UserLevel.PLATINUM]) return UserLevel.PLATINUM;
    if (points >= LEVEL_THRESHOLDS[UserLevel.GOLD]) return UserLevel.GOLD;
    if (points >= LEVEL_THRESHOLDS[UserLevel.SILVER]) return UserLevel.SILVER;
    return UserLevel.BRONZE;
  }

  async getUserPoints(userId: string): Promise<number> {
    const gamification = await prisma.userGamification.findUnique({
      where: { userId },
      select: { points: true },
    });

    return gamification?.points || 0;
  }

  async getPointHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Array<{
    id: string;
    points: number;
    reason: string;
    referenceType: string | null;
    createdAt: Date;
  }>> {
    return await prisma.pointTransaction.findMany({
      where: { userId },
      select: {
        id: true,
        points: true,
        reason: true,
        referenceType: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }
}

export const pointsService = new PointsService();

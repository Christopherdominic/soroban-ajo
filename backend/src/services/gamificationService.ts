import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export enum UserLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export enum AchievementCategory {
  CONTRIBUTION = 'CONTRIBUTION',
  SOCIAL = 'SOCIAL',
  MILESTONE = 'MILESTONE',
  SPECIAL = 'SPECIAL',
}

export enum ChallengeType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  SEASONAL = 'SEASONAL',
}

export enum ActivityType {
  CONTRIBUTION = 'CONTRIBUTION',
  ACHIEVEMENT = 'ACHIEVEMENT',
  CHALLENGE = 'CHALLENGE',
  LEVEL_UP = 'LEVEL_UP',
  GROUP_COMPLETE = 'GROUP_COMPLETE',
}

const LEVEL_THRESHOLDS = {
  [UserLevel.BRONZE]: 0,
  [UserLevel.SILVER]: 1000,
  [UserLevel.GOLD]: 5000,
  [UserLevel.PLATINUM]: 15000,
};

const POINTS_CONFIG = {
  CONTRIBUTION: 50,
  INVITE_FRIEND: 100,
  GROUP_COMPLETE: 500,
  DAILY_LOGIN: 10,
  STREAK_BONUS: 25,
  CHALLENGE_COMPLETE: 200,
};

export class GamificationService {
  // Initialize user gamification profile
  async initializeUserGamification(walletAddress: string) {
    try {
      return await prisma.userGamification.upsert({
        where: { userId: walletAddress },
        update: {},
        create: {
          userId: walletAddress,
          points: 0,
          level: UserLevel.BRONZE,
          contributionStreak: 0,
          loginStreak: 0,
        },
      });
    } catch (error) {
      logger.error('Failed to initialize user gamification', { error, walletAddress });
      throw error;
    }
  }

  // Award points to user
  async awardPoints(walletAddress: string, points: number, reason: string) {
    try {
      const gamification = await prisma.userGamification.upsert({
        where: { userId: walletAddress },
        update: {
          points: { increment: points },
        },
        create: {
          userId: walletAddress,
          points,
          level: UserLevel.BRONZE,
        },
      });

      // Check for level up
      const newLevel = this.calculateLevel(gamification.points);
      if (newLevel !== gamification.level) {
        await this.levelUp(walletAddress, newLevel);
      }

      // Create activity feed entry
      await this.createActivity(walletAddress, ActivityType.CONTRIBUTION, 'Points Earned', `Earned ${points} points for ${reason}`);

      return gamification;
    } catch (error) {
      logger.error('Failed to award points', { error, walletAddress, points });
      throw error;
    }
  }

  // Calculate user level based on points
  calculateLevel(points: number): UserLevel {
    if (points >= LEVEL_THRESHOLDS[UserLevel.PLATINUM]) return UserLevel.PLATINUM;
    if (points >= LEVEL_THRESHOLDS[UserLevel.GOLD]) return UserLevel.GOLD;
    if (points >= LEVEL_THRESHOLDS[UserLevel.SILVER]) return UserLevel.SILVER;
    return UserLevel.BRONZE;
  }

  // Level up user
  async levelUp(walletAddress: string, newLevel: UserLevel) {
    try {
      await prisma.userGamification.update({
        where: { userId: walletAddress },
        data: { level: newLevel },
      });

      await this.createActivity(
        walletAddress,
        ActivityType.LEVEL_UP,
        'Level Up!',
        `Congratulations! You've reached ${newLevel} level`
      );

      logger.info('User leveled up', { walletAddress, newLevel });
    } catch (error) {
      logger.error('Failed to level up user', { error, walletAddress, newLevel });
      throw error;
    }
  }

  // Handle contribution event
  async handleContribution(walletAddress: string) {
    try {
      const gamification = await this.initializeUserGamification(walletAddress);
      
      // Award contribution points
      await this.awardPoints(walletAddress, POINTS_CONFIG.CONTRIBUTION, 'making a contribution');

      // Update contribution streak
      const now = new Date();
      const lastContribution = gamification.lastContribution;
      let newStreak = 1;

      if (lastContribution) {
        const daysDiff = Math.floor((now.getTime() - lastContribution.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          newStreak = gamification.contributionStreak + 1;
          // Award streak bonus
          await this.awardPoints(walletAddress, POINTS_CONFIG.STREAK_BONUS, 'contribution streak');
        } else if (daysDiff > 1) {
          newStreak = 1;
        } else {
          newStreak = gamification.contributionStreak;
        }
      }

      await prisma.userGamification.update({
        where: { userId: walletAddress },
        data: {
          contributionStreak: newStreak,
          lastContribution: now,
        },
      });

      // Check for achievements
      await this.checkAchievements(walletAddress);
      await this.updateChallengeProgress(walletAddress, 'CONTRIBUTION');

      return { points: POINTS_CONFIG.CONTRIBUTION, streak: newStreak };
    } catch (error) {
      logger.error('Failed to handle contribution', { error, walletAddress });
      throw error;
    }
  }

  // Handle group completion
  async handleGroupCompletion(walletAddress: string) {
    try {
      await this.awardPoints(walletAddress, POINTS_CONFIG.GROUP_COMPLETE, 'completing a group');
      
      await prisma.userGamification.update({
        where: { userId: walletAddress },
        data: {
          groupsCompleted: { increment: 1 },
        },
      });

      await this.createActivity(
        walletAddress,
        ActivityType.GROUP_COMPLETE,
        'Group Completed',
        'Successfully completed a savings group'
      );

      await this.checkAchievements(walletAddress);
      await this.updateChallengeProgress(walletAddress, 'GROUP_COMPLETE');
    } catch (error) {
      logger.error('Failed to handle group completion', { error, walletAddress });
      throw error;
    }
  }

  // Handle friend invite
  async handleInvite(walletAddress: string) {
    try {
      await this.awardPoints(walletAddress, POINTS_CONFIG.INVITE_FRIEND, 'inviting a friend');
      
      await prisma.userGamification.update({
        where: { userId: walletAddress },
        data: {
          totalInvites: { increment: 1 },
        },
      });

      await this.checkAchievements(walletAddress);
      await this.updateChallengeProgress(walletAddress, 'INVITE');
    } catch (error) {
      logger.error('Failed to handle invite', { error, walletAddress });
      throw error;
    }
  }

  // Handle daily login
  async handleLogin(walletAddress: string) {
    try {
      const gamification = await this.initializeUserGamification(walletAddress);
      
      const now = new Date();
      const lastLogin = gamification.lastLogin;
      
      if (!lastLogin || this.isDifferentDay(lastLogin, now)) {
        await this.awardPoints(walletAddress, POINTS_CONFIG.DAILY_LOGIN, 'daily login');

        let newStreak = 1;
        if (lastLogin) {
          const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === 1) {
            newStreak = gamification.loginStreak + 1;
          }
        }

        await prisma.userGamification.update({
          where: { userId: walletAddress },
          data: {
            loginStreak: newStreak,
            lastLogin: now,
          },
        });

        await this.updateChallengeProgress(walletAddress, 'LOGIN');
      }
    } catch (error) {
      logger.error('Failed to handle login', { error, walletAddress });
      throw error;
    }
  }

  // Check and award achievements
  async checkAchievements(walletAddress: string) {
    try {
      const gamification = await prisma.userGamification.findUnique({
        where: { userId: walletAddress },
      });

      if (!gamification) return;

      const contributions = await prisma.contribution.count({
        where: { userId: walletAddress },
      });

      const achievements = await prisma.achievement.findMany();

      for (const achievement of achievements) {
        const requirement = JSON.parse(achievement.requirement);
        let shouldAward = false;

        switch (achievement.category) {
          case AchievementCategory.CONTRIBUTION:
            if (requirement.type === 'first' && contributions >= 1) shouldAward = true;
            if (requirement.type === 'count' && contributions >= requirement.count) shouldAward = true;
            if (requirement.type === 'streak' && gamification.contributionStreak >= requirement.days) shouldAward = true;
            break;
          case AchievementCategory.SOCIAL:
            if (requirement.type === 'invites' && gamification.totalInvites >= requirement.count) shouldAward = true;
            break;
          case AchievementCategory.MILESTONE:
            if (requirement.type === 'groups' && gamification.groupsCompleted >= requirement.count) shouldAward = true;
            break;
        }

        if (shouldAward) {
          await this.awardAchievement(walletAddress, achievement.id);
        }
      }
    } catch (error) {
      logger.error('Failed to check achievements', { error, walletAddress });
    }
  }

  // Award achievement to user
  async awardAchievement(walletAddress: string, achievementId: string) {
    try {
      const existing = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId: walletAddress,
            achievementId,
          },
        },
      });

      if (existing) return;

      const achievement = await prisma.achievement.findUnique({
        where: { id: achievementId },
      });

      if (!achievement) return;

      await prisma.userAchievement.create({
        data: {
          userId: walletAddress,
          achievementId,
        },
      });

      await this.awardPoints(walletAddress, achievement.points, `unlocking ${achievement.name}`);

      await this.createActivity(
        walletAddress,
        ActivityType.ACHIEVEMENT,
        'Achievement Unlocked!',
        `Unlocked: ${achievement.name}`
      );

      logger.info('Achievement awarded', { walletAddress, achievement: achievement.name });
    } catch (error) {
      logger.error('Failed to award achievement', { error, walletAddress, achievementId });
    }
  }

  // Update challenge progress
  async updateChallengeProgress(walletAddress: string, actionType: string) {
    try {
      const activeChallenges = await prisma.challenge.findMany({
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });

      for (const challenge of activeChallenges) {
        const requirement = JSON.parse(challenge.requirement);
        
        if (requirement.actionType === actionType) {
          const userChallenge = await prisma.userChallenge.upsert({
            where: {
              userId_challengeId: {
                userId: walletAddress,
                challengeId: challenge.id,
              },
            },
            update: {
              progress: { increment: 1 },
            },
            create: {
              userId: walletAddress,
              challengeId: challenge.id,
              progress: 1,
            },
          });

          // Check if challenge is completed
          if (userChallenge.progress >= requirement.target && !userChallenge.completed) {
            await this.completeChallenge(walletAddress, challenge.id);
          }
        }
      }
    } catch (error) {
      logger.error('Failed to update challenge progress', { error, walletAddress });
    }
  }

  // Complete challenge
  async completeChallenge(walletAddress: string, challengeId: string) {
    try {
      const challenge = await prisma.challenge.findUnique({
        where: { id: challengeId },
      });

      if (!challenge) return;

      await prisma.userChallenge.update({
        where: {
          userId_challengeId: {
            userId: walletAddress,
            challengeId,
          },
        },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });

      await this.awardPoints(walletAddress, challenge.points, `completing ${challenge.name}`);

      await this.createActivity(
        walletAddress,
        ActivityType.CHALLENGE,
        'Challenge Completed!',
        `Completed: ${challenge.name}`
      );

      logger.info('Challenge completed', { walletAddress, challenge: challenge.name });
    } catch (error) {
      logger.error('Failed to complete challenge', { error, walletAddress, challengeId });
    }
  }

  // Get user gamification stats
  async getUserStats(walletAddress: string) {
    try {
      const gamification = await prisma.userGamification.findUnique({
        where: { userId: walletAddress },
      });

      const achievements = await prisma.userAchievement.findMany({
        where: { userId: walletAddress },
        include: { achievement: true },
      });

      const challenges = await prisma.userChallenge.findMany({
        where: { userId: walletAddress },
        include: { challenge: true },
      });

      return {
        gamification,
        achievements,
        challenges,
      };
    } catch (error) {
      logger.error('Failed to get user stats', { error, walletAddress });
      throw error;
    }
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 100) {
    try {
      return await prisma.userGamification.findMany({
        take: limit,
        orderBy: { points: 'desc' },
        include: {
          user: {
            select: {
              walletAddress: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to get leaderboard', { error });
      throw error;
    }
  }

  // Create activity feed entry
  async createActivity(walletAddress: string, type: ActivityType, title: string, description: string, metadata?: any) {
    try {
      await prisma.activityFeed.create({
        data: {
          userId: walletAddress,
          type,
          title,
          description,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
    } catch (error) {
      logger.error('Failed to create activity', { error, walletAddress });
    }
  }

  // Get user activity feed
  async getActivityFeed(walletAddress: string, limit: number = 50) {
    try {
      return await prisma.activityFeed.findMany({
        where: { userId: walletAddress },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      logger.error('Failed to get activity feed', { error, walletAddress });
      throw error;
    }
  }

  // Follow user
  async followUser(followerId: string, followingId: string) {
    try {
      await prisma.userFollow.create({
        data: {
          followerId,
          followingId,
        },
      });

      await this.updateChallengeProgress(followerId, 'FOLLOW');
    } catch (error) {
      logger.error('Failed to follow user', { error, followerId, followingId });
      throw error;
    }
  }

  // Unfollow user
  async unfollowUser(followerId: string, followingId: string) {
    try {
      await prisma.userFollow.deleteMany({
        where: {
          followerId,
          followingId,
        },
      });
    } catch (error) {
      logger.error('Failed to unfollow user', { error, followerId, followingId });
      throw error;
    }
  }

  // Get user followers
  async getFollowers(walletAddress: string) {
    try {
      return await prisma.userFollow.findMany({
        where: { followingId: walletAddress },
        include: {
          follower: {
            include: {
              gamification: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to get followers', { error, walletAddress });
      throw error;
    }
  }

  // Get user following
  async getFollowing(walletAddress: string) {
    try {
      return await prisma.userFollow.findMany({
        where: { followerId: walletAddress },
        include: {
          following: {
            include: {
              gamification: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Failed to get following', { error, walletAddress });
      throw error;
    }
  }

  // Helper: Check if two dates are different days
  private isDifferentDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() !== date2.getFullYear() ||
      date1.getMonth() !== date2.getMonth() ||
      date1.getDate() !== date2.getDate()
    );
  }
}

export const gamificationService = new GamificationService();

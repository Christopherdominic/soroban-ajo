import { gamificationService, UserLevel } from '../../src/services/gamificationService';
import { prisma } from '../../src/config/database';

// Mock Prisma
jest.mock('../../src/config/database', () => ({
  prisma: {
    userGamification: {
      upsert: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    achievement: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    userAchievement: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    challenge: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    userChallenge: {
      upsert: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    contribution: {
      count: jest.fn(),
    },
    activityFeed: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    userFollow: {
      create: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('GamificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeUserGamification', () => {
    it('should create new user gamification profile', async () => {
      const mockProfile = {
        id: '1',
        userId: 'test-wallet',
        points: 0,
        level: UserLevel.BRONZE,
        contributionStreak: 0,
        loginStreak: 0,
        totalInvites: 0,
        groupsCompleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.userGamification.upsert as jest.Mock).mockResolvedValue(mockProfile);

      const result = await gamificationService.initializeUserGamification('test-wallet');

      expect(result).toEqual(mockProfile);
      expect(prisma.userGamification.upsert).toHaveBeenCalledWith({
        where: { userId: 'test-wallet' },
        update: {},
        create: {
          userId: 'test-wallet',
          points: 0,
          level: UserLevel.BRONZE,
          contributionStreak: 0,
          loginStreak: 0,
        },
      });
    });
  });

  describe('awardPoints', () => {
    it('should award points and check for level up', async () => {
      const mockProfile = {
        id: '1',
        userId: 'test-wallet',
        points: 150,
        level: UserLevel.BRONZE,
        contributionStreak: 0,
        loginStreak: 0,
        totalInvites: 0,
        groupsCompleted: 0,
      };

      (prisma.userGamification.upsert as jest.Mock).mockResolvedValue(mockProfile);
      (prisma.activityFeed.create as jest.Mock).mockResolvedValue({});

      await gamificationService.awardPoints('test-wallet', 50, 'test');

      expect(prisma.userGamification.upsert).toHaveBeenCalled();
      expect(prisma.activityFeed.create).toHaveBeenCalled();
    });
  });

  describe('calculateLevel', () => {
    it('should return BRONZE for 0-999 points', () => {
      expect(gamificationService.calculateLevel(0)).toBe(UserLevel.BRONZE);
      expect(gamificationService.calculateLevel(999)).toBe(UserLevel.BRONZE);
    });

    it('should return SILVER for 1000-4999 points', () => {
      expect(gamificationService.calculateLevel(1000)).toBe(UserLevel.SILVER);
      expect(gamificationService.calculateLevel(4999)).toBe(UserLevel.SILVER);
    });

    it('should return GOLD for 5000-14999 points', () => {
      expect(gamificationService.calculateLevel(5000)).toBe(UserLevel.GOLD);
      expect(gamificationService.calculateLevel(14999)).toBe(UserLevel.GOLD);
    });

    it('should return PLATINUM for 15000+ points', () => {
      expect(gamificationService.calculateLevel(15000)).toBe(UserLevel.PLATINUM);
      expect(gamificationService.calculateLevel(50000)).toBe(UserLevel.PLATINUM);
    });
  });

  describe('handleContribution', () => {
    it('should award points and update streak', async () => {
      const mockProfile = {
        id: '1',
        userId: 'test-wallet',
        points: 0,
        level: UserLevel.BRONZE,
        contributionStreak: 0,
        loginStreak: 0,
        lastContribution: null,
        totalInvites: 0,
        groupsCompleted: 0,
      };

      (prisma.userGamification.upsert as jest.Mock).mockResolvedValue(mockProfile);
      (prisma.userGamification.update as jest.Mock).mockResolvedValue({});
      (prisma.activityFeed.create as jest.Mock).mockResolvedValue({});
      (prisma.achievement.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.contribution.count as jest.Mock).mockResolvedValue(1);
      (prisma.challenge.findMany as jest.Mock).mockResolvedValue([]);

      const result = await gamificationService.handleContribution('test-wallet');

      expect(result).toHaveProperty('points', 50);
      expect(result).toHaveProperty('streak', 1);
    });
  });

  describe('handleGroupCompletion', () => {
    it('should award points and increment completion count', async () => {
      (prisma.userGamification.upsert as jest.Mock).mockResolvedValue({});
      (prisma.userGamification.update as jest.Mock).mockResolvedValue({});
      (prisma.activityFeed.create as jest.Mock).mockResolvedValue({});
      (prisma.achievement.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.contribution.count as jest.Mock).mockResolvedValue(1);
      (prisma.challenge.findMany as jest.Mock).mockResolvedValue([]);

      await gamificationService.handleGroupCompletion('test-wallet');

      expect(prisma.userGamification.update).toHaveBeenCalledWith({
        where: { userId: 'test-wallet' },
        data: {
          groupsCompleted: { increment: 1 },
        },
      });
    });
  });

  describe('getLeaderboard', () => {
    it('should return top users by points', async () => {
      const mockLeaderboard = [
        {
          id: '1',
          userId: 'wallet1',
          points: 5000,
          level: UserLevel.GOLD,
          contributionStreak: 10,
          user: { walletAddress: 'wallet1' },
        },
        {
          id: '2',
          userId: 'wallet2',
          points: 3000,
          level: UserLevel.SILVER,
          contributionStreak: 5,
          user: { walletAddress: 'wallet2' },
        },
      ];

      (prisma.userGamification.findMany as jest.Mock).mockResolvedValue(mockLeaderboard);

      const result = await gamificationService.getLeaderboard(100);

      expect(result).toEqual(mockLeaderboard);
      expect(prisma.userGamification.findMany).toHaveBeenCalledWith({
        take: 100,
        orderBy: { points: 'desc' },
        include: {
          user: {
            select: {
              walletAddress: true,
            },
          },
        },
      });
    });
  });

  describe('followUser', () => {
    it('should create follow relationship', async () => {
      (prisma.userFollow.create as jest.Mock).mockResolvedValue({});
      (prisma.challenge.findMany as jest.Mock).mockResolvedValue([]);

      await gamificationService.followUser('follower', 'following');

      expect(prisma.userFollow.create).toHaveBeenCalledWith({
        data: {
          followerId: 'follower',
          followingId: 'following',
        },
      });
    });
  });

  describe('unfollowUser', () => {
    it('should remove follow relationship', async () => {
      (prisma.userFollow.deleteMany as jest.Mock).mockResolvedValue({});

      await gamificationService.unfollowUser('follower', 'following');

      expect(prisma.userFollow.deleteMany).toHaveBeenCalledWith({
        where: {
          followerId: 'follower',
          followingId: 'following',
        },
      });
    });
  });

  describe('getActivityFeed', () => {
    it('should return user activities', async () => {
      const mockActivities = [
        {
          id: '1',
          userId: 'test-wallet',
          type: 'CONTRIBUTION',
          title: 'Points Earned',
          description: 'Earned 50 points',
          createdAt: new Date(),
        },
      ];

      (prisma.activityFeed.findMany as jest.Mock).mockResolvedValue(mockActivities);

      const result = await gamificationService.getActivityFeed('test-wallet', 50);

      expect(result).toEqual(mockActivities);
      expect(prisma.activityFeed.findMany).toHaveBeenCalledWith({
        where: { userId: 'test-wallet' },
        take: 50,
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});

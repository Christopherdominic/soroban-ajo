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

export interface UserGamification {
  id: string;
  userId: string;
  points: number;
  level: UserLevel;
  contributionStreak: number;
  loginStreak: number;
  lastContribution?: string;
  lastLogin?: string;
  totalInvites: number;
  groupsCompleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  points: number;
  requirement: string;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  achievement: Achievement;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  category: string;
  requirement: string;
  points: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  challenge: Challenge;
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  metadata?: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  points: number;
  level: UserLevel;
  contributionStreak: number;
  user: {
    walletAddress: string;
  };
}

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  rewards: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserStats {
  gamification: UserGamification | null;
  achievements: UserAchievement[];
  challenges: UserChallenge[];
}

export interface LevelConfig {
  name: UserLevel;
  minPoints: number;
  color: string;
  icon: string;
  benefits: string[];
}

export const LEVEL_CONFIGS: Record<UserLevel, LevelConfig> = {
  [UserLevel.BRONZE]: {
    name: UserLevel.BRONZE,
    minPoints: 0,
    color: 'text-amber-700',
    icon: '🥉',
    benefits: ['Basic features', 'Join groups', 'Make contributions'],
  },
  [UserLevel.SILVER]: {
    name: UserLevel.SILVER,
    minPoints: 1000,
    color: 'text-gray-400',
    icon: '🥈',
    benefits: ['Create groups', 'Invite friends', 'Priority support'],
  },
  [UserLevel.GOLD]: {
    name: UserLevel.GOLD,
    minPoints: 5000,
    color: 'text-yellow-500',
    icon: '🥇',
    benefits: ['Custom group settings', 'Advanced analytics', 'Exclusive events'],
  },
  [UserLevel.PLATINUM]: {
    name: UserLevel.PLATINUM,
    minPoints: 15000,
    color: 'text-purple-500',
    icon: '💎',
    benefits: ['All features', 'VIP support', 'Special rewards', 'Beta access'],
  },
};

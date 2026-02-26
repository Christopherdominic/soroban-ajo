import { z } from 'zod';

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

export enum RewardType {
  ACHIEVEMENT = 'ACHIEVEMENT',
  CHALLENGE = 'CHALLENGE',
  STREAK = 'STREAK',
  LEVEL_UP = 'LEVEL_UP',
}

export enum ReferenceType {
  CONTRIBUTION = 'CONTRIBUTION',
  INVITE = 'INVITE',
  GROUP_COMPLETE = 'GROUP_COMPLETE',
  LOGIN = 'LOGIN',
  PROFILE_COMPLETE = 'PROFILE_COMPLETE',
}

export const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
  [UserLevel.BRONZE]: 0,
  [UserLevel.SILVER]: 1000,
  [UserLevel.GOLD]: 5000,
  [UserLevel.PLATINUM]: 15000,
};

export const POINTS_CONFIG = {
  CONTRIBUTION: 50,
  INVITE_FRIEND: 100,
  GROUP_COMPLETE: 500,
  DAILY_LOGIN: 10,
  STREAK_BONUS: 25,
  CHALLENGE_COMPLETE: 200,
} as const;

export interface AchievementRequirement {
  type: 'first' | 'count' | 'streak' | 'invites' | 'groups' | 'follows' | 'special';
  count?: number;
  days?: number;
  code?: string;
}

export interface ChallengeRequirement {
  actionType: string;
  target: number;
}

export const achievementRequirementSchema = z.object({
  type: z.enum(['first', 'count', 'streak', 'invites', 'groups', 'follows', 'special']),
  count: z.number().int().positive().optional(),
  days: z.number().int().positive().optional(),
  code: z.string().optional(),
});

export const challengeRequirementSchema = z.object({
  actionType: z.string().min(1),
  target: z.number().int().positive(),
});

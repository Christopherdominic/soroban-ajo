import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RewardEngine } from '../services/RewardEngine';
import { FraudDetector } from '../services/FraudDetector';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const fraudDetector = new FraudDetector(prisma, redis);
const rewardEngine = new RewardEngine(prisma, fraudDetector);

/**
 * Get all rewards for authenticated user
 */
export const getRewards = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.walletAddress;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status, type } = req.query;

    const rewards = await prisma.reward.findMany({
      where: {
        userId,
        ...(status && { status: status as string }),
        ...(type && { type: type as string }),
      },
      orderBy: { earnedAt: 'desc' },
    });

    res.json({ rewards });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get rewards' });
  }
};

/**
 * Redeem a specific reward
 */
export const redeemReward = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.walletAddress;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify reward belongs to user
    const reward = await prisma.reward.findUnique({
      where: { id },
    });

    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    if (reward.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await rewardEngine.redeemReward(id);

    const updatedReward = await prisma.reward.findUnique({
      where: { id },
    });

    res.json({
      success: true,
      reward: updatedReward,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to redeem reward';
    res.status(400).json({ error: message });
  }
};

/**
 * Get complete reward history
 */
export const getRewardHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.walletAddress;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const history = await prisma.reward.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    });

    const totalEarned = history.length;
    const totalRedeemed = history.filter((r) => r.status === 'REDEEMED').length;

    res.json({
      history,
      totalEarned,
      totalRedeemed,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reward history' });
  }
};

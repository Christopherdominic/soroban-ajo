import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ReferralService } from '../services/referralService';

const prisma = new PrismaClient();
const referralService = new ReferralService(prisma);

/**
 * Generate or retrieve referral code for authenticated user
 */
export const generateReferralCode = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.walletAddress; // Assuming auth middleware sets req.user

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const code = await referralService.generateReferralCode(userId);
    const stats = await referralService.getReferralStats(userId);

    res.json({
      code,
      shareUrl: `${process.env.FRONTEND_URL}/register?ref=${code}`,
      totalReferrals: stats.totalReferrals,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate referral code' });
  }
};

/**
 * Validate a referral code
 */
export const validateReferralCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Referral code is required' });
    }

    const valid = await referralService.validateReferralCode(code);

    if (!valid) {
      return res.json({ valid: false });
    }

    const referrerId = await referralService.getReferrerByCode(code);
    // TODO: Get referrer username from User model
    
    res.json({
      valid: true,
      referrerId,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate referral code' });
  }
};

/**
 * Get referral statistics for authenticated user
 */
export const getReferralStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.walletAddress;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = await referralService.getReferralStats(userId);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get referral stats' });
  }
};

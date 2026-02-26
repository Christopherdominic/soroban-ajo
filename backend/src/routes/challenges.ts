import { Router } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { logger } from '../utils/logger';

export const challengesRouter = Router();

// Get active challenges
challengesRouter.get('/', async (req, res) => {
  try {
    const challenges = await prisma.challenge.findMany({
      where: {
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: challenges });
  } catch (error) {
    logger.error('Failed to get challenges', { error });
    res.status(500).json({ success: false, error: 'Failed to get challenges' });
  }
});

// Get user challenges
challengesRouter.get('/user', authenticate, async (req, res) => {
  try {
    const walletAddress = req.user?.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const userChallenges = await prisma.userChallenge.findMany({
      where: { userId: walletAddress },
      include: { challenge: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: userChallenges });
  } catch (error) {
    logger.error('Failed to get user challenges', { error });
    res.status(500).json({ success: false, error: 'Failed to get user challenges' });
  }
});

// Get seasonal events
challengesRouter.get('/events', async (req, res) => {
  try {
    const events = await prisma.seasonalEvent.findMany({
      where: {
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      orderBy: { startDate: 'desc' },
    });

    res.json({ success: true, data: events });
  } catch (error) {
    logger.error('Failed to get seasonal events', { error });
    res.status(500).json({ success: false, error: 'Failed to get seasonal events' });
  }
});

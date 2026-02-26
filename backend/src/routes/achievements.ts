import { Router } from 'express';
import { gamificationService } from '../services/gamificationService';
import { authenticate } from '../middleware/auth';
import { logger } from '../utils/logger';

export const achievementsRouter = Router();

// Get user gamification stats
achievementsRouter.get('/stats', authenticate, async (req, res) => {
  try {
    const walletAddress = req.user?.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const stats = await gamificationService.getUserStats(walletAddress);
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Failed to get user stats', { error });
    res.status(500).json({ success: false, error: 'Failed to get user stats' });
  }
});

// Get leaderboard
achievementsRouter.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const leaderboard = await gamificationService.getLeaderboard(limit);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    logger.error('Failed to get leaderboard', { error });
    res.status(500).json({ success: false, error: 'Failed to get leaderboard' });
  }
});

// Get user activity feed
achievementsRouter.get('/activity', authenticate, async (req, res) => {
  try {
    const walletAddress = req.user?.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const activities = await gamificationService.getActivityFeed(walletAddress, limit);
    res.json({ success: true, data: activities });
  } catch (error) {
    logger.error('Failed to get activity feed', { error });
    res.status(500).json({ success: false, error: 'Failed to get activity feed' });
  }
});

// Follow user
achievementsRouter.post('/follow/:walletAddress', authenticate, async (req, res) => {
  try {
    const followerId = req.user?.walletAddress;
    const followingId = req.params.walletAddress;

    if (!followerId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (followerId === followingId) {
      return res.status(400).json({ success: false, error: 'Cannot follow yourself' });
    }

    await gamificationService.followUser(followerId, followingId);
    res.json({ success: true, message: 'User followed successfully' });
  } catch (error) {
    logger.error('Failed to follow user', { error });
    res.status(500).json({ success: false, error: 'Failed to follow user' });
  }
});

// Unfollow user
achievementsRouter.delete('/follow/:walletAddress', authenticate, async (req, res) => {
  try {
    const followerId = req.user?.walletAddress;
    const followingId = req.params.walletAddress;

    if (!followerId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    await gamificationService.unfollowUser(followerId, followingId);
    res.json({ success: true, message: 'User unfollowed successfully' });
  } catch (error) {
    logger.error('Failed to unfollow user', { error });
    res.status(500).json({ success: false, error: 'Failed to unfollow user' });
  }
});

// Get followers
achievementsRouter.get('/followers', authenticate, async (req, res) => {
  try {
    const walletAddress = req.user?.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const followers = await gamificationService.getFollowers(walletAddress);
    res.json({ success: true, data: followers });
  } catch (error) {
    logger.error('Failed to get followers', { error });
    res.status(500).json({ success: false, error: 'Failed to get followers' });
  }
});

// Get following
achievementsRouter.get('/following', authenticate, async (req, res) => {
  try {
    const walletAddress = req.user?.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const following = await gamificationService.getFollowing(walletAddress);
    res.json({ success: true, data: following });
  } catch (error) {
    logger.error('Failed to get following', { error });
    res.status(500).json({ success: false, error: 'Failed to get following' });
  }
});

// Handle login (for daily login tracking)
achievementsRouter.post('/login', authenticate, async (req, res) => {
  try {
    const walletAddress = req.user?.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    await gamificationService.handleLogin(walletAddress);
    res.json({ success: true, message: 'Login tracked successfully' });
  } catch (error) {
    logger.error('Failed to track login', { error });
    res.status(500).json({ success: false, error: 'Failed to track login' });
  }
});

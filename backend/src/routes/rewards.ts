import { Router } from 'express';
import {
  getRewards,
  redeemReward,
  getRewardHistory,
} from '../controllers/rewardController';

const router = Router();

// GET /api/rewards - Get all rewards for authenticated user
router.get('/', getRewards);

// POST /api/rewards/:id/redeem - Redeem a specific reward
router.post('/:id/redeem', redeemReward);

// GET /api/rewards/history - Get complete reward history
router.get('/history', getRewardHistory);

export default router;

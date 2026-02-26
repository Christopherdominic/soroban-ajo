import { Router } from 'express';
import {
  generateReferralCode,
  validateReferralCode,
  getReferralStats,
} from '../controllers/referralController';

const router = Router();

// POST /api/referrals/generate - Generate or retrieve referral code
router.post('/generate', generateReferralCode);

// POST /api/referrals/validate - Validate a referral code
router.post('/validate', validateReferralCode);

// GET /api/referrals/stats - Get referral statistics
router.get('/stats', getReferralStats);

export default router;

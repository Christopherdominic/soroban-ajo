import { PrismaClient, Referral } from '@prisma/client';
import { ReferralCodeGenerator } from '../utils/ReferralCodeGenerator';

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  referrals: Array<{
    refereeId: string;
    status: string;
    createdAt: Date;
    completedAt?: Date | null;
  }>;
}

/**
 * Service for managing referral codes and relationships
 */
export class ReferralService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Generate or retrieve referral code for a user
   * @param userId - User's wallet address
   * @returns Referral code
   */
  async generateReferralCode(userId: string): Promise<string> {
    // Check if user already has a referral code
    const existing = await this.prisma.referralCode.findUnique({
      where: { userId },
    });

    if (existing) {
      return existing.code;
    }

    // Generate new unique code
    const code = await ReferralCodeGenerator.generateUnique(this.prisma);

    // Store the code
    await this.prisma.referralCode.create({
      data: {
        userId,
        code,
      },
    });

    return code;
  }

  /**
   * Get existing referral code for a user
   * @param userId - User's wallet address
   * @returns Referral code or null if not found
   */
  async getReferralCode(userId: string): Promise<string | null> {
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { userId },
    });

    return referralCode?.code || null;
  }

  /**
   * Validate if a referral code exists
   * @param code - Referral code to validate
   * @returns true if code exists and is valid
   */
  async validateReferralCode(code: string): Promise<boolean> {
    // First check format
    if (!ReferralCodeGenerator.isValidFormat(code)) {
      return false;
    }

    // Check if code exists in database
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code },
    });

    return referralCode !== null;
  }

  /**
   * Get referrer user ID by referral code
   * @param code - Referral code
   * @returns Referrer's user ID or null if not found
   */
  async getReferrerByCode(code: string): Promise<string | null> {
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code },
      select: { userId: true },
    });

    return referralCode?.userId || null;
  }

  /**
   * Create a referral relationship
   * @param referrerId - User who invited (wallet address)
   * @param refereeId - User who was invited (wallet address)
   * @param code - Referral code used
   * @returns Created referral record
   * @throws Error if referral is invalid
   */
  async createReferral(
    referrerId: string,
    refereeId: string,
    code: string
  ): Promise<Referral> {
    // Validate: Cannot refer yourself
    if (referrerId === refereeId) {
      throw new Error('Cannot refer yourself');
    }

    // Validate: Referee can only be referred once
    const existingReferral = await this.prisma.referral.findUnique({
      where: { refereeId },
    });

    if (existingReferral) {
      throw new Error('User has already been referred');
    }

    // Validate: Referral code must exist and belong to referrer
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code },
    });

    if (!referralCode) {
      throw new Error('Invalid referral code');
    }

    if (referralCode.userId !== referrerId) {
      throw new Error('Referral code does not belong to referrer');
    }

    // Create referral relationship
    const referral = await this.prisma.referral.create({
      data: {
        referrerId,
        refereeId,
        referralCode: code,
        status: 'PENDING',
      },
    });

    // Increment referrer's total invites in gamification
    await this.prisma.userGamification.upsert({
      where: { userId: referrerId },
      update: {
        totalInvites: { increment: 1 },
      },
      create: {
        userId: referrerId,
        totalInvites: 1,
      },
    });

    return referral;
  }

  /**
   * Mark a referral as completed (when referee makes first contribution)
   * @param refereeId - User who was referred
   */
  async completeReferral(refereeId: string): Promise<void> {
    const referral = await this.prisma.referral.findUnique({
      where: { refereeId },
    });

    if (!referral) {
      return; // No referral to complete
    }

    if (referral.status === 'COMPLETED') {
      return; // Already completed
    }

    // Update referral status
    await this.prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  /**
   * Get referral statistics for a user
   * @param userId - User's wallet address
   * @returns Referral statistics
   */
  async getReferralStats(userId: string): Promise<ReferralStats> {
    const referrals = await this.prisma.referral.findMany({
      where: { referrerId: userId },
      select: {
        refereeId: true,
        status: true,
        createdAt: true,
        completedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter((r) => r.status === 'ACTIVE').length;
    const pendingReferrals = referrals.filter((r) => r.status === 'PENDING').length;
    const completedReferrals = referrals.filter((r) => r.status === 'COMPLETED').length;

    return {
      totalReferrals,
      activeReferrals,
      pendingReferrals,
      completedReferrals,
      referrals,
    };
  }

  /**
   * Get referral count for a user (optionally filtered by status)
   * @param userId - User's wallet address
   * @param status - Optional status filter
   * @returns Count of referrals
   */
  async getReferralCount(userId: string, status?: string): Promise<number> {
    return this.prisma.referral.count({
      where: {
        referrerId: userId,
        ...(status && { status }),
      },
    });
  }
}

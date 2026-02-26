import { PrismaClient, Reward } from '@prisma/client';
import { RewardConfiguration, RewardDefinition, NFTMetadata } from './RewardConfigParser';
import { FraudDetector } from './FraudDetector';

/**
 * Core engine for reward calculation, distribution, and management
 */
export class RewardEngine {
  private config: RewardConfiguration | null = null;

  constructor(
    private prisma: PrismaClient,
    private fraudDetector: FraudDetector
  ) {}

  /**
   * Load reward configuration
   * @param config - Reward configuration
   */
  async loadConfiguration(config: RewardConfiguration): Promise<void> {
    this.config = config;

    // Store configuration in database
    await this.prisma.rewardConfig.create({
      data: {
        name: `config_v${config.version}`,
        version: config.version,
        config: JSON.stringify(config),
        isActive: true,
        activatedAt: new Date(),
      },
    });

    // Deactivate previous configurations
    await this.prisma.rewardConfig.updateMany({
      where: {
        version: { lt: config.version },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  /**
   * Get active configuration
   * @returns Active reward configuration
   */
  async getConfiguration(): Promise<RewardConfiguration> {
    if (this.config) {
      return this.config;
    }

    // Load from database
    const activeConfig = await this.prisma.rewardConfig.findFirst({
      where: { isActive: true },
      orderBy: { version: 'desc' },
    });

    if (!activeConfig) {
      throw new Error('No active reward configuration found');
    }

    this.config = JSON.parse(activeConfig.config) as RewardConfiguration;
    return this.config;
  }

  /**
   * Distribute rewards for a completed referral
   * @param referrerId - User who referred
   * @param refereeId - User who was referred
   */
  async distributeReferralReward(referrerId: string, refereeId: string): Promise<void> {
    // Check if rewards should be blocked
    if (await this.fraudDetector.shouldBlockReward(refereeId)) {
      // Rewards blocked for referee due to fraud flags
      return;
    }

    if (await this.fraudDetector.shouldBlockReward(referrerId)) {
      // Rewards blocked for referrer due to fraud flags
      return;
    }

    const config = await this.getConfiguration();

    // Grant rewards to referrer
    for (const rewardDef of config.referralRewards.referrer) {
      await this.grantReward(referrerId, rewardDef, 'REFERRAL', refereeId);
    }

    // Grant rewards to referee
    for (const rewardDef of config.referralRewards.referee) {
      await this.grantReward(refereeId, rewardDef, 'REFERRAL', referrerId);
    }
  }

  /**
   * Distribute rewards for an unlocked achievement
   * @param userId - User who unlocked achievement
   * @param achievementId - Achievement identifier
   */
  async distributeAchievementReward(userId: string, achievementId: string): Promise<void> {
    if (await this.fraudDetector.shouldBlockReward(userId)) {
      // Rewards blocked for user due to fraud flags
      return;
    }

    const config = await this.getConfiguration();
    const achievement = config.achievements[achievementId];

    if (!achievement) {
      throw new Error(`Achievement ${achievementId} not found in configuration`);
    }

    for (const rewardDef of achievement.rewards) {
      await this.grantReward(userId, rewardDef, 'ACHIEVEMENT', achievementId);
    }
  }

  /**
   * Grant a reward based on definition
   * @param userId - User to receive reward
   * @param rewardDef - Reward definition
   * @param source - Source of reward
   * @param sourceId - Source identifier
   */
  private async grantReward(
    userId: string,
    rewardDef: RewardDefinition,
    source: string,
    sourceId: string
  ): Promise<Reward> {
    const expiresAt = rewardDef.expirationDays
      ? new Date(Date.now() + rewardDef.expirationDays * 24 * 60 * 60 * 1000)
      : null;

    switch (rewardDef.type) {
      case 'FEE_DISCOUNT':
        return this.grantFeeDiscount(
          userId,
          Number(rewardDef.amount),
          expiresAt!,
          source,
          sourceId
        );

      case 'BONUS_TOKEN':
        return this.grantBonusTokens(
          userId,
          BigInt(rewardDef.amount!),
          source,
          sourceId
        );

      case 'PREMIUM_FEATURE':
        return this.grantPremiumFeature(
          userId,
          rewardDef.featureId!,
          expiresAt!,
          source,
          sourceId
        );

      case 'NFT_BADGE':
        return this.mintNFTBadge(
          userId,
          rewardDef.nftMetadata!,
          source,
          sourceId
        );

      default:
        throw new Error(`Unknown reward type: ${rewardDef.type}`);
    }
  }

  /**
   * Grant a fee discount reward
   * @param userId - User ID
   * @param percent - Discount percentage
   * @param expiresAt - Expiration date
   * @param source - Reward source
   * @param sourceId - Source ID
   * @returns Created reward
   */
  async grantFeeDiscount(
    userId: string,
    percent: number,
    expiresAt: Date,
    source: string = 'MANUAL',
    sourceId?: string
  ): Promise<Reward> {
    return this.prisma.reward.create({
      data: {
        userId,
        type: 'FEE_DISCOUNT',
        status: 'ACTIVE',
        source,
        sourceId,
        discountPercent: percent,
        expiresAt,
      },
    });
  }

  /**
   * Grant bonus tokens (blockchain transaction required)
   * @param userId - User ID
   * @param amount - Token amount
   * @param source - Reward source
   * @param sourceId - Source ID
   * @returns Created reward
   */
  async grantBonusTokens(
    userId: string,
    amount: bigint,
    source: string = 'MANUAL',
    sourceId?: string
  ): Promise<Reward> {
    const reward = await this.prisma.reward.create({
      data: {
        userId,
        type: 'BONUS_TOKEN',
        status: 'PENDING',
        source,
        sourceId,
        tokenAmount: amount,
      },
    });

    // TODO: Integrate with blockchain service to transfer tokens
    // For now, mark as ACTIVE immediately
    // In production, this would be handled by RewardBlockchainService
    await this.prisma.reward.update({
      where: { id: reward.id },
      data: { status: 'ACTIVE' },
    });

    return reward;
  }

  /**
   * Grant premium feature access
   * @param userId - User ID
   * @param featureId - Feature identifier
   * @param expiresAt - Expiration date
   * @param source - Reward source
   * @param sourceId - Source ID
   * @returns Created reward
   */
  async grantPremiumFeature(
    userId: string,
    featureId: string,
    expiresAt: Date,
    source: string = 'MANUAL',
    sourceId?: string
  ): Promise<Reward> {
    return this.prisma.reward.create({
      data: {
        userId,
        type: 'PREMIUM_FEATURE',
        status: 'ACTIVE',
        source,
        sourceId,
        featureId,
        expiresAt,
      },
    });
  }

  /**
   * Mint NFT badge (blockchain transaction required)
   * @param userId - User ID
   * @param metadata - NFT metadata
   * @param source - Reward source
   * @param sourceId - Source ID
   * @returns Created reward
   */
  async mintNFTBadge(
    userId: string,
    metadata: NFTMetadata,
    source: string = 'MANUAL',
    sourceId?: string
  ): Promise<Reward> {
    const reward = await this.prisma.reward.create({
      data: {
        userId,
        type: 'NFT_BADGE',
        status: 'PENDING',
        source,
        sourceId,
        nftMetadata: JSON.stringify(metadata),
      },
    });

    // TODO: Integrate with NFT minting service
    // For now, mark as ACTIVE immediately
    // In production, this would be handled by NFTBadgeService
    await this.prisma.reward.update({
      where: { id: reward.id },
      data: { status: 'ACTIVE' },
    });

    return reward;
  }

  /**
   * Get active rewards for a user
   * @param userId - User ID
   * @param type - Optional reward type filter
   * @returns List of active rewards
   */
  async getActiveRewards(userId: string, type?: string): Promise<Reward[]> {
    return this.prisma.reward.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        ...(type && { type }),
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { earnedAt: 'desc' },
    });
  }

  /**
   * Redeem a reward
   * @param rewardId - Reward ID
   */
  async redeemReward(rewardId: string): Promise<void> {
    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new Error('Reward not found');
    }

    if (reward.status !== 'ACTIVE') {
      throw new Error(`Cannot redeem reward with status: ${reward.status}`);
    }

    if (reward.expiresAt && reward.expiresAt < new Date()) {
      throw new Error('Reward has expired');
    }

    await this.prisma.reward.update({
      where: { id: rewardId },
      data: {
        status: 'REDEEMED',
        redeemedAt: new Date(),
      },
    });
  }

  /**
   * Expire old rewards (background job)
   */
  async expireRewards(): Promise<number> {
    const result = await this.prisma.reward.updateMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { lt: new Date() },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    return result.count;
  }

  /**
   * Get applicable fee discount for a user
   * @param userId - User ID
   * @returns Highest discount percentage or 0
   */
  async getApplicableDiscount(userId: string): Promise<number> {
    const discounts = await this.getActiveRewards(userId, 'FEE_DISCOUNT');

    if (discounts.length === 0) {
      return 0;
    }

    // Return highest discount
    return Math.max(...discounts.map((d) => d.discountPercent || 0));
  }

  /**
   * Calculate discounted fee
   * @param originalFee - Original fee amount
   * @param discountPercent - Discount percentage
   * @returns Discounted fee
   */
  calculateDiscountedFee(originalFee: number, discountPercent: number): number {
    return originalFee * (1 - discountPercent / 100);
  }

  /**
   * Check if user has access to a premium feature
   * @param userId - User ID
   * @param featureId - Feature identifier
   * @returns true if user has active access
   */
  async hasPremiumFeatureAccess(userId: string, featureId: string): Promise<boolean> {
    const features = await this.prisma.reward.findMany({
      where: {
        userId,
        type: 'PREMIUM_FEATURE',
        featureId,
        status: 'ACTIVE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    return features.length > 0;
  }
}

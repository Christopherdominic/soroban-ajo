import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

export interface ReferralMetadata {
  ipAddress: string;
  userAgent: string;
  deviceFingerprint?: string;
  registrationTimestamp: Date;
}

export interface FraudFlag {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  details: any;
}

export interface FraudCheckResult {
  passed: boolean;
  flags: FraudFlag[];
  shouldBlock: boolean;
}

/**
 * Service for detecting and preventing fraudulent referral activity
 */
export class FraudDetector {
  private static readonly IP_REFERRAL_LIMIT = 3; // Max referrals per IP in 24 hours
  private static readonly IP_TRACKING_WINDOW = 86400; // 24 hours in seconds

  constructor(
    private prisma: PrismaClient,
    private redis: Redis
  ) {}

  /**
   * Comprehensive fraud check for a referral
   * @param referrerId - User who is referring
   * @param refereeId - User being referred
   * @param metadata - Registration metadata
   * @returns Fraud check result
   */
  async checkReferral(
    referrerId: string,
    refereeId: string,
    metadata: ReferralMetadata
  ): Promise<FraudCheckResult> {
    const flags: FraudFlag[] = [];

    // Check 1: Self-referral
    if (await this.checkSelfReferral(referrerId, refereeId)) {
      flags.push({
        type: 'SELF_REFERRAL',
        severity: 'HIGH',
        details: { referrerId, refereeId },
      });
    }

    // Check 2: IP match
    if (await this.checkIPMatch(referrerId, metadata.ipAddress)) {
      flags.push({
        type: 'IP_MATCH',
        severity: 'MEDIUM',
        details: { ip: metadata.ipAddress },
      });
    }

    // Check 3: Device fingerprint match
    if (metadata.deviceFingerprint) {
      if (await this.checkDeviceMatch(referrerId, metadata.deviceFingerprint)) {
        flags.push({
          type: 'DEVICE_MATCH',
          severity: 'MEDIUM',
          details: { fingerprint: metadata.deviceFingerprint },
        });
      }
    }

    // Check 4: Bulk creation from IP
    if (await this.checkBulkCreation(metadata.ipAddress)) {
      flags.push({
        type: 'BULK_CREATION',
        severity: 'HIGH',
        details: {
          ip: metadata.ipAddress,
          count: await this.getIPReferralCount(metadata.ipAddress),
        },
      });
    }

    const shouldBlock = flags.some((f) => f.severity === 'HIGH');

    return {
      passed: flags.length === 0,
      flags,
      shouldBlock,
    };
  }

  /**
   * Check if referrer and referee are the same user
   * @param referrerId - Referrer user ID
   * @param refereeId - Referee user ID
   * @returns true if self-referral detected
   */
  async checkSelfReferral(referrerId: string, refereeId: string): Promise<boolean> {
    return referrerId === refereeId;
  }

  /**
   * Check if referee's IP matches referrer's IP
   * @param referrerId - Referrer user ID
   * @param refereeIP - Referee's IP address
   * @returns true if IP match detected
   */
  async checkIPMatch(referrerId: string, refereeIP: string): Promise<boolean> {
    // Get referrer's recent IP addresses from metadata
    // This would require storing IP addresses in user metadata
    // For now, we'll implement a simplified version
    
    // TODO: Implement IP storage and comparison
    // This requires extending the User model or creating a UserMetadata table
    
    return false; // Placeholder
  }

  /**
   * Check if referee's device fingerprint matches referrer's
   * @param referrerId - Referrer user ID
   * @param refereeFingerprint - Referee's device fingerprint
   * @returns true if device match detected
   */
  async checkDeviceMatch(
    referrerId: string,
    refereeFingerprint: string
  ): Promise<boolean> {
    // Similar to IP check, requires device fingerprint storage
    // TODO: Implement device fingerprint storage and comparison
    
    return false; // Placeholder
  }

  /**
   * Check if too many referrals from same IP in 24 hours
   * @param ipAddress - IP address to check
   * @returns true if bulk creation detected
   */
  async checkBulkCreation(ipAddress: string): Promise<boolean> {
    const count = await this.getIPReferralCount(ipAddress);
    return count >= FraudDetector.IP_REFERRAL_LIMIT;
  }

  /**
   * Get number of referrals from an IP in last 24 hours
   * @param ipAddress - IP address
   * @returns Count of referrals
   */
  private async getIPReferralCount(ipAddress: string): Promise<number> {
    const key = `fraud:ip:${ipAddress}`;
    const count = await this.redis.get(key);

    if (count) {
      return parseInt(count, 10);
    }

    // If not in cache, return 0
    // In production, you might want to query database for historical data
    return 0;
  }

  /**
   * Increment IP referral count (call after creating referral)
   * @param ipAddress - IP address
   */
  async incrementIPCount(ipAddress: string): Promise<void> {
    const key = `fraud:ip:${ipAddress}`;
    await this.redis.incr(key);
    await this.redis.expire(key, FraudDetector.IP_TRACKING_WINDOW);
  }

  /**
   * Create a fraud flag record
   * @param referralId - Referral ID
   * @param flagType - Type of fraud detected
   * @param details - Additional details
   * @returns Created fraud flag
   */
  async flagReferral(
    referralId: string,
    flagType: string,
    details: any
  ): Promise<any> {
    const severity = this.determineSeverity(flagType);

    const flag = await this.prisma.fraudFlag.create({
      data: {
        referralId,
        flagType,
        severity,
        details: JSON.stringify(details),
        status: 'PENDING',
      },
    });

    // Update referral status to FLAGGED
    await this.prisma.referral.update({
      where: { id: referralId },
      data: { status: 'FLAGGED' },
    });

    return flag;
  }

  /**
   * Review a fraud flag
   * @param flagId - Flag ID
   * @param status - New status (REVIEWED, CONFIRMED, DISMISSED)
   * @param reviewerId - Admin who reviewed
   */
  async reviewFlag(
    flagId: string,
    status: 'REVIEWED' | 'CONFIRMED' | 'DISMISSED',
    reviewerId: string
  ): Promise<void> {
    await this.prisma.fraudFlag.update({
      where: { id: flagId },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: reviewerId,
      },
    });
  }

  /**
   * Check if rewards should be blocked for a user
   * @param userId - User ID
   * @returns true if rewards should be blocked
   */
  async shouldBlockReward(userId: string): Promise<boolean> {
    // Check if user has any pending or confirmed fraud flags
    const flags = await this.prisma.fraudFlag.findMany({
      where: {
        userId,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    return flags.length > 0;
  }

  /**
   * Determine severity based on flag type
   * @param flagType - Type of fraud
   * @returns Severity level
   */
  private determineSeverity(flagType: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    const highSeverityTypes = ['SELF_REFERRAL', 'BULK_CREATION'];
    const mediumSeverityTypes = ['IP_MATCH', 'DEVICE_MATCH'];

    if (highSeverityTypes.includes(flagType)) {
      return 'HIGH';
    } else if (mediumSeverityTypes.includes(flagType)) {
      return 'MEDIUM';
    }

    return 'LOW';
  }
}

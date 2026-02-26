import { PrismaClient } from '@prisma/client'
import { auditLog } from './auditService'
import { complianceConfig } from '../config/compliance'

const prisma = new PrismaClient()

export interface KycStatus {
  level: number
  status: string
  requestedAt?: Date
  verifiedAt?: Date
  rejectedAt?: Date
  documents?: unknown[]
}

export class KycService {
  /**
   * Retrieve a user's current KYC status/level.
   */
  static async getStatus(walletAddress: string): Promise<KycStatus | null> {
    const user = await prisma.user.findUnique({
      where: { walletAddress },
      select: {
        kycLevel: true,
        kycStatus: true,
        kycRequestedAt: true,
        kycVerifiedAt: true,
        kycRejectedAt: true,
        kycDocuments: true,
      },
    })

    if (!user) return null

    return {
      level: user.kycLevel,
      status: user.kycStatus,
      requestedAt: user.kycRequestedAt || undefined,
      verifiedAt: user.kycVerifiedAt || undefined,
      rejectedAt: user.kycRejectedAt || undefined,
      documents: (user.kycDocuments as any) || [],
    }
  }

  /**
   * Request KYC for a user (sets status to pending).
   */
  static async requestVerification(walletAddress: string): Promise<void> {
    await prisma.user.update({
      where: { walletAddress },
      data: {
        kycStatus: 'pending',
        kycRequestedAt: new Date(),
      },
    })
  }

  /**
   * Upload a supporting document for a user. docData is typically a base64 string or IPFS CID.
   */
  static async uploadDocument(walletAddress: string, docType: string, docData: string) {
    const user = await prisma.user.findUnique({ where: { walletAddress } })
    if (!user) throw new Error('User not found')

    return prisma.kycDocument.create({
      data: {
        userId: user.id,
        docType,
        ipfsCid: docData,
      },
    })
  }

  /**
   * Change the KYC level/status for a user. Typically called by an admin after review.
   */
  static async setKycLevel(params: {
    walletAddress: string
    level: number
    status: 'approved' | 'rejected' | 'none'
    adminId?: string
    notes?: string
  }) {
    const data: any = {
      kycLevel: params.level,
      kycStatus: params.status,
    }
    if (params.status === 'approved') {
      data.kycVerifiedAt = new Date()
    }
    if (params.status === 'rejected') {
      data.kycRejectedAt = new Date()
    }

    const user = await prisma.user.update({
      where: { walletAddress: params.walletAddress },
      data,
    })

    if (params.adminId) {
      await auditLog({
        adminId: params.adminId,
        action: 'kyc_update',
        targetType: 'user',
        targetId: user.id,
        metadata: {
          level: params.level,
          status: params.status,
          notes: params.notes,
        },
      })
    }

    return user
  }

  /**
   * Determine whether a given wallet address appears on the AML blacklist.
   */
  static isAddressBlacklisted(address: string): boolean {
    return complianceConfig.amlBlacklist.includes(address)
  }

  /**
   * Get the transaction limit for a given KYC level.
   */
  static getTransactionLimit(level: number): number {
    return complianceConfig.transactionLimits[level] || 0
  }
}

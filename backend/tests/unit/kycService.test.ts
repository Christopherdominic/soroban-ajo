import { KycService } from '../../src/services/kycService'
import { complianceConfig } from '../../src/config/compliance'
import { PrismaClient } from '@prisma/client'
import * as audit from '../../src/services/auditService'

jest.mock('../../src/services/auditService')

describe('KycService', () => {
  const prisma = new PrismaClient()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getStatus', () => {
    it('should return null when user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null as any)
      const res = await KycService.getStatus('nonexistent')
      expect(res).toBeNull()
    })

    it('should map database fields to KycStatus', async () => {
      const dbUser = {
        kycLevel: 2,
        kycStatus: 'pending',
        kycRequestedAt: new Date('2025-01-01'),
        kycVerifiedAt: null,
        kycRejectedAt: null,
        kycDocuments: [{ docType: 'id' }],
      }
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(dbUser as any)
      const res = await KycService.getStatus('wallet')
      expect(res).toEqual({
        level: 2,
        status: 'pending',
        requestedAt: dbUser.kycRequestedAt,
        verifiedAt: undefined,
        rejectedAt: undefined,
        documents: dbUser.kycDocuments,
      })
    })
  })

  describe('setKycLevel', () => {
    it('updates user and logs audit entry when adminId provided', async () => {
      const wallet = 'GABC123'
      const updated = { id: 'user1' }
      jest.spyOn(prisma.user, 'update').mockResolvedValue(updated as any)
      await KycService.setKycLevel({
        walletAddress: wallet,
        level: 3,
        status: 'approved',
        adminId: 'adm1',
        notes: 'ok',
      })
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { walletAddress: wallet } })
      )
      expect(audit.auditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          adminId: 'adm1',
          action: 'kyc_update',
          targetType: 'user',
          metadata: expect.objectContaining({ level: 3, status: 'approved' }),
        })
      )
    })
  })

  describe('getTransactionLimit', () => {
    it('returns configured limit for level', () => {
      expect(KycService.getTransactionLimit(0)).toBe(complianceConfig.transactionLimits[0])
      expect(KycService.getTransactionLimit(42)).toBe(0)
    })
  })

  describe('isAddressBlacklisted', () => {
    it('checks against AML list', () => {
      const addr = 'test'
      const list = complianceConfig.amlBlacklist
      // pick first or add if empty
      if (list.length === 0) {
        expect(KycService.isAddressBlacklisted(addr)).toBe(false)
      } else {
        expect(KycService.isAddressBlacklisted(list[0])).toBe(true)
      }
    })
  })
})

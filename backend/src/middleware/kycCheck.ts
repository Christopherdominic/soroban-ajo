import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { complianceConfig } from '../config/compliance'

const prisma = new PrismaClient()

export interface AuthRequestWithKyc extends Request {
  user?: { publicKey: string }
}

/**
 * Requires that the authenticated user has at least the specified KYC level.
 */
export function requireKycLevel(minLevel: number) {
  return async (req: AuthRequestWithKyc, res: Response, next: NextFunction) => {
    const pub = req.user?.publicKey
    if (!pub) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const user = await prisma.user.findUnique({ where: { walletAddress: pub } })
    if (!user || user.kycLevel < minLevel) {
      res.status(403).json({ error: 'Insufficient KYC level' })
      return
    }

    next()
  }
}

/**
 * Checks a transaction amount against the user's KYC-based limit.
 * If amount exceeds the limit, rejects the request.
 */
export function enforceTransactionLimit(amountField: string = 'amount') {
  return async (req: AuthRequestWithKyc, res: Response, next: NextFunction) => {
    const pub = req.user?.publicKey
    if (!pub) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const user = await prisma.user.findUnique({ where: { walletAddress: pub } })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const limit = complianceConfig.transactionLimits[user.kycLevel] || 0
    const amt = Number(req.body[amountField] ?? req.query[amountField])

    if (isNaN(amt) || amt > limit) {
      res.status(403).json({ error: 'Transaction exceeds allowed limit for your verification level' })
      return
    }

    next()
  }
}

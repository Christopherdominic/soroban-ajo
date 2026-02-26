import { Request, Response, NextFunction } from 'express'
import { KycService } from '../services/kycService'

// Middleware to enforce minimum KYC level for an endpoint
export function requireKycLevel(minLevel: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallet = (req as any).user?.publicKey || req.body.walletAddress || req.query.walletAddress
      if (!wallet) return res.status(401).json({ error: 'No wallet provided' })

      const status = await KycService.getStatus(wallet)
      const level = status?.level ?? 0
      if (level < minLevel) {
        return res.status(403).json({ error: 'KYC level insufficient', required: minLevel, current: level })
      }

      next()
    } catch (err: any) {
      console.error('KYC middleware error', err)
      res.status(500).json({ error: 'KYC check failed' })
    }
  }
}

// Middleware to perform AML address screening on `from` or `address` in body/query
export async function amlScreen(req: Request, res: Response, next: NextFunction) {
  try {
    const address = req.body.address || req.body.from || req.query.address || req.query.from || (req as any).user?.publicKey
    if (!address) return next()

    const blocked = KycService.isAddressBlacklisted(address)
    if (blocked) {
      return res.status(403).json({ error: 'Address is blocked by AML rules' })
    }

    next()
  } catch (err: any) {
    console.error('AML middleware error', err)
    res.status(500).json({ error: 'AML check failed' })
  }
}

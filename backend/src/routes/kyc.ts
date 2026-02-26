import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth'
import { adminAuth } from '../middleware/adminAuth'
import { KycService } from '../services/kycService'

const router = Router()

// User endpoints
router.get('/status', authMiddleware, async (req: Request, res: Response) => {
  const pub = (req as any).user?.publicKey
  if (!pub) return res.status(401).json({ error: 'Unauthorized' })
  const status = await KycService.getStatus(pub)
  if (!status) return res.status(404).json({ error: 'User not found' })
  res.json({ status })
})

router.post('/request', authMiddleware, async (req: Request, res: Response) => {
  const pub = (req as any).user?.publicKey
  if (!pub) return res.status(401).json({ error: 'Unauthorized' })
  try {
    await KycService.requestVerification(pub)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to request verification' })
  }
})

router.post('/upload', authMiddleware, async (req: Request, res: Response) => {
  const pub = (req as any).user?.publicKey
  const { docType, data } = req.body
  if (!pub) return res.status(401).json({ error: 'Unauthorized' })
  if (!docType || !data) {
    res.status(400).json({ error: 'docType and data are required' })
    return
  }
  try {
    const doc = await KycService.uploadDocument(pub, docType, data)
    res.json({ document: doc })
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload document' })
  }
})

// Admin endpoints
router.post('/level', adminAuth('users:write'), async (req: Request, res: Response) => {
  const { walletAddress, level, status, notes } = req.body
  if (!walletAddress || typeof level !== 'number' || !status) {
    res.status(400).json({ error: 'walletAddress, level and status are required' })
    return
  }
  try {
    const user = await KycService.setKycLevel({
      walletAddress,
      level,
      status,
      adminId: (req as any).admin?.id,
      notes,
    })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update KYC level' })
  }
})

router.get('/summary', adminAuth('reports:read'), async (req: Request, res: Response) => {
  // quick counts
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  const pending = await prisma.user.count({ where: { kycStatus: 'pending' } })
  const approved = await prisma.user.count({ where: { kycStatus: 'approved' } })
  const rejected = await prisma.user.count({ where: { kycStatus: 'rejected' } })

  res.json({ pending, approved, rejected })
})

export const kycRouter = router

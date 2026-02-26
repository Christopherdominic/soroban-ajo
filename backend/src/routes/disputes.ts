import express from 'express'
import { disputeService } from '../services/disputeService'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { adminAuth } from '../middleware/adminAuth'

export const disputesRouter = express.Router()

// File a dispute
// POST /api/disputes
// body: { groupId, type, summary?, evidence?: [{type, content}] }
export const validateDisputeType = (t: any) => ['non_payment','fraud','rule_violation'].includes(t)

disputesRouter.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { groupId, type, summary, evidence } = req.body
    if (!groupId || !type) return res.status(400).json({ error: 'groupId and type required' })
    if (!validateDisputeType(type)) return res.status(400).json({ error: 'invalid dispute type' })

    const user = req.user!.publicKey
    const dispute = await disputeService.fileDispute(groupId, user, type, summary, evidence || [])
    res.status(201).json({ success: true, dispute })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// Get dispute
disputesRouter.get('/:id', async (req, res) => {
  const d = await disputeService.getDispute(req.params.id)
  if (!d) return res.status(404).json({ error: 'Not found' })
  res.json({ dispute: d })
})

// List disputes for a group
disputesRouter.get('/group/:groupId', async (req, res) => {
  const list = await disputeService.listGroupDisputes(req.params.groupId)
  res.json({ disputes: list })
})

// Vote on dispute
// POST /api/disputes/:id/vote { vote: 'yes'|'no' }
disputesRouter.post('/:id/vote', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const vote = req.body.vote
    if (!['yes','no'].includes(vote)) return res.status(400).json({ error: 'vote must be yes or no' })
    const user = req.user!.publicKey
    const dispute = await disputeService.voteOnDispute(req.params.id, user, vote)
    res.json({ success: true, dispute })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// Escalate to admin (member or system can call)
disputesRouter.post('/:id/escalate', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const dispute = await disputeService.escalateToAdmin(req.params.id)
    res.json({ success: true, dispute })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// Admin resolves dispute
// POST /api/disputes/:id/admin-resolve { decision: string }
disputesRouter.post('/:id/admin-resolve', adminAuth(), async (req, res) => {
  try {
    const decision = req.body.decision
    if (!decision) return res.status(400).json({ error: 'decision required' })
    const adminId = (req as any).admin?.id || 'admin'
    const dispute = await disputeService.adminResolve(req.params.id, adminId, decision)
    res.json({ success: true, dispute })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default disputesRouter

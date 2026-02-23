import { Router, Request, Response } from 'express'
import { analyticsService } from '../services/analyticsService'

const router = Router()

// POST /api/analytics — receive events from frontend
router.post('/', async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body
    if (!type || !data) {
      return res.status(400).json({ error: 'Missing type or data' })
    }
    await analyticsService.saveEvent(type, data)
    return res.status(201).json({ success: true })
  } catch (err) {
    console.error('[Analytics Route] Error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/analytics/stats — get aggregated stats for dashboard
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getStats()
    return res.json(stats)
  } catch (err) {
    console.error('[Analytics Route] Error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/analytics/metrics — get performance metrics
router.get('/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = await analyticsService.getMetrics()
    return res.json(metrics)
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export const analyticsRouter = router

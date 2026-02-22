import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'drips-backend',
    version: '0.1.0'
  })
})

export const healthRouter = router

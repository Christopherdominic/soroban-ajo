import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'
// import { setupSwagger } from './middleware/swagger'
import { logger } from './utils/logger'
import { groupsRouter } from './routes/groups'
import { healthRouter } from './routes/health'
import { webhooksRouter } from './routes/webhooks'
import { authRouter } from './routes/auth'
import { analyticsRouter } from './routes/analytics'
import { emailRouter } from './routes/email'
import { jobsRouter } from './routes/jobs'
import { setupSwagger } from './swagger'
import { apiLimiter, strictLimiter } from './middleware/rateLimiter'
import { startWorkers, stopWorkers } from './jobs/jobWorkers'
import { startScheduler, stopScheduler } from './cron/scheduler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(requestLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', apiLimiter)
app.set('trust proxy', 1)

// API Documentation
setupSwagger(app)

// Routes
app.use('/health', healthRouter)
app.use('/api/auth', strictLimiter, authRouter)
app.use('/api/groups', groupsRouter)
app.use('/api/webhooks', strictLimiter, webhooksRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/email', emailRouter)
app.use('/api/jobs', jobsRouter)

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, { env: process.env.NODE_ENV || 'development' })

  // Start background job workers and cron scheduler
  try {
    startWorkers()
    startScheduler()
    logger.info('Background jobs and cron scheduler started')
  } catch (err) {
    logger.error('Failed to start background jobs', {
      error: err instanceof Error ? err.message : String(err),
    })
  }
})

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down gracefully...')
  stopScheduler()
  await stopWorkers()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

export default app


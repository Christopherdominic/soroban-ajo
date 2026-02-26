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
import { gamificationRouter } from './routes/gamification'
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
app.use('/api/gamification', gamificationRouter)

// Disputes
import { disputesRouter } from './routes/disputes'
app.use('/api/disputes', disputesRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found'
  })
})

// Error handling
app.use(errorHandler)

// Start server and keep reference so we can close it on shutdown
const server = app.listen(PORT, () => {
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
  // stop accepting new connections
  if (server && server.close) {
    server.close((err?: Error) => {
      if (err) {
        logger.error('Error closing server', { error: err.message })
      } else {
        logger.info('HTTP server closed')
      }
    })
  }

  stopScheduler()
  await stopWorkers()
  // give a short delay in case there are pending callbacks
  setTimeout(() => process.exit(0), 100)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

export default app


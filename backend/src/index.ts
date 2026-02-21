import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'
import { logger } from './utils/logger'
import { groupsRouter } from './routes/groups'
import { healthRouter } from './routes/health'
import { webhooksRouter } from './routes/webhooks'
import { authRouter } from './routes/auth'

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

// Routes
app.use('/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/groups', groupsRouter)
app.use('/api/webhooks', webhooksRouter)

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, { env: process.env.NODE_ENV || 'development' })
})

export default app

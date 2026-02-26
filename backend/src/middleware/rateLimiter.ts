import rateLimit from 'express-rate-limit'
import { Request } from 'express'

const getEnvNum = (key: string, fallback: number) =>
  process.env[key] ? parseInt(process.env[key] as string, 10) : fallback

/**
 * General API rate limit applied to most endpoints
 */
export const apiLimiter = rateLimit({
  windowMs: getEnvNum('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // Default: 15 minutes
  max: getEnvNum('RATE_LIMIT_MAX_REQUESTS', 100), // Default: 100 per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests, please try again later.',
  },
  // Skip successful health checks if needed
  skip: (req: Request) => req.path === '/health',
})

/**
 * Strict limiter for sensitive routes (Auth, Webhooks)
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per window
  message: {
    status: 429,
    message: 'Too many attempts from this IP, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

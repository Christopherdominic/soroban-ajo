import { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'crypto'
import { logger } from '../utils/logger'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = randomUUID()
  const start = Date.now()

  // Attach requestId so controllers/errors can reference it
  res.locals.requestId = requestId
  res.setHeader('X-Request-Id', requestId)

  res.on('finish', () => {
    const duration = Date.now() - start
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'

    logger[level]('HTTP request', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    })
  })

  next()
}

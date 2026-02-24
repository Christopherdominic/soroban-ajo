import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'
import { AppError, ErrorFactory } from '../errors/AppError'
import { ZodError } from 'zod'

/**
 * Global error handling middleware
 * Converts all errors to consistent API responses
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Convert unknown errors to AppError
  let error: AppError
  
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    error = new AppError(
      'Validation failed',
      'VALIDATION_ERROR',
      400,
      err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }))
    )
  } else if (err instanceof AppError) {
    error = err
  } else {
    error = ErrorFactory.fromUnknown(err)
  }
  
  // Log error with appropriate level
  const logLevel = error.statusCode >= 500 ? 'error' : 'warn'
  logger[logLevel]('Request error:', {
    error: error.message,
    code: error.code,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    requestId: res.locals.requestId,
    ...(error.details && { details: error.details }),
    ...(error.statusCode >= 500 && { stack: error.stack }),
  })
  
  // Send error response
  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    code: error.code,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  })
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND',
    path: req.path,
  })
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors and pass to error middleware
 */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

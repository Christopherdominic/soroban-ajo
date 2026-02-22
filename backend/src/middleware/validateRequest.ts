import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

/**
 * Middleware factory for validating requests using Zod schemas
 * Supports validation of body, query, and params
 */
export const validateRequest = (schema: {
  body?: AnyZodObject
  query?: AnyZodObject
  params?: AnyZodObject
}) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate body if schema provided
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body)
      }

      // Validate query if schema provided
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query)
      }

      // Validate params if schema provided
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params)
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: formattedErrors,
        })
        return
      }

      // Pass other errors to error handler
      next(error)
    }
  }
}

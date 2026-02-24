import { Request, Response, NextFunction } from 'express'
import { z, ZodError, ZodSchema } from 'zod'

/**
 * Validation middleware factory
 * Creates middleware that validates request data against a Zod schema
 */
export function validateRequest(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source]
      const validated = await schema.parseAsync(data)

      // Replace the request data with validated data
      req[source] = validated

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        })
        return
      }

      // Pass other errors to error handler
      next(error)
    }
  }
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
    limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default('20'),
  }),

  // ID parameter
  id: z.object({
    id: z.string().min(1),
  }),

  // Stellar address
  stellarAddress: z.string().regex(/^G[A-Z0-9]{55}$/, 'Invalid Stellar address'),

  // Amount (in stroops)
  amount: z.number().int().positive(),
}

/**
 * Group-specific validation schemas
 */
export const groupSchemas = {
  create: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name too long'),
    description: z.string().max(500, 'Description too long').optional(),
    contributionAmount: z.number().int().positive('Contribution amount must be positive'),
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    maxMembers: z.number().int().min(2, 'At least 2 members required').max(100, 'Maximum 100 members'),
    admin: commonSchemas.stellarAddress,
    signedXdr: z.string().optional(),
  }),

  join: z.object({
    publicKey: commonSchemas.stellarAddress,
    signedXdr: z.string().optional(),
  }),

  contribute: z.object({
    amount: commonSchemas.amount,
    publicKey: commonSchemas.stellarAddress,
    signedXdr: z.string().optional(),
  }),
}

/**
 * Validation helper for manual validation
 */
export async function validate<T>(schema: ZodSchema<T>, data: unknown): Promise<T> {
  return await schema.parseAsync(data)
}

/**
 * Safe parse helper that returns result object instead of throwing
 */
export function safeParse<T>(schema: ZodSchema<T>, data: unknown):
  | { success: true; data: T }
  | { success: false; error: ZodError } {
  const result = schema.safeParse(data)
  return result
}

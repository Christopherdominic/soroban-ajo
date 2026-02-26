import { z } from 'zod'

/**
 * Validation schemas for group-related API endpoints
 */

// Stellar public key validation (56 characters, starts with G)
const stellarPublicKeySchema = z
  .string()
  .length(56, 'Public key must be 56 characters')
  .startsWith('G', 'Public key must start with G')

// Pagination query parameters
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val >= 1, 'Page must be at least 1'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => val >= 1 && val <= 100, 'Limit must be between 1 and 100'),
})

// GET /api/groups/:id - Path params
export const groupIdParamSchema = z.object({
  id: z.string().min(1, 'Group ID is required'),
})

// POST /api/groups - Create group
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'Group name is required')
    .max(100, 'Group name must be 100 characters or less'),
  contributionAmount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Contribution amount must be a positive number',
    }),
  frequency: z
    .string()
    .describe('Contribution frequency, e.g. "weekly", "monthly"'),
  maxMembers: z
    .number()
    .int('Max members must be an integer')
    .min(2, 'Max members must be at least 2')
    .max(100, 'Max members cannot exceed 100'),
    currentMembers: z
    .number()
    .int('Current members must be an integer')
    .min(0, 'Current members cannot be negative')
    .max(100, 'Current members cannot exceed 100'),
    // .optional(),
  adminPublicKey: stellarPublicKeySchema,
  // signedXdr: z.string().optional(), // For phase 2 of group creation
  description: z.string().max(500, 'Description must be 500 characters or less'),
})

// POST /api/groups/:id/join - Join group
export const joinGroupSchema = z.object({
  publicKey: stellarPublicKeySchema,
  signedXdr: z.string().optional(), // For phase 2 of joining
})

// POST /api/groups/:id/contribute - Make contribution
export const contributeSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  publicKey: stellarPublicKeySchema,
  signedXdr: z.string().optional(), // For phase 2 of contribution
})

// Type exports for use in controllers
export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type JoinGroupInput = z.infer<typeof joinGroupSchema>
export type ContributeInput = z.infer<typeof contributeSchema>
export type PaginationQuery = z.infer<typeof paginationQuerySchema>
export type GroupIdParam = z.infer<typeof groupIdParamSchema>

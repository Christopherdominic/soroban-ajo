import { Request, Response, NextFunction } from 'express'
import { SorobanService } from '../services/sorobanService'
import { NotFoundError } from '../errors/AppError'
import { asyncHandler } from '../middleware/errorHandler'

const sorobanService = new SorobanService()

/**
 * Parses and validates `?page` and `?limit` query parameters.
 * Falls back to safe defaults when values are missing or invalid.
 */
function parsePagination(query: Request['query']): { page: number; limit: number } {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 20
  const MAX_LIMIT = 100

  const page = Math.max(1, parseInt(query.page as string, 10) || DEFAULT_PAGE)
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(query.limit as string, 10) || DEFAULT_LIMIT)
  )

  return { page, limit }
}

export class GroupsController {
  /**
   * GET /api/groups?page=1&limit=20
   * Returns a paginated list of all groups.
   */
  listGroups = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const pagination = parsePagination(req.query)
    const result = await sorobanService.getAllGroups(pagination)

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  })

  getGroup = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params
    const group = await sorobanService.getGroup(id)

    if (!group) {
      throw new NotFoundError('Group', id)
    }

    res.json({ success: true, data: group })
  })

  /**
   * POST /api/groups
   *
   * Phase 1 — no signedXdr in body → returns { unsignedXdr } for the wallet to sign.
   * Phase 2 — signedXdr present    → submits, returns { groupId, txHash }.
   */
  createGroup = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const groupData = req.body // Already validated by middleware
    const result = await sorobanService.createGroup(groupData)

    // Phase 1: return XDR for client signing
    if (result.unsignedXdr) {
      res.status(200).json({ success: true, data: result })
      return
    }

    // Phase 2: confirmed on-chain
    res.status(201).json({ success: true, data: result })
  })

  /**
   * POST /api/groups/:id/join
   *
   * Phase 1 — no signedXdr → returns { unsignedXdr }.
   * Phase 2 — signedXdr present → submits, returns { success, txHash }.
   */
  joinGroup = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params
    const { publicKey, signedXdr } = req.body // Already validated by middleware
    const result = await sorobanService.joinGroup(id, publicKey, signedXdr)
    res.json({ success: true, data: result })
  })

  /**
   * POST /api/groups/:id/contribute
   *
   * Phase 1 — no signedXdr → returns { unsignedXdr }.
   * Phase 2 — signedXdr present → submits, returns { success, txHash }.
   */
  contribute = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params
    const { amount, publicKey, signedXdr } = req.body // Already validated by middleware
    const result = await sorobanService.contribute(id, publicKey, amount, signedXdr)
    res.json({ success: true, data: result })
  })

  getMembers = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params
    const members = await sorobanService.getGroupMembers(id)
    res.json({ success: true, data: members })
  })

  /**
   * GET /api/groups/:id/transactions?page=1&limit=20
   * Returns a paginated list of transactions for a group.
   */
  getTransactions = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params
    const pagination = parsePagination(req.query)
    const result = await sorobanService.getGroupTransactions(id, pagination)

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  })
}

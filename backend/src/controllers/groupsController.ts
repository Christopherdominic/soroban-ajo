import { Request, Response, NextFunction } from 'express'
import { SorobanService } from '../services/sorobanService'

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
  async listGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = parsePagination(req.query)
      const result = await sorobanService.getAllGroups(pagination)

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      })
    } catch (error) {
      next(error)
    }
  }

  async getGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const group = await sorobanService.getGroup(id)

      if (!group) {
        return res.status(404).json({
          success: false,
          error: 'Group not found',
        })
      }

      res.json({ success: true, data: group })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/groups
   *
   * Phase 1 — no signedXdr in body → returns { unsignedXdr } for the wallet to sign.
   * Phase 2 — signedXdr present    → submits, returns { groupId, txHash }.
   */
  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groupData = req.body
      // TODO: Validate with Zod schema
      const result = await sorobanService.createGroup(groupData)

      // Phase 1: return XDR for client signing
      if (result.unsignedXdr) {
        return res.status(200).json({ success: true, data: result })
      }

      // Phase 2: confirmed on-chain
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/groups/:id/join
   *
   * Phase 1 — no signedXdr → returns { unsignedXdr }.
   * Phase 2 — signedXdr present → submits, returns { success, txHash }.
   */
  async joinGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { publicKey, signedXdr } = req.body
      const result = await sorobanService.joinGroup(id, publicKey, signedXdr)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/groups/:id/contribute
   *
   * Phase 1 — no signedXdr → returns { unsignedXdr }.
   * Phase 2 — signedXdr present → submits, returns { success, txHash }.
   */
  async contribute(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { amount, publicKey, signedXdr } = req.body
      const result = await sorobanService.contribute(id, publicKey, amount, signedXdr)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const members = await sorobanService.getGroupMembers(id)
      res.json({ success: true, data: members })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/groups/:id/transactions?page=1&limit=20
   * Returns a paginated list of transactions for a group.
   */
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const pagination = parsePagination(req.query)
      const result = await sorobanService.getGroupTransactions(id, pagination)

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      })
    } catch (error) {
      next(error)
    }
  }
}

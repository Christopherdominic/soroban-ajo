import { Request, Response, NextFunction } from 'express'
import { SorobanService } from '../services/sorobanService'
import { CreateGroupInput, JoinGroupInput, ContributeInput } from '../validators/groups'

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

  async getGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const group = await sorobanService.getGroup(id)

      if (!group) {
        res.status(404).json({
          success: false,
          error: 'Group not found',
        })
        return
      }

      res.json({ success: true, data: group })
    } catch (error) {
      next(error)
    }
  }

  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groupData: CreateGroupInput = req.body
      const result = await sorobanService.createGroup(groupData)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async joinGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { publicKey }: JoinGroupInput = req.body
      const result = await sorobanService.joinGroup(id, publicKey)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async contribute(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { amount, publicKey }: ContributeInput = req.body
      const result = await sorobanService.contribute(id, publicKey, amount)
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

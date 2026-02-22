import { Request, Response, NextFunction } from 'express'
import * as crypto from 'crypto'
import { webhookService, WebhookEventType } from '../services/webhookService'
import { AppError } from './errorHandler'

/**
 * Middleware to trigger webhooks after successful operations
 */
export const webhookMiddleware = {
  /**
   * Trigger webhook after group creation
   */
  afterGroupCreated: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const groupData = res.locals.groupData || req.body

      await webhookService.triggerEvent(
        WebhookEventType.GROUP_CREATED,
        {
          groupId: groupData.id || groupData.groupId,
          name: groupData.name,
          creator: groupData.creator,
          contributionAmount: groupData.contributionAmount,
          maxMembers: groupData.maxMembers,
          cycleLength: groupData.cycleLength,
          createdAt: new Date().toISOString(),
        },
        {
          groupId: groupData.id || groupData.groupId,
          userId: groupData.creator,
          network: process.env.SOROBAN_NETWORK || 'testnet',
        }
      )

      next()
    } catch (error) {
      console.error('Webhook trigger error (group.created):', error)
      // Don't fail the request if webhook fails
      next()
    }
  },

  /**
   * Trigger webhook after member joins group
   */
  afterMemberJoined: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: groupId } = req.params
      const { publicKey } = req.body

      await webhookService.triggerEvent(
        WebhookEventType.MEMBER_JOINED,
        {
          groupId,
          memberAddress: publicKey,
          joinedAt: new Date().toISOString(),
        },
        {
          groupId,
          userId: publicKey,
          network: process.env.SOROBAN_NETWORK || 'testnet',
        }
      )

      next()
    } catch (error) {
      console.error('Webhook trigger error (member.joined):', error)
      next()
    }
  },

  /**
   * Trigger webhook after contribution is made
   */
  afterContribution: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: groupId } = req.params
      const { amount, publicKey } = req.body
      const transactionHash = res.locals.transactionHash

      await webhookService.triggerEvent(
        WebhookEventType.CONTRIBUTION_MADE,
        {
          groupId,
          contributor: publicKey,
          amount,
          transactionHash,
          contributedAt: new Date().toISOString(),
        },
        {
          groupId,
          userId: publicKey,
          transactionHash,
          network: process.env.SOROBAN_NETWORK || 'testnet',
        }
      )

      next()
    } catch (error) {
      console.error('Webhook trigger error (contribution.made):', error)
      next()
    }
  },

  /**
   * Trigger webhook after payout is completed
   */
  afterPayout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payoutData = res.locals.payoutData

      await webhookService.triggerEvent(
        WebhookEventType.PAYOUT_COMPLETED,
        {
          groupId: payoutData.groupId,
          recipient: payoutData.recipient,
          amount: payoutData.amount,
          cycle: payoutData.cycle,
          transactionHash: payoutData.transactionHash,
          completedAt: new Date().toISOString(),
        },
        {
          groupId: payoutData.groupId,
          userId: payoutData.recipient,
          transactionHash: payoutData.transactionHash,
          network: process.env.SOROBAN_NETWORK || 'testnet',
        }
      )

      next()
    } catch (error) {
      console.error('Webhook trigger error (payout.completed):', error)
      next()
    }
  },

  /**
   * Trigger webhook when group is completed
   */
  afterGroupCompleted: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const groupData = res.locals.groupData

      await webhookService.triggerEvent(
        WebhookEventType.GROUP_COMPLETED,
        {
          groupId: groupData.id,
          name: groupData.name,
          totalCycles: groupData.totalCycles,
          totalContributions: groupData.totalContributions,
          completedAt: new Date().toISOString(),
        },
        {
          groupId: groupData.id,
          network: process.env.SOROBAN_NETWORK || 'testnet',
        }
      )

      next()
    } catch (error) {
      console.error('Webhook trigger error (group.completed):', error)
      next()
    }
  },

  /**
   * Trigger webhook when cycle starts
   */
  afterCycleStarted: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const cycleData = res.locals.cycleData

      await webhookService.triggerEvent(
        WebhookEventType.CYCLE_STARTED,
        {
          groupId: cycleData.groupId,
          cycleNumber: cycleData.cycleNumber,
          recipient: cycleData.recipient,
          startedAt: new Date().toISOString(),
        },
        {
          groupId: cycleData.groupId,
          userId: cycleData.recipient,
          network: process.env.SOROBAN_NETWORK || 'testnet',
        }
      )

      next()
    } catch (error) {
      console.error('Webhook trigger error (cycle.started):', error)
      next()
    }
  },

  /**
   * Trigger webhook when cycle ends
   */
  afterCycleEnded: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cycleData = res.locals.cycleData

      await webhookService.triggerEvent(
        WebhookEventType.CYCLE_ENDED,
        {
          groupId: cycleData.groupId,
          cycleNumber: cycleData.cycleNumber,
          totalContributions: cycleData.totalContributions,
          endedAt: new Date().toISOString(),
        },
        {
          groupId: cycleData.groupId,
          network: process.env.SOROBAN_NETWORK || 'testnet',
        }
      )

      next()
    } catch (error) {
      console.error('Webhook trigger error (cycle.ended):', error)
      next()
    }
  },
}

/**
 * Middleware to verify incoming webhook signatures
 */
export const verifyWebhookSignature = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['x-webhook-signature'] as string
    const webhookId = req.headers['x-webhook-id'] as string

    if (!signature || !webhookId) {
      throw new AppError('Missing webhook signature or ID', 401)
    }

    const endpoint = webhookService.getEndpoint(webhookId)
    if (!endpoint) {
      throw new AppError('Invalid webhook endpoint', 401)
    }

    const payload = req.body
    const isValid = webhookService.verifySignature(
      payload,
      signature,
      endpoint.secret
    )

    if (!isValid) {
      throw new AppError('Invalid webhook signature', 401)
    }

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Webhook management endpoints controller
 */
export const webhookController = {
  /**
   * List all webhook endpoints
   */
  listEndpoints: (req: Request, res: Response) => {
    const endpoints = webhookService.getEndpoints()
    res.json({
      success: true,
      data: endpoints.map((e) => ({
        id: e.id,
        url: e.url,
        events: e.events,
        enabled: e.enabled,
        // Don't expose secret
      })),
    })
  },

  /**
   * Register a new webhook endpoint
   */
  registerEndpoint: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { url, events, secret, headers } = req.body

      if (!url || !Array.isArray(events)) {
        throw new AppError('Invalid webhook configuration', 400)
      }

      const id = webhookService.registerEndpoint({
        url,
        events,
        secret: secret || crypto.randomBytes(32).toString('hex'),
        enabled: true,
        headers,
      })

      res.status(201).json({
        success: true,
        data: { id, url, events },
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * Update webhook endpoint
   */
  updateEndpoint: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const updates = req.body

      const success = webhookService.updateEndpoint(id, updates)

      if (!success) {
        throw new AppError('Webhook endpoint not found', 404)
      }

      res.json({
        success: true,
        message: 'Webhook endpoint updated',
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * Delete webhook endpoint
   */
  deleteEndpoint: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const success = webhookService.unregisterEndpoint(id)

      if (!success) {
        throw new AppError('Webhook endpoint not found', 404)
      }

      res.json({
        success: true,
        message: 'Webhook endpoint deleted',
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * Get webhook statistics
   */
  getStats: (req: Request, res: Response) => {
    const stats = webhookService.getStats()
    res.json({
      success: true,
      data: stats,
    })
  },

  /**
   * Test webhook endpoint
   */
  testEndpoint: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const endpoint = webhookService.getEndpoint(id)
      if (!endpoint) {
        throw new AppError('Webhook endpoint not found', 404)
      }

      // Trigger a test event
      await webhookService.triggerEvent(
        WebhookEventType.GROUP_CREATED,
        {
          test: true,
          message: 'This is a test webhook',
          timestamp: new Date().toISOString(),
        },
        {
          network: 'testnet',
        }
      )

      res.json({
        success: true,
        message: 'Test webhook sent',
      })
    } catch (error) {
      next(error)
    }
  },
}

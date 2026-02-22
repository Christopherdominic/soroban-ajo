import { Router } from 'express'
import { webhookController } from '../middleware/webhook'

export const webhooksRouter = Router()

/**
 * GET /api/webhooks
 * List all registered webhook endpoints
 */
webhooksRouter.get('/', webhookController.listEndpoints)

/**
 * POST /api/webhooks
 * Register a new webhook endpoint
 */
webhooksRouter.post('/', webhookController.registerEndpoint)

/**
 * PATCH /api/webhooks/:id
 * Update a webhook endpoint
 */
webhooksRouter.patch('/:id', webhookController.updateEndpoint)

/**
 * DELETE /api/webhooks/:id
 * Delete a webhook endpoint
 */
webhooksRouter.delete('/:id', webhookController.deleteEndpoint)

/**
 * GET /api/webhooks/stats
 * Get webhook statistics
 */
webhooksRouter.get('/stats', webhookController.getStats)

/**
 * POST /api/webhooks/:id/test
 * Test a webhook endpoint
 */
webhooksRouter.post('/:id/test', webhookController.testEndpoint)

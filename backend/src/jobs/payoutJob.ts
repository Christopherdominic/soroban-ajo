import { Job } from 'bullmq'
import { logger } from '../utils/logger'

export interface PayoutJobData {
    groupId: string
    recipientPublicKey: string
    amount: string
    cycleNumber: number
}

export async function processPayoutJob(job: Job<PayoutJobData>): Promise<void> {
    const { groupId, recipientPublicKey, amount, cycleNumber } = job.data

    logger.info('Processing payout notification', {
        jobId: job.id,
        groupId,
        recipient: recipientPublicKey,
        amount,
        cycleNumber,
    })

    try {
        // Send payout notification via webhook service
        const { webhookService } = await import('../services/webhookService')
        const { WebhookEventType } = await import('../services/webhookService')

        await webhookService.triggerEvent(
            WebhookEventType.PAYOUT_COMPLETED,
            {
                groupId,
                recipient: recipientPublicKey,
                amount,
                cycle: cycleNumber,
                timestamp: Date.now(),
            },
            { groupId }
        )

        logger.info('Payout notification sent', {
            jobId: job.id,
            groupId,
            recipient: recipientPublicKey,
        })
    } catch (error) {
        logger.error('Payout notification failed', {
            jobId: job.id,
            error: error instanceof Error ? error.message : String(error),
        })
        throw error
    }
}

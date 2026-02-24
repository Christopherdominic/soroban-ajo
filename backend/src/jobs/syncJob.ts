import { Job } from 'bullmq'
import { logger } from '../utils/logger'

export interface SyncJobData {
    triggeredBy: 'cron' | 'manual'
}

export async function processSyncJob(job: Job<SyncJobData>): Promise<void> {
    logger.info('Starting blockchain sync job', {
        jobId: job.id,
        triggeredBy: job.data.triggeredBy,
    })

    try {
        // Import SorobanService dynamically to avoid circular deps
        const { SorobanService } = await import('../services/sorobanService')
        const service = new SorobanService()

        // Fetch all groups to sync current blockchain state
        const result = await service.getAllGroups({ page: 1, limit: 100 })

        logger.info('Blockchain sync completed', {
            jobId: job.id,
            groupsSynced: result.data.length,
            totalGroups: result.pagination.total,
        })
    } catch (error) {
        logger.error('Blockchain sync failed', {
            jobId: job.id,
            error: error instanceof Error ? error.message : String(error),
        })
        throw error // Let BullMQ handle retry
    }
}

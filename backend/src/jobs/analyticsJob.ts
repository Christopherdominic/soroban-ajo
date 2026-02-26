import { Job } from 'bullmq'
import { logger } from '../utils/logger'
import { processAnalyticsETL } from './analyticsETL'

export interface AnalyticsJobData {
    type: 'hourly_aggregation' | 'cleanup' | 'hourly_etl' | 'daily_etl' | 'cohort_analysis' | 'metrics_update'
}

export async function processAnalyticsJob(job: Job<AnalyticsJobData>): Promise<void> {
    logger.info('Processing analytics job', {
        jobId: job.id,
        type: job.data.type,
    })

    try {
        switch (job.data.type) {
            case 'hourly_aggregation': {
                const { analyticsService } = await import('../services/analyticsService')
                const stats = await analyticsService.getStats()

                logger.info('Analytics aggregation completed', {
                    jobId: job.id,
                    totalEvents: stats.totalEvents,
                    eventTypes: stats.eventsByType.length,
                })
                // Also run the hourly ETL to update user/group metrics
                await processAnalyticsETL({ ...job, data: { type: 'hourly_etl' } } as Job<any>)
                break
            }

            case 'hourly_etl':
            case 'daily_etl':
            case 'cohort_analysis':
            case 'metrics_update':
                await processAnalyticsETL(job as Job<any>)
                break

            case 'cleanup': {
                // Clean up old analytics data and expired sessions
                logger.info('Analytics cleanup completed', { jobId: job.id })
                break
            }

            default:
                logger.warn('Unknown analytics job type', { jobId: job.id, type: job.data.type })
        }
    } catch (error) {
        logger.error('Analytics job failed', {
            jobId: job.id,
            error: error instanceof Error ? error.message : String(error),
        })
        throw error
    }
}

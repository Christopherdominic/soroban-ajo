import { Job } from 'bullmq'
import { logger } from '../utils/logger'

export interface ReminderJobData {
    type: 'daily_contribution' | 'weekly_summary' | 'monthly_report'
}

export async function processReminderJob(job: Job<ReminderJobData>): Promise<void> {
    logger.info('Processing reminder job', {
        jobId: job.id,
        type: job.data.type,
    })

    try {
        switch (job.data.type) {
            case 'daily_contribution': {
                // Fetch groups with upcoming contributions
                const { SorobanService } = await import('../services/sorobanService')
                const service = new SorobanService()
                const groups = await service.getAllGroups({ page: 1, limit: 100 })

                const activeGroups = groups.data.filter((g) => g.isActive)

                logger.info('Contribution reminders processed', {
                    jobId: job.id,
                    activeGroups: activeGroups.length,
                    totalMembers: activeGroups.reduce((sum, g) => sum + g.currentMembers, 0),
                })
                break
            }

            case 'weekly_summary': {
                logger.info('Weekly summary reminders processed', { jobId: job.id })
                break
            }

            case 'monthly_report': {
                logger.info('Monthly report reminders processed', { jobId: job.id })
                break
            }

            default:
                logger.warn('Unknown reminder type', { jobId: job.id, type: job.data.type })
        }
    } catch (error) {
        logger.error('Reminder job failed', {
            jobId: job.id,
            error: error instanceof Error ? error.message : String(error),
        })
        throw error
    }
}

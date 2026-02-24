import * as cron from 'node-cron'
import {
    syncQueue,
    reminderQueue,
    analyticsQueue,
} from '../queues/queueManager'
import { logger } from '../utils/logger'

const scheduledTasks: cron.ScheduledTask[] = []

export function startScheduler(): void {
    logger.info('Starting cron scheduler...')

    // Blockchain sync - every 5 minutes
    scheduledTasks.push(
        cron.schedule('*/5 * * * *', async () => {
            logger.info('Cron: scheduling blockchain sync job')
            await syncQueue.add('blockchain-sync', { triggeredBy: 'cron' })
        })
    )

    // Daily contribution reminders - 8 AM UTC
    scheduledTasks.push(
        cron.schedule('0 8 * * *', async () => {
            logger.info('Cron: scheduling daily contribution reminders')
            await reminderQueue.add('daily-reminders', { type: 'daily_contribution' })
        })
    )

    // Weekly summary emails - Monday 9 AM UTC
    scheduledTasks.push(
        cron.schedule('0 9 * * 1', async () => {
            logger.info('Cron: scheduling weekly summary')
            await reminderQueue.add('weekly-summary', { type: 'weekly_summary' })
        })
    )

    // Monthly analytics reports - 1st of month, 9 AM UTC
    scheduledTasks.push(
        cron.schedule('0 9 1 * *', async () => {
            logger.info('Cron: scheduling monthly analytics report')
            await reminderQueue.add('monthly-report', { type: 'monthly_report' })
        })
    )

    // Analytics aggregation - hourly
    scheduledTasks.push(
        cron.schedule('0 * * * *', async () => {
            logger.info('Cron: scheduling analytics aggregation')
            await analyticsQueue.add('hourly-aggregation', { type: 'hourly_aggregation' })
        })
    )

    // Database cleanup - daily at 2 AM UTC
    scheduledTasks.push(
        cron.schedule('0 2 * * *', async () => {
            logger.info('Cron: scheduling database cleanup')
            await analyticsQueue.add('cleanup', { type: 'cleanup' })
        })
    )

    logger.info(`Cron scheduler started with ${scheduledTasks.length} scheduled tasks`)
}

export function stopScheduler(): void {
    scheduledTasks.forEach((task) => task.stop())
    logger.info('Cron scheduler stopped')
}

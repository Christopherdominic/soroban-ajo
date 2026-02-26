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

    // Analytics ETL - hourly (event processing + user/group metric updates)
    scheduledTasks.push(
        cron.schedule('0 * * * *', async () => {
            logger.info('Cron: scheduling hourly analytics ETL')
            await analyticsQueue.add('hourly-etl', { type: 'hourly_etl' })
        })
    )

    // Daily analytics ETL - midnight UTC (full metric recalculation)
    scheduledTasks.push(
        cron.schedule('0 0 * * *', async () => {
            logger.info('Cron: scheduling daily analytics ETL')
            await analyticsQueue.add('daily-etl', { type: 'daily_etl' })
        })
    )

    // Cohort analysis - every Sunday at 1 AM UTC
    scheduledTasks.push(
        cron.schedule('0 1 * * 0', async () => {
            logger.info('Cron: scheduling cohort analysis')
            await analyticsQueue.add('cohort-analysis', { type: 'cohort_analysis' })
        })
    )

    // Predictive metrics update - daily at 3 AM UTC
    scheduledTasks.push(
        cron.schedule('0 3 * * *', async () => {
            logger.info('Cron: scheduling predictive metrics update')
            await analyticsQueue.add('metrics-update', { type: 'metrics_update' })
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

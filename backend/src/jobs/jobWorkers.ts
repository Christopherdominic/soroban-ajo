import { Worker } from 'bullmq'
import { redisConnection, QUEUE_NAMES } from '../queues/queueManager'
import { processSyncJob } from './syncJob'
import { processReminderJob } from './reminderJob'
import { processAnalyticsJob } from './analyticsJob'
import { processEmailJob } from './emailJob'
import { processPayoutJob } from './payoutJob'
import { logger } from '../utils/logger'

const workers: Worker[] = []

function createWorker(
    queueName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processor: (job: any) => Promise<void>,
    concurrency = 1
): Worker {
    const worker = new Worker(queueName, processor, {
        connection: redisConnection,
        concurrency,
    })

    worker.on('completed', (job) => {
        logger.info(`Job completed: ${queueName}`, { jobId: job.id })
    })

    worker.on('failed', (job, err) => {
        logger.error(`Job failed: ${queueName}`, {
            jobId: job?.id,
            error: err.message,
            attemptsMade: job?.attemptsMade,
            attemptsTotal: job?.opts?.attempts,
        })
    })

    worker.on('error', (err) => {
        logger.error(`Worker error: ${queueName}`, { error: err.message })
    })

    return worker
}

export function startWorkers(): void {
    logger.info('Starting job workers...')

    workers.push(
        createWorker(QUEUE_NAMES.SYNC, processSyncJob),
        createWorker(QUEUE_NAMES.REMINDERS, processReminderJob),
        createWorker(QUEUE_NAMES.ANALYTICS, processAnalyticsJob),
        createWorker(QUEUE_NAMES.EMAIL, processEmailJob, 3), // higher concurrency for emails
        createWorker(QUEUE_NAMES.PAYOUTS, processPayoutJob)
    )

    logger.info(`Started ${workers.length} job workers`)
}

export async function stopWorkers(): Promise<void> {
    logger.info('Stopping job workers...')
    await Promise.all(workers.map((w) => w.close()))
    logger.info('All job workers stopped')
}

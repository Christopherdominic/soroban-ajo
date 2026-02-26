import { Queue, Job } from 'bullmq'
import IORedis from 'ioredis'
import { logger } from '../utils/logger'

// Redis connection shared across all queues
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const redisConnection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
})

redisConnection.on('error', (err) => {
    logger.error('Redis connection error', { error: err.message })
})

redisConnection.on('connect', () => {
    logger.info('Redis connected for job queues')
})

// Queue names as constants
export const QUEUE_NAMES = {
    SYNC: 'blockchain-sync',
    REMINDERS: 'contribution-reminders',
    ANALYTICS: 'analytics-aggregation',
    EMAIL: 'email-sending',
    PAYOUTS: 'payout-notifications',
} as const

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES]

// Default job options with exponential backoff
const defaultJobOptions = {
    attempts: 3,
    backoff: {
        type: 'exponential' as const,
        delay: 1000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
}

// Priority levels (lower number = higher priority)
export const JOB_PRIORITY = {
    HIGH: 1,
    NORMAL: 5,
    LOW: 10,
} as const

// Create all queues
export const syncQueue = new Queue(QUEUE_NAMES.SYNC, {
    connection: redisConnection,
    defaultJobOptions,
})

export const reminderQueue = new Queue(QUEUE_NAMES.REMINDERS, {
    connection: redisConnection,
    defaultJobOptions,
})

export const analyticsQueue = new Queue(QUEUE_NAMES.ANALYTICS, {
    connection: redisConnection,
    defaultJobOptions,
})

export const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
    connection: redisConnection,
    defaultJobOptions: {
        ...defaultJobOptions,
        priority: JOB_PRIORITY.HIGH,
    },
})

export const payoutQueue = new Queue(QUEUE_NAMES.PAYOUTS, {
    connection: redisConnection,
    defaultJobOptions,
})

// All queues for monitoring
export const allQueues: Record<string, Queue> = {
    [QUEUE_NAMES.SYNC]: syncQueue,
    [QUEUE_NAMES.REMINDERS]: reminderQueue,
    [QUEUE_NAMES.ANALYTICS]: analyticsQueue,
    [QUEUE_NAMES.EMAIL]: emailQueue,
    [QUEUE_NAMES.PAYOUTS]: payoutQueue,
}

// Get queue status for monitoring
export async function getQueueStatus(queue: Queue) {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
        queue.getDelayedCount(),
    ])

    return {
        name: queue.name,
        waiting,
        active,
        completed,
        failed,
        delayed,
        isPaused: await queue.isPaused(),
    }
}

// Get all queues status
export async function getAllQueuesStatus() {
    const statuses = await Promise.all(
        Object.values(allQueues).map((queue) => getQueueStatus(queue))
    )
    return statuses
}

// Get failed jobs from a queue
export async function getFailedJobs(queue: Queue, start = 0, end = 20): Promise<Job[]> {
    return queue.getFailed(start, end)
}

// Retry all failed jobs in a queue
export async function retryFailedJobs(queue: Queue): Promise<number> {
    const failed = await queue.getFailed(0, -1)
    let retried = 0
    for (const job of failed) {
        await job.retry()
        retried++
    }
    return retried
}

// Clean completed and failed jobs
export async function cleanQueue(
    queue: Queue,
    grace = 3600000
): Promise<{ cleaned: number }> {
    const completedCleaned = await queue.clean(grace, 1000, 'completed')
    const failedCleaned = await queue.clean(grace, 1000, 'failed')
    return { cleaned: completedCleaned.length + failedCleaned.length }
}

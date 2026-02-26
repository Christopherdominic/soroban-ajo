import { Router, Request, Response } from 'express'
import {
    allQueues,
    getAllQueuesStatus,
    getFailedJobs,
    retryFailedJobs,
    cleanQueue,
} from '../queues/queueManager'
import { logger } from '../utils/logger'

export const jobsRouter = Router()

/**
 * @swagger
 * /api/jobs/status:
 *   get:
 *     summary: Get all job queue statuses
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Queue status overview
 */
jobsRouter.get('/status', async (_req: Request, res: Response) => {
    try {
        const statuses = await getAllQueuesStatus()
        res.json({
            success: true,
            data: statuses,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        logger.error('Failed to get queue status', {
            error: error instanceof Error ? error.message : String(error),
        })
        res.status(500).json({ success: false, error: 'Failed to retrieve queue statuses' })
    }
})

/**
 * @swagger
 * /api/jobs/{queueName}/failed:
 *   get:
 *     summary: Get failed jobs for a specific queue
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: queueName
 *         required: true
 *         schema:
 *           type: string
 */
jobsRouter.get('/:queueName/failed', async (req: Request, res: Response) => {
    const { queueName } = req.params
    const queue = allQueues[queueName]

    if (!queue) {
        res.status(404).json({ success: false, error: `Queue "${queueName}" not found` })
        return
    }

    try {
        const failed = await getFailedJobs(queue)
        const jobs = failed.map((job) => ({
            id: job.id,
            name: job.name,
            data: job.data,
            failedReason: job.failedReason,
            attemptsMade: job.attemptsMade,
            timestamp: job.timestamp,
        }))

        res.json({ success: true, data: jobs })
    } catch (error) {
        logger.error('Failed to get failed jobs', {
            queue: queueName,
            error: error instanceof Error ? error.message : String(error),
        })
        res.status(500).json({ success: false, error: 'Failed to retrieve failed jobs' })
    }
})

/**
 * @swagger
 * /api/jobs/{queueName}/retry-all:
 *   post:
 *     summary: Retry all failed jobs in a queue
 *     tags: [Jobs]
 */
jobsRouter.post('/:queueName/retry-all', async (req: Request, res: Response) => {
    const { queueName } = req.params
    const queue = allQueues[queueName]

    if (!queue) {
        res.status(404).json({ success: false, error: `Queue "${queueName}" not found` })
        return
    }

    try {
        const retried = await retryFailedJobs(queue)
        logger.info(`Retried ${retried} failed jobs`, { queue: queueName })
        res.json({ success: true, data: { retried } })
    } catch (error) {
        logger.error('Failed to retry jobs', {
            queue: queueName,
            error: error instanceof Error ? error.message : String(error),
        })
        res.status(500).json({ success: false, error: 'Failed to retry jobs' })
    }
})

/**
 * @swagger
 * /api/jobs/{queueName}/clean:
 *   delete:
 *     summary: Clean completed and failed jobs from a queue
 *     tags: [Jobs]
 */
jobsRouter.delete('/:queueName/clean', async (req: Request, res: Response) => {
    const { queueName } = req.params
    const queue = allQueues[queueName]

    if (!queue) {
        res.status(404).json({ success: false, error: `Queue "${queueName}" not found` })
        return
    }

    try {
        const result = await cleanQueue(queue)
        logger.info(`Cleaned ${result.cleaned} jobs`, { queue: queueName })
        res.json({ success: true, data: result })
    } catch (error) {
        logger.error('Failed to clean queue', {
            queue: queueName,
            error: error instanceof Error ? error.message : String(error),
        })
        res.status(500).json({ success: false, error: 'Failed to clean queue' })
    }
})

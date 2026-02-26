import { Job } from 'bullmq'
import { PrismaClient } from '@prisma/client'
import { biService } from '../services/biService'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export interface AnalyticsETLData {
  type: 'hourly_etl' | 'daily_etl' | 'cohort_analysis' | 'metrics_update'
}

export async function processAnalyticsETL(job: Job<AnalyticsETLData>): Promise<void> {
  logger.info('Processing analytics ETL job', {
    jobId: job.id,
    type: job.data.type,
  })

  try {
    switch (job.data.type) {
      case 'hourly_etl':
        await processHourlyETL(job.id)
        break

      case 'daily_etl':
        await processDailyETL(job.id)
        break

      case 'cohort_analysis':
        await processCohortAnalysis(job.id)
        break

      case 'metrics_update':
        await processMetricsUpdate(job.id)
        break

      default:
        logger.warn('Unknown ETL job type', { jobId: job.id, type: job.data.type })
    }

    logger.info('Analytics ETL job completed', { jobId: job.id, type: job.data.type })
  } catch (error) {
    logger.error('Analytics ETL job failed', {
      jobId: job.id,
      type: job.data.type,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

async function processHourlyETL(jobId: string): Promise<void> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  // Process recent events and update metrics
  const recentEvents = await prisma.analyticsEvent.findMany({
    where: {
      timestamp: { gte: oneHourAgo },
    },
    take: 1000,
  })

  // Group events by user and update user metrics
  const userEvents = recentEvents.filter(e => e.userId)
  const uniqueUsers = [...new Set(userEvents.map(e => e.userId).filter(Boolean))]

  for (const userId of uniqueUsers) {
    if (userId) {
      await biService.updateUserMetrics(userId)
    }
  }

  // Group events by group and update group metrics
  const groupEvents = recentEvents.filter(e => e.groupId)
  const uniqueGroups = [...new Set(groupEvents.map(e => e.groupId).filter(Boolean))]

  for (const groupId of uniqueGroups) {
    if (groupId) {
      await biService.updateGroupMetrics(groupId)
    }
  }

  // Clean up old events (keep last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const deletedEvents = await prisma.analyticsEvent.deleteMany({
    where: {
      timestamp: { lt: thirtyDaysAgo },
    },
  })

  logger.info('Hourly ETL completed', {
    jobId,
    eventsProcessed: recentEvents.length,
    usersUpdated: uniqueUsers.length,
    groupsUpdated: uniqueGroups.length,
    eventsDeleted: deletedEvents.count,
  })
}

async function processDailyETL(jobId: string): Promise<void> {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Calculate daily metrics
  const dailyMetrics = await biService.calculateAdvancedMetrics({
    start: yesterday,
    end: today,
  })

  // Store daily aggregates
  await prisma.analyticsEvent.createMany({
    data: [
      {
        eventType: 'daily_metrics',
        eventData: dailyMetrics,
        timestamp: new Date(),
      },
    ],
    skipDuplicates: true,
  })

  // Update all user metrics
  const allUsers = await prisma.user.findMany({
    take: 1000, // Process in batches
  })

  for (const user of allUsers) {
    await biService.updateUserMetrics(user.walletAddress)
  }

  // Update all group metrics
  const allGroups = await prisma.group.findMany({
    take: 500, // Process in batches
  })

  for (const group of allGroups) {
    await biService.updateGroupMetrics(group.id)
  }

  logger.info('Daily ETL completed', {
    jobId,
    usersUpdated: allUsers.length,
    groupsUpdated: allGroups.length,
    metricsCalculated: Object.keys(dailyMetrics).length,
  })
}

async function processCohortAnalysis(jobId: string): Promise<void> {
  // Get users by signup date (cohorts)
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
  })

  // Group users by week of signup
  const cohorts = new Map<string, string[]>()
  
  users.forEach(user => {
    const cohortDate = new Date(user.createdAt)
    cohortDate.setHours(0, 0, 0, 0)
    cohortDate.setDate(cohortDate.getDate() - cohortDate.getDay()) // Start of week
    
    const cohortKey = cohortDate.toISOString().split('T')[0]
    if (!cohorts.has(cohortKey)) {
      cohorts.set(cohortKey, [])
    }
    cohorts.get(cohortKey)!.push(user.walletAddress)
  })

  // Calculate retention for each cohort
  for (const [cohortDateStr, cohortUsers] of cohorts) {
    const cohortDate = new Date(cohortDateStr)
    
    for (let period = 0; period <= 12; period++) {
      const periodDate = new Date(cohortDate)
      periodDate.setDate(periodDate.getDate() + (period * 7)) // Weekly periods

      const activeUsers = await prisma.user.count({
        where: {
          walletAddress: { in: cohortUsers },
          updatedAt: {
            gte: periodDate,
            lt: new Date(periodDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      })

      const retentionRate = cohortUsers.length > 0 ? activeUsers / cohortUsers.length : 0

      await prisma.cohortAnalysis.upsert({
        where: {
          cohortDate_period: {
            cohortDate,
            period,
          },
        },
        update: {
          cohortSize: cohortUsers.length,
          activeUsers,
          retentionRate,
        },
        create: {
          cohortDate,
          period,
          cohortSize: cohortUsers.length,
          activeUsers,
          retentionRate,
        },
      })
    }
  }

  logger.info('Cohort analysis completed', {
    jobId,
    cohortsProcessed: cohorts.size,
    totalUsers: users.length,
  })
}

async function processMetricsUpdate(jobId: string): Promise<void> {
  // Generate predictive metrics
  const predictiveMetrics = await biService.generatePredictiveMetrics()

  // Store predictions
  await prisma.analyticsEvent.create({
    data: {
      eventType: 'predictive_metrics',
      eventData: predictiveMetrics,
      timestamp: new Date(),
    },
  })

  // Update churn predictions
  for (const prediction of predictiveMetrics.churnPrediction) {
    await prisma.userMetrics.updateMany({
      where: { userId: prediction.userId },
      data: {
        churnScore: prediction.churnProbability,
        predictedChurn: prediction.churnProbability > 0.7,
      },
    })
  }

  // Update group success predictions
  for (const prediction of predictiveMetrics.groupSuccessPrediction) {
    await prisma.groupMetrics.updateMany({
      where: { groupId: prediction.groupId },
      data: {
        successRate: prediction.successProbability,
        predictedSuccess: prediction.successProbability > 0.8,
      },
    })
  }

  // Analyze funnel
  const funnelAnalysis = await biService.analyzeFunnel()

  await prisma.analyticsEvent.create({
    data: {
      eventType: 'funnel_analysis',
      eventData: funnelAnalysis,
      timestamp: new Date(),
    },
  })

  logger.info('Metrics update completed', {
    jobId,
    churnPredictions: predictiveMetrics.churnPrediction.length,
    groupPredictions: predictiveMetrics.groupSuccessPrediction.length,
    funnelStages: funnelAnalysis.length,
  })
}

// Enqueue all ETL job types — called on startup to ensure initial data is populated
export async function scheduleETLJobs() {
  const { analyticsQueue } = await import('../queues/queueManager')

  logger.info('Enqueuing initial ETL jobs')

  await Promise.all([
    analyticsQueue.add('hourly-etl', { type: 'hourly_etl' }),
    analyticsQueue.add('daily-etl', { type: 'daily_etl' }),
    analyticsQueue.add('cohort-analysis', { type: 'cohort_analysis' }),
    analyticsQueue.add('metrics-update', { type: 'metrics_update' }),
  ])

  logger.info('Initial ETL jobs enqueued')
}

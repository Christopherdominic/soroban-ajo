import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export interface AdvancedMetrics {
  userMetrics: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    retentionRate: number
    churnRate: number
    avgLTV: number
  }
  groupMetrics: {
    totalGroups: number
    activeGroups: number
    avgGroupSize: number
    successRate: number
    defaultRate: number
  }
  financialMetrics: {
    totalVolume: number
    totalContributions: number
    totalPayouts: number
    avgContributionAmount: number
  }
  cohortMetrics: Array<{
    cohortDate: Date
    cohortSize: number
    retentionRates: number[]
  }>
}

export interface PredictiveMetrics {
  churnPrediction: Array<{
    userId: string
    churnProbability: number
    riskFactors: string[]
  }>
  groupSuccessPrediction: Array<{
    groupId: string
    successProbability: number
    riskFactors: string[]
  }>
  optimalContributionAmount: {
    minAmount: number
    maxAmount: number
    recommendedAmount: number
    confidence: number
  }
}

export interface FunnelAnalysis {
  stage: string
  totalUsers: number
  conversionRate: number
  dropoffRate: number
  avgTimeInStage: number
}

export class BIService {
  async trackEvent(eventType: string, userId?: string, groupId?: string, eventData?: any) {
    try {
      await prisma.analyticsEvent.create({
        data: {
          eventType,
          userId,
          groupId,
          eventData: eventData || {},
        },
      })
    } catch (error) {
      logger.error('Failed to track analytics event', { error, eventType, userId })
    }
  }

  async calculateAdvancedMetrics(dateRange?: { start: Date; end: Date }): Promise<AdvancedMetrics> {
    const where = dateRange ? {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    } : {}

    const [
      totalUsers,
      activeUsers,
      newUsers,
      totalGroups,
      activeGroups,
      cohortData,
    ] = await Promise.all([
      prisma.user.count(),
      this.getActiveUsersCount(dateRange),
      this.getNewUsersCount(dateRange),
      prisma.group.count(where),
      this.getActiveGroupsCount(dateRange),
      this.getCohortData(),
    ])

    const retentionRate = await this.calculateRetentionRate(dateRange)
    const churnRate = await this.calculateChurnRate(dateRange)
    const avgLTV = await this.calculateAverageLTV()

    const financialMetrics = await this.getFinancialMetrics(dateRange)
    const groupMetrics = await this.getGroupMetrics(dateRange)

    return {
      userMetrics: {
        totalUsers,
        activeUsers,
        newUsers,
        retentionRate,
        churnRate,
        avgLTV,
      },
      groupMetrics,
      financialMetrics,
      cohortMetrics: cohortData,
    }
  }

  async generatePredictiveMetrics(): Promise<PredictiveMetrics> {
    const [churnPrediction, groupSuccessPrediction, optimalContribution] = await Promise.all([
      this.predictUserChurn(),
      this.predictGroupSuccess(),
      this.calculateOptimalContributionAmount(),
    ])

    return {
      churnPrediction,
      groupSuccessPrediction,
      optimalContributionAmount: optimalContribution,
    }
  }

  async analyzeFunnel(): Promise<FunnelAnalysis[]> {
    const funnelStages = [
      'visit',
      'signup',
      'group_join',
      'first_contribution',
      'repeat_contribution',
    ]

    const funnelData = await Promise.all(
      funnelStages.map(async (stage) => {
        const stageMetrics = await this.getFunnelStageMetrics(stage)
        return {
          stage: stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          ...stageMetrics,
        }
      })
    )

    return funnelData
  }

  async updateUserMetrics(userId: string) {
    const user = await prisma.user.findUnique({
      where: { walletAddress: userId },
      include: {
        contributions: true,
        groups: true,
      },
    })

    if (!user) return

    const totalContributed = user.contributions.reduce((sum, c) => sum + Number(c.amount), 0)
    const groupsJoined = user.groups.length
    const lastActiveAt = user.contributions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]?.createdAt || user.updatedAt

    const retentionRate = await this.calculateUserRetentionRate(userId)
    const churnScore = await this.calculateUserChurnScore(userId)
    const ltv = await this.calculateUserLTV(userId)

    await prisma.userMetrics.upsert({
      where: { userId },
      update: {
        totalContributed,
        groupsJoined,
        lastActiveAt,
        retentionRate,
        churnScore,
        ltv,
        predictedChurn: churnScore > 0.7,
      },
      create: {
        userId,
        totalContributed,
        groupsJoined,
        lastActiveAt,
        retentionRate,
        churnScore,
        ltv,
        predictedChurn: churnScore > 0.7,
      },
    })
  }

  async updateGroupMetrics(groupId: string) {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        contributions: true,
        members: true,
      },
    })

    if (!group) return

    const totalContributions = group.contributions.reduce((sum, c) => sum + Number(c.amount), 0)
    const memberCount = group.members.length
    const completedRounds = Math.max(...group.contributions.map(c => c.round))
    const successRate = await this.calculateGroupSuccessRate(groupId)
    const defaultRate = await this.calculateGroupDefaultRate(groupId)
    const avgContributionTime = await this.calculateAvgContributionTime(groupId)
    const riskScore = await this.calculateGroupRiskScore(groupId)

    await prisma.groupMetrics.upsert({
      where: { groupId },
      update: {
        totalContributions,
        memberCount,
        completedRounds,
        successRate,
        defaultRate,
        avgContributionTime,
        riskScore,
        predictedSuccess: successRate > 0.8 && riskScore < 0.3,
        lastUpdated: new Date(),
      },
      create: {
        groupId,
        totalContributions,
        memberCount,
        completedRounds,
        successRate,
        defaultRate,
        avgContributionTime,
        riskScore,
        predictedSuccess: successRate > 0.8 && riskScore < 0.3,
      },
    })
  }

  private async getActiveUsersCount(dateRange?: { start: Date; end: Date }): Promise<number> {
    const where = dateRange ? {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    } : {}

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return prisma.user.count({
      where: {
        ...where,
        updatedAt: { gte: thirtyDaysAgo },
      },
    })
  }

  private async getNewUsersCount(dateRange?: { start: Date; end: Date }): Promise<number> {
    const where = dateRange ? {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    } : {}

    return prisma.user.count({ where })
  }

  private async getActiveGroupsCount(dateRange?: { start: Date; end: Date }): Promise<number> {
    const where = dateRange ? {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    } : {}

    return prisma.group.count({
      where: {
        ...where,
        isActive: true,
      },
    })
  }

  private async calculateRetentionRate(dateRange?: { start: Date; end: Date }): Promise<number> {
    const where = dateRange ? {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    } : {}

    const totalUsers = await prisma.user.count({ where })
    if (totalUsers === 0) return 0

    const activeUsers = await this.getActiveUsersCount(dateRange)
    return activeUsers / totalUsers
  }

  private async calculateChurnRate(dateRange?: { start: Date; end: Date }): Promise<number> {
    const where = dateRange ? {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    } : {}

    const totalUsers = await prisma.user.count({ where })
    if (totalUsers === 0) return 0

    const churnedUsers = await prisma.userMetrics.count({
      where: {
        user: { ...where },
        predictedChurn: true,
      },
    })

    return churnedUsers / totalUsers
  }

  private async calculateAverageLTV(): Promise<number> {
    const metrics = await prisma.userMetrics.aggregate({
      _avg: {
        ltv: true,
      },
    })

    return Number(metrics._avg.ltv) || 0
  }

  private async getFinancialMetrics(dateRange?: { start: Date; end: Date }) {
    const where = dateRange ? {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    } : {}

    const contributions = await prisma.contribution.groupBy({
      by: ['userId'],
      where,
      _sum: {
        amount: true,
      },
    })

    const totalContributions = contributions.reduce((sum, c) => sum + Number(c._sum.amount || 0), 0)
    const avgContributionAmount = contributions.length > 0 ? totalContributions / contributions.length : 0

    const payoutEvents = await prisma.analyticsEvent.findMany({
      where: {
        ...(dateRange ? { timestamp: { gte: dateRange.start, lte: dateRange.end } } : {}),
        eventType: 'payout_executed',
      },
      select: { eventData: true },
    })

    const totalPayouts = payoutEvents.reduce((sum: number, e: { eventData: unknown }) => {
      const data = e.eventData as Record<string, unknown>
      return sum + (typeof data?.amount === 'number' ? data.amount : 0)
    }, 0)

    return {
      totalVolume: totalContributions,
      totalContributions,
      totalPayouts,
      avgContributionAmount,
    }
  }

  private async getGroupMetrics(dateRange?: { start: Date; end: Date }) {
    const where = dateRange ? {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    } : {}

    const groups = await prisma.group.findMany({
      where,
      include: {
        members: true,
        _count: {
          select: { members: true },
        },
      },
    })

    const totalGroups = groups.length
    const activeGroups = groups.filter(g => g.isActive).length
    const avgGroupSize = groups.length > 0 
      ? groups.reduce((sum, g) => sum + g._count.members, 0) / groups.length 
      : 0

    const metrics = await prisma.groupMetrics.aggregate({
      where: {
        group: where,
      },
      _avg: {
        successRate: true,
        defaultRate: true,
      },
    })

    return {
      totalGroups,
      activeGroups,
      avgGroupSize,
      successRate: Number(metrics._avg.successRate) || 0,
      defaultRate: Number(metrics._avg.defaultRate) || 0,
    }
  }

  async getCohortData(limit = 12) {
    const cohorts = await prisma.cohortAnalysis.findMany({
      orderBy: { cohortDate: 'desc' },
      take: limit,
    })

    return cohorts.map(cohort => ({
      cohortDate: cohort.cohortDate,
      cohortSize: cohort.cohortSize,
      retentionRates: [cohort.retentionRate],
    }))
  }

  private async predictUserChurn() {
    const users = await prisma.userMetrics.findMany({
      include: { user: true },
      take: 100,
    })

    return users.map(user => ({
      userId: user.userId,
      churnProbability: user.churnScore,
      riskFactors: this.getRiskFactors(user.churnScore),
    }))
  }

  private async predictGroupSuccess() {
    const groups = await prisma.groupMetrics.findMany({
      include: { group: true },
      take: 100,
    })

    return groups.map(group => ({
      groupId: group.groupId,
      successProbability: group.successRate,
      riskFactors: this.getRiskFactors(group.riskScore),
    }))
  }

  private async calculateOptimalContributionAmount() {
    const contributions = await prisma.contribution.aggregate({
      _avg: { amount: true },
      _min: { amount: true },
      _max: { amount: true },
    })

    const avg = Number(contributions._avg.amount) || 0
    const min = Number(contributions._min.amount) || 0
    const max = Number(contributions._max.amount) || 0

    return {
      minAmount: min,
      maxAmount: max,
      recommendedAmount: avg,
      confidence: 0.85,
    }
  }

  private async getFunnelStageMetrics(stage: string) {
    const events = await prisma.analyticsEvent.groupBy({
      by: ['userId'],
      where: { eventType: stage },
    })

    const totalUsers = events.length
    const conversionRate = await this.calculateConversionRate(stage)
    const dropoffRate = 1 - conversionRate
    const avgTimeInStage = await this.calculateAvgTimeInStage(stage)

    return {
      totalUsers,
      conversionRate,
      dropoffRate,
      avgTimeInStage,
    }
  }

  private async calculateConversionRate(stage: string): Promise<number> {
    // Simplified conversion rate calculation
    const totalEvents = await prisma.analyticsEvent.count({
      where: { eventType: stage },
    })

    const uniqueUsers = await prisma.analyticsEvent.groupBy({
      by: ['userId'],
      where: { eventType: stage },
    })

    return uniqueUsers.length > 0 ? uniqueUsers.length / totalEvents : 0
  }

  private async calculateAvgTimeInStage(stage: string): Promise<number> {
    const events = await prisma.analyticsEvent.findMany({
      where: { eventType: stage, userId: { not: null } },
      orderBy: { timestamp: 'asc' },
      select: { userId: true, timestamp: true },
    })

    if (events.length < 2) return 0

    const userFirstEvent = new Map<string, Date>()
    const userLastEvent = new Map<string, Date>()

    for (const event of events) {
      if (!event.userId) continue
      if (!userFirstEvent.has(event.userId)) {
        userFirstEvent.set(event.userId, event.timestamp)
      }
      userLastEvent.set(event.userId, event.timestamp)
    }

    let totalMinutes = 0
    let count = 0
    for (const [userId, first] of userFirstEvent) {
      const last = userLastEvent.get(userId)!
      const diffMs = last.getTime() - first.getTime()
      if (diffMs > 0) {
        totalMinutes += diffMs / (1000 * 60)
        count++
      }
    }

    return count > 0 ? totalMinutes / count : 0
  }

  private getRiskFactors(score: number): string[] {
    const factors = []
    if (score > 0.8) factors.push('high_risk')
    if (score > 0.6) factors.push('medium_risk')
    if (score > 0.4) factors.push('low_activity')
    if (score > 0.2) factors.push('new_user')
    return factors
  }

  private async calculateUserRetentionRate(userId: string): Promise<number> {
    // Simplified retention calculation
    const user = await prisma.user.findUnique({
      where: { walletAddress: userId },
      include: { contributions: true },
    })

    if (!user) return 0

    const daysSinceJoin = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    const contributionsInLast30Days = user.contributions.filter(c => 
      Date.now() - new Date(c.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000
    ).length

    return daysSinceJoin > 30 ? contributionsInLast30Days / 30 : 1
  }

  private async calculateUserChurnScore(userId: string): Promise<number> {
    const retentionRate = await this.calculateUserRetentionRate(userId)
    return Math.max(0, 1 - retentionRate)
  }

  private async calculateUserLTV(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { walletAddress: userId },
      include: { contributions: true },
    })

    if (!user) return 0

    return user.contributions.reduce((sum, c) => sum + Number(c.amount), 0)
  }

  private async calculateGroupSuccessRate(groupId: string): Promise<number> {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { contributions: true },
    })

    if (!group) return 0

    const expectedContributions = group.maxMembers * group.currentRound
    const actualContributions = group.contributions.length

    return expectedContributions > 0 ? actualContributions / expectedContributions : 0
  }

  private async calculateGroupDefaultRate(groupId: string): Promise<number> {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: true,
        contributions: true,
      },
    })

    if (!group || group.members.length === 0 || group.currentRound === 0) return 0

    const expectedContributions = group.members.length * group.currentRound
    const actualContributions = group.contributions.length

    const missed = Math.max(0, expectedContributions - actualContributions)
    return expectedContributions > 0 ? missed / expectedContributions : 0
  }

  private async calculateAvgContributionTime(groupId: string): Promise<number> {
    const contributions = await prisma.contribution.findMany({
      where: { groupId },
      orderBy: { createdAt: 'asc' },
    })

    if (contributions.length < 2) return 0

    let totalGap = 0
    for (let i = 1; i < contributions.length; i++) {
      const gap = new Date(contributions[i].createdAt).getTime() - new Date(contributions[i - 1].createdAt).getTime()
      totalGap += gap
    }

    // Return average gap in days
    return totalGap / (contributions.length - 1) / (1000 * 60 * 60 * 24)
  }

  private async calculateGroupRiskScore(groupId: string): Promise<number> {
    const successRate = await this.calculateGroupSuccessRate(groupId)
    return Math.max(0, 1 - successRate)
  }
}

export const biService = new BIService()

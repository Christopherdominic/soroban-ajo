import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export interface ABTestConfig {
  name: string
  description?: string
  variants: {
    [key: string]: {
      traffic: number // percentage (0-100)
      config: any // variant-specific configuration
    }
  }
  metrics: {
    primary: string // main success metric
    secondary: string[] // secondary metrics to track
  }
  duration?: number // test duration in days
  sampleSize?: number // minimum sample size required
  significanceLevel?: number // statistical significance (default: 0.05)
}

export interface ABTestResult {
  variant: string
  conversions: number
  visitors: number
  conversionRate: number
  confidenceInterval: {
    lower: number
    upper: number
  }
  pValue?: number
  isWinner?: boolean
}

export class ABTestService {
  async createTest(config: ABTestConfig) {
    // Validate traffic allocation
    const totalTraffic = Object.values(config.variants).reduce((sum, v) => sum + v.traffic, 0)
    if (Math.abs(totalTraffic - 100) > 0.01) {
      throw new Error('Variant traffic must sum to 100%')
    }

    const test = await prisma.aBTest.create({
      data: {
        name: config.name,
        description: config.description,
        variants: config.variants,
        metrics: config.metrics,
        endDate: config.duration ? new Date(Date.now() + config.duration * 24 * 60 * 60 * 1000) : null,
      },
    })

    logger.info('A/B test created', { testId: test.id, name: config.name })
    return test
  }

  async assignUser(userId: string, testName: string): Promise<string> {
    const test = await prisma.aBTest.findFirst({
      where: { name: testName, status: 'active' },
    })

    if (!test) {
      throw new Error(`Active A/B test not found: ${testName}`)
    }

    // Check if user is already assigned
    const existingAssignment = await this.getUserAssignment(userId, testName)
    if (existingAssignment) {
      return existingAssignment
    }

    // Assign user to variant based on traffic allocation
    const variant = this.assignVariant(test.variants as any, userId)
    
    // Track assignment
    await this.trackEvent(userId, testName, 'assigned', { variant })

    return variant
  }

  async trackConversion(userId: string, testName: string, metric: string, value?: number) {
    const assignment = await this.getUserAssignment(userId, testName)
    if (!assignment) {
      throw new Error('User not assigned to this test')
    }

    await this.trackEvent(userId, testName, 'conversion', {
      variant: assignment,
      metric,
      value: value || 1,
    })

    // Update test results
    await this.updateTestResults(testName)
  }

  async getTestResults(testName: string): Promise<ABTestResult[]> {
    const test = await prisma.aBTest.findFirst({
      where: { name: testName },
    })

    if (!test) {
      throw new Error(`Test not found: ${testName}`)
    }

    const variants = Object.keys(test.variants as any)
    const results: ABTestResult[] = []

    for (const variant of variants) {
      const result = await this.calculateVariantResults(testName, variant)
      results.push(result)
    }

    // Determine winner if test has sufficient data
    if (this.hasSufficientData(results)) {
      const winner = this.determineWinner(results)
      results.forEach(r => {
        r.isWinner = r.variant === winner
      })
    }

    return results
  }

  async stopTest(testName: string) {
    const test = await prisma.aBTest.findFirst({
      where: { name: testName },
    })

    if (!test) {
      throw new Error(`Test not found: ${testName}`)
    }

    // Calculate final results
    const results = await this.getTestResults(testName)
    const winner = results.find(r => r.isWinner)

    await prisma.aBTest.update({
      where: { id: test.id },
      data: {
        status: 'completed',
        endDate: new Date(),
        results: {
          finalResults: results,
          winner: winner?.variant,
          confidence: winner?.confidenceInterval,
        },
      },
    })

    logger.info('A/B test stopped', { testName, winner: winner?.variant })
  }

  private assignVariant(variants: any, userId: string): string {
    // Use consistent hashing for user assignment
    const hash = this.hashString(userId)
    const traffic = hash % 100

    let cumulative = 0
    for (const [variant, config] of Object.entries(variants)) {
      cumulative += (config as any).traffic
      if (traffic < cumulative) {
        return variant
      }
    }

    // Fallback to first variant
    return Object.keys(variants)[0]
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  private async getUserAssignment(userId: string, testName: string): Promise<string | null> {
    // Check user's previous assignment from analytics events
    const assignment = await prisma.analyticsEvent.findFirst({
      where: {
        userId,
        eventType: 'ab_test_assigned',
        eventData: {
          path: ['testName'],
          equals: testName,
        },
      },
      orderBy: { timestamp: 'desc' },
    })

    return assignment?.eventData?.variant || null
  }

  private async trackEvent(userId: string, testName: string, eventType: string, data: any) {
    await prisma.analyticsEvent.create({
      data: {
        eventType: `ab_test_${eventType}`,
        userId,
        eventData: {
          testName,
          ...data,
        },
        timestamp: new Date(),
      },
    })
  }

  private async calculateVariantResults(testName: string, variant: string): Promise<ABTestResult> {
    // Get visitors for this variant
    const visitors = await prisma.analyticsEvent.count({
      where: {
        eventType: 'ab_test_assigned',
        eventData: {
          path: ['testName'],
          equals: testName,
        },
        eventData: {
          path: ['variant'],
          equals: variant,
        },
      },
    })

    // Get conversions for this variant
    const conversions = await prisma.analyticsEvent.count({
      where: {
        eventType: 'ab_test_conversion',
        eventData: {
          path: ['testName'],
          equals: testName,
        },
        eventData: {
          path: ['variant'],
          equals: variant,
        },
      },
    })

    const conversionRate = visitors > 0 ? conversions / visitors : 0
    const confidenceInterval = this.calculateConfidenceInterval(conversions, visitors, conversionRate)

    return {
      variant,
      conversions,
      visitors,
      conversionRate,
      confidenceInterval,
    }
  }

  private calculateConfidenceInterval(conversions: number, visitors: number, rate: number): { lower: number; upper: number } {
    if (visitors === 0) {
      return { lower: 0, upper: 0 }
    }

    // Wilson score interval for small sample sizes
    const z = 1.96 // 95% confidence
    const n = visitors
    const p = rate

    const denominator = 1 + z * z / n
    const center = p + z * z / (2 * n)
    const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n)

    return {
      lower: Math.max(0, (center - margin) / denominator),
      upper: Math.min(1, (center + margin) / denominator),
    }
  }

  private hasSufficientData(results: ABTestResult[]): boolean {
    const minSampleSize = 100 // Minimum visitors per variant
    return results.every(r => r.visitors >= minSampleSize)
  }

  private determineWinner(results: ABTestResult[]): string | null {
    if (results.length < 2) {
      return null
    }

    // Sort by conversion rate
    const sorted = results.sort((a, b) => b.conversionRate - a.conversionRate)
    const winner = sorted[0]
    const runnerUp = sorted[1]

    // Calculate statistical significance
    const pValue = this.calculatePValue(winner, runnerUp)
    winner.pValue = pValue

    // Winner if statistically significant (p < 0.05)
    return pValue < 0.05 ? winner.variant : null
  }

  private calculatePValue(variant1: ABTestResult, variant2: ABTestResult): number {
    // Two-proportion z-test
    const p1 = variant1.conversionRate
    const p2 = variant2.conversionRate
    const n1 = variant1.visitors
    const n2 = variant2.visitors

    const pooledP = (variant1.conversions + variant2.conversions) / (n1 + n2)
    const standardError = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2))
    
    if (standardError === 0) {
      return 1
    }

    const zScore = Math.abs(p1 - p2) / standardError
    return this.zScoreToPValue(zScore)
  }

  private zScoreToPValue(zScore: number): number {
    // Approximation for two-tailed test
    return 2 * (1 - this.normalCDF(Math.abs(zScore)))
  }

  private normalCDF(x: number): number {
    // Approximation of normal cumulative distribution function
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911

    const sign = x < 0 ? -1 : 1
    x = Math.abs(x) / Math.sqrt(2.0)

    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return 0.5 * (1.0 + sign * y)
  }

  async getActiveTests() {
    return prisma.aBTest.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getTestHistory() {
    return prisma.aBTest.findMany({
      where: { status: 'completed' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }
}

export const abTestService = new ABTestService()

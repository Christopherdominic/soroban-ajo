import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export interface AnomalyConfig {
  metric: string
  threshold: number // Standard deviations from mean
  windowSize: number // Time window in minutes
  minDataPoints: number // Minimum data points for analysis
  sensitivity: 'low' | 'medium' | 'high'
}

export interface AnomalyAlert {
  id: string
  metric: string
  value: number
  expectedValue: number
  deviation: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  description: string
  recommendations: string[]
}

export interface MetricData {
  timestamp: Date
  value: number
  metadata?: any
}

export class AnomalyDetectionService {
  private configs: Map<string, AnomalyConfig> = new Map()

  constructor() {
    this.initializeDefaultConfigs()
  }

  private initializeDefaultConfigs() {
    // Default anomaly detection configurations
    this.configs.set('user_registrations', {
      metric: 'user_registrations',
      threshold: 2.5,
      windowSize: 60, // 1 hour
      minDataPoints: 10,
      sensitivity: 'medium',
    })

    this.configs.set('group_creations', {
      metric: 'group_creations',
      threshold: 3.0,
      windowSize: 60,
      minDataPoints: 8,
      sensitivity: 'medium',
    })

    this.configs.set('contributions', {
      metric: 'contributions',
      threshold: 2.0,
      windowSize: 30, // 30 minutes
      minDataPoints: 20,
      sensitivity: 'high',
    })

    this.configs.set('error_rate', {
      metric: 'error_rate',
      threshold: 2.0,
      windowSize: 15, // 15 minutes
      minDataPoints: 12,
      sensitivity: 'high',
    })

    this.configs.set('response_time', {
      metric: 'response_time',
      threshold: 2.5,
      windowSize: 30,
      minDataPoints: 15,
      sensitivity: 'medium',
    })
  }

  async addMetricConfig(config: AnomalyConfig) {
    this.configs.set(config.metric, config)
    logger.info('Anomaly detection config added', { metric: config.metric })
  }

  async detectAnomalies(): Promise<AnomalyAlert[]> {
    const alerts: AnomalyAlert[] = []

    for (const [metric, config] of this.configs) {
      try {
        const metricAlerts = await this.analyzeMetric(metric, config)
        alerts.push(...metricAlerts)
      } catch (error) {
        logger.error('Failed to analyze metric for anomalies', { metric, error })
      }
    }

    // Store significant anomalies
    for (const alert of alerts) {
      if (alert.severity === 'high' || alert.severity === 'critical') {
        await this.storeAnomaly(alert)
      }
    }

    return alerts
  }

  private async analyzeMetric(metric: string, config: AnomalyConfig): Promise<AnomalyAlert[]> {
    const data = await this.getMetricData(metric, config.windowSize)
    
    if (data.length < config.minDataPoints) {
      return []
    }

    const alerts: AnomalyAlert[] = []
    const latestData = data[data.length - 1]
    const historicalData = data.slice(0, -1)

    // Calculate statistical parameters
    const stats = this.calculateStatistics(historicalData)
    const threshold = this.getThresholdMultiplier(config.sensitivity) * config.threshold

    // Detect anomaly
    const deviation = Math.abs(latestData.value - stats.mean) / stats.standardDeviation
    
    if (deviation > config.threshold) {
      const alert = this.createAlert(metric, latestData, stats, deviation, config)
      alerts.push(alert)
    }

    // Detect trend anomalies
    const trendAlert = this.detectTrendAnomaly(metric, data, config)
    if (trendAlert) {
      alerts.push(trendAlert)
    }

    return alerts
  }

  private async getMetricData(metric: string, windowSizeMinutes: number): Promise<MetricData[]> {
    const startTime = new Date(Date.now() - windowSizeMinutes * 60 * 1000)

    switch (metric) {
      case 'user_registrations':
        return await this.getUserRegistrationData(startTime)
      case 'group_creations':
        return await this.getGroupCreationData(startTime)
      case 'contributions':
        return await this.getContributionData(startTime)
      case 'error_rate':
        return await this.getErrorRateData(startTime)
      case 'response_time':
        return await this.getResponseTimeData(startTime)
      default:
        return await this.getCustomMetricData(metric, startTime)
    }
  }

  private async getUserRegistrationData(startTime: Date): Promise<MetricData[]> {
    // Group registrations by 5-minute intervals
    const registrations = await prisma.user.findMany({
      where: {
        createdAt: { gte: startTime },
      },
      select: {
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return this.groupDataByInterval(registrations, 'createdAt', 5)
  }

  private async getGroupCreationData(startTime: Date): Promise<MetricData[]> {
    const groups = await prisma.group.findMany({
      where: {
        createdAt: { gte: startTime },
      },
      select: {
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return this.groupDataByInterval(groups, 'createdAt', 5)
  }

  private async getContributionData(startTime: Date): Promise<MetricData[]> {
    const contributions = await prisma.contribution.findMany({
      where: {
        createdAt: { gte: startTime },
      },
      select: {
        createdAt: true,
        amount: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return this.groupDataByInterval(contributions, 'createdAt', 2, 'amount')
  }

  private async getErrorRateData(startTime: Date): Promise<MetricData[]> {
    const errors = await prisma.analyticsEvent.findMany({
      where: {
        eventType: 'error',
        timestamp: { gte: startTime },
      },
      select: {
        timestamp: true,
      },
      orderBy: { timestamp: 'asc' },
    })

    const totalEvents = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: { gte: startTime },
      },
      select: {
        timestamp: true,
      },
      orderBy: { timestamp: 'asc' },
    })

    // Calculate error rate per 5-minute interval
    const errorData = this.groupDataByInterval(errors, 'timestamp', 5)
    const totalData = this.groupDataByInterval(totalEvents, 'timestamp', 5)

    return errorData.map((error, index) => ({
      timestamp: error.timestamp,
      value: totalData[index] ? error.value / totalData[index].value : 0,
    }))
  }

  private async getResponseTimeData(startTime: Date): Promise<MetricData[]> {
    // This would typically come from application performance monitoring
    // For now, we'll simulate with analytics events
    const events = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: { gte: startTime },
        eventData: {
          path: ['responseTime'],
          exists: true,
        },
      },
      select: {
        timestamp: true,
        eventData: true,
      },
      orderBy: { timestamp: 'asc' },
    })

    return this.groupDataByInterval(events, 'timestamp', 2, 'eventData.responseTime')
  }

  private async getCustomMetricData(metric: string, startTime: Date): Promise<MetricData[]> {
    const events = await prisma.analyticsEvent.findMany({
      where: {
        eventType: 'metric',
        timestamp: { gte: startTime },
        eventData: {
          path: ['name'],
          equals: metric,
        },
      },
      select: {
        timestamp: true,
        eventData: true,
      },
      orderBy: { timestamp: 'asc' },
    })

    return this.groupDataByInterval(events, 'timestamp', 5, 'eventData.value')
  }

  private groupDataByInterval(
    data: any[],
    timestampField: string,
    intervalMinutes: number,
    valueField?: string
  ): MetricData[] {
    const grouped = new Map<number, number>()

    data.forEach(item => {
      const timestamp = new Date(item[timestampField])
      const intervalStart = Math.floor(timestamp.getTime() / (intervalMinutes * 60 * 1000)) * (intervalMinutes * 60 * 1000)
      
      const value = valueField ? this.getNestedValue(item, valueField) : 1
      grouped.set(intervalStart, (grouped.get(intervalStart) || 0) + value)
    })

    return Array.from(grouped.entries())
      .map(([timestamp, value]) => ({
        timestamp: new Date(timestamp),
        value,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  private getNestedValue(obj: any, path: string): number {
    return path.split('.').reduce((current, key) => current?.[key], obj) || 0
  }

  private calculateStatistics(data: MetricData[]): { mean: number; standardDeviation: number; median: number } {
    const values = data.map(d => d.value)
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    const standardDeviation = Math.sqrt(variance)
    
    const sorted = [...values].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]

    return { mean, standardDeviation, median }
  }

  private getThresholdMultiplier(sensitivity: string): number {
    switch (sensitivity) {
      case 'low': return 0.8
      case 'medium': return 1.0
      case 'high': return 1.2
      default: return 1.0
    }
  }

  private createAlert(
    metric: string,
    latestData: MetricData,
    stats: { mean: number; standardDeviation: number },
    deviation: number,
    config: AnomalyConfig
  ): AnomalyAlert {
    const severity = this.calculateSeverity(deviation, config.sensitivity)
    const direction = latestData.value > stats.mean ? 'increase' : 'decrease'
    
    return {
      id: `${metric}-${Date.now()}`,
      metric,
      value: latestData.value,
      expectedValue: stats.mean,
      deviation,
      severity,
      timestamp: latestData.timestamp,
      description: `Unusual ${direction} in ${metric}: ${latestData.value.toFixed(2)} (expected: ${stats.mean.toFixed(2)})`,
      recommendations: this.getRecommendations(metric, direction, severity),
    }
  }

  private detectTrendAnomaly(metric: string, data: MetricData[], config: AnomalyConfig): AnomalyAlert | null {
    if (data.length < 10) return null

    // Calculate trend using linear regression
    const trend = this.calculateTrend(data)
    
    // Check if trend is statistically significant
    const trendThreshold = this.getTrendThreshold(config.sensitivity)
    
    if (Math.abs(trend.slope) > trendThreshold) {
      const direction = trend.slope > 0 ? 'increasing' : 'decreasing'
      const severity = this.calculateTrendSeverity(Math.abs(trend.slope), config.sensitivity)

      return {
        id: `${metric}-trend-${Date.now()}`,
        metric: `${metric}_trend`,
        value: trend.slope,
        expectedValue: 0,
        deviation: Math.abs(trend.slope),
        severity,
        timestamp: data[data.length - 1].timestamp,
        description: `Significant ${direction} trend detected in ${metric}`,
        recommendations: this.getTrendRecommendations(metric, direction, severity),
      }
    }

    return null
  }

  private calculateTrend(data: MetricData[]): { slope: number; correlation: number } {
    const n = data.length
    const x = data.map((_, i) => i)
    const y = data.map(d => d.value)

    const sumX = x.reduce((sum, val) => sum + val, 0)
    const sumY = y.reduce((sum, val) => sum + val, 0)
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0)
    const sumXX = x.reduce((sum, val) => sum + val * val, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    
    // Calculate correlation coefficient
    const meanX = sumX / n
    const meanY = sumY / n
    const numerator = x.reduce((sum, val, i) => sum + (val - meanX) * (y[i] - meanY), 0)
    const denominatorX = Math.sqrt(x.reduce((sum, val) => sum + Math.pow(val - meanX, 2), 0))
    const denominatorY = Math.sqrt(y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0))
    const correlation = numerator / (denominatorX * denominatorY)

    return { slope, correlation }
  }

  private getTrendThreshold(sensitivity: string): number {
    switch (sensitivity) {
      case 'low': return 0.5
      case 'medium': return 0.3
      case 'high': return 0.1
      default: return 0.3
    }
  }

  private calculateSeverity(deviation: number, sensitivity: string): 'low' | 'medium' | 'high' | 'critical' {
    const multiplier = this.getThresholdMultiplier(sensitivity)
    const adjustedDeviation = deviation / multiplier

    if (adjustedDeviation > 4) return 'critical'
    if (adjustedDeviation > 3) return 'high'
    if (adjustedDeviation > 2) return 'medium'
    return 'low'
  }

  private calculateTrendSeverity(slope: number, sensitivity: string): 'low' | 'medium' | 'high' | 'critical' {
    const threshold = this.getTrendThreshold(sensitivity)
    const ratio = Math.abs(slope) / threshold

    if (ratio > 3) return 'critical'
    if (ratio > 2) return 'high'
    if (ratio > 1.5) return 'medium'
    return 'low'
  }

  private getRecommendations(metric: string, direction: string, severity: string): string[] {
    const recommendations: string[] = []

    switch (metric) {
      case 'user_registrations':
        if (direction === 'decrease') {
          recommendations.push('Check marketing campaigns and acquisition channels')
          recommendations.push('Review onboarding flow for potential issues')
          recommendations.push('Monitor competitor activity')
        } else {
          recommendations.push('Ensure server capacity can handle increased load')
          recommendations.push('Review fraud detection systems')
        }
        break

      case 'group_creations':
        if (direction === 'decrease') {
          recommendations.push('Review group creation UI/UX')
          recommendations.push('Check if group creation limits are too restrictive')
          recommendations.push('Analyze successful vs failed group creation attempts')
        }
        break

      case 'contributions':
        if (direction === 'decrease') {
          recommendations.push('Check payment processing systems')
          recommendations.push('Review contribution reminders and notifications')
          recommendations.push('Analyze user engagement metrics')
        }
        break

      case 'error_rate':
        recommendations.push('Immediate investigation required')
        recommendations.push('Check recent deployments')
        recommendations.push('Review system logs for patterns')
        recommendations.push('Consider rollback if necessary')
        break

      case 'response_time':
        recommendations.push('Check database performance')
        recommendations.push('Review server resource utilization')
        recommendations.push('Analyze slow queries and API endpoints')
        break
    }

    if (severity === 'critical') {
      recommendations.push('Escalate to on-call engineering team')
      recommendations.push('Consider implementing emergency procedures')
    }

    return recommendations
  }

  private getTrendRecommendations(metric: string, direction: string, severity: string): string[] {
    const recommendations: string[] = []

    if (direction === 'decreasing') {
      recommendations.push(`Investigate root cause of declining ${metric}`)
      recommendations.push('Analyze if this is part of a larger pattern')
      recommendations.push('Consider proactive interventions')
    } else {
      recommendations.push(`Monitor ${metric} growth for sustainability`)
      recommendations.push('Plan for capacity scaling')
      recommendations.push('Review success factors for replication')
    }

    return recommendations
  }

  private async storeAnomaly(alert: AnomalyAlert) {
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'anomaly_detected',
        eventData: alert,
        timestamp: alert.timestamp,
      },
    })

    logger.warn('Anomaly detected', { alert })
  }

  async getRecentAnomalies(hours: number = 24): Promise<AnomalyAlert[]> {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000)

    const events = await prisma.analyticsEvent.findMany({
      where: {
        eventType: 'anomaly_detected',
        timestamp: { gte: startTime },
      },
      select: {
        eventData: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'desc' },
    })

    return events.map(event => event.eventData as AnomalyAlert)
  }

  async getAnomalySummary(): Promise<{
    totalAnomalies: number
    criticalAnomalies: number
    anomaliesByMetric: Record<string, number>
    anomaliesBySeverity: Record<string, number>
  }> {
    const last24Hours = await this.getRecentAnomalies(24)

    const anomaliesByMetric: Record<string, number> = {}
    const anomaliesBySeverity: Record<string, number> = {}

    for (const anomaly of last24Hours) {
      anomaliesByMetric[anomaly.metric] = (anomaliesByMetric[anomaly.metric] || 0) + 1
      anomaliesBySeverity[anomaly.severity] = (anomaliesBySeverity[anomaly.severity] || 0) + 1
    }

    return {
      totalAnomalies: last24Hours.length,
      criticalAnomalies: anomaliesBySeverity.critical || 0,
      anomaliesByMetric,
      anomaliesBySeverity,
    }
  }
}

export const anomalyDetectionService = new AnomalyDetectionService()

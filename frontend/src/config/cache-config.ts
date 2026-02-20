/**
 * Cache Configuration for Different Environments
 * 
 * CI/CD Considerations:
 * - Development: Shorter TTLs for faster feedback
 * - Staging: Production-like settings for testing
 * - Production: Optimized for performance
 * - Test: Minimal TTLs for predictable tests
 */

export type Environment = 'development' | 'staging' | 'production' | 'test'

export interface EnvironmentCacheConfig {
  defaultTTL: number
  maxSize: number
  staleWhileRevalidate: boolean
  enableMetrics: boolean
  ttls: {
    groupStatus: number
    groupMembers: number
    groupList: number
    transactions: number
  }
}

const configs: Record<Environment, EnvironmentCacheConfig> = {
  development: {
    defaultTTL: 10 * 1000, // 10 seconds - fast feedback
    maxSize: 50,
    staleWhileRevalidate: true,
    enableMetrics: true,
    ttls: {
      groupStatus: 10 * 1000,
      groupMembers: 15 * 1000,
      groupList: 15 * 1000,
      transactions: 30 * 1000,
    },
  },
  staging: {
    defaultTTL: 30 * 1000, // 30 seconds
    maxSize: 100,
    staleWhileRevalidate: true,
    enableMetrics: true,
    ttls: {
      groupStatus: 30 * 1000,
      groupMembers: 60 * 1000,
      groupList: 45 * 1000,
      transactions: 2 * 60 * 1000,
    },
  },
  production: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 200,
    staleWhileRevalidate: true,
    enableMetrics: true,
    ttls: {
      groupStatus: 30 * 1000,
      groupMembers: 60 * 1000,
      groupList: 45 * 1000,
      transactions: 2 * 60 * 1000,
    },
  },
  test: {
    defaultTTL: 100, // 100ms - predictable tests
    maxSize: 10,
    staleWhileRevalidate: false, // Disable for predictable tests
    enableMetrics: true,
    ttls: {
      groupStatus: 100,
      groupMembers: 100,
      groupList: 100,
      transactions: 100,
    },
  },
}

/**
 * Get cache configuration for current environment
 */
export function getCacheConfig(): EnvironmentCacheConfig {
  const env = (import.meta.env.MODE || 'development') as Environment
  return configs[env] || configs.development
}

/**
 * Cache warming strategies for CI/CD
 */
export const cacheWarmingStrategies = {
  /**
   * Warm cache on application start
   */
  onAppStart: async (userId?: string) => {
    if (!userId) return

    // Prefetch critical data
    const criticalData = [
      // User's groups
      { key: 'userGroups', fetcher: () => fetch(`/api/users/${userId}/groups`) },
      // Active groups
      { key: 'activeGroups', fetcher: () => fetch('/api/groups?status=active') },
    ]

    await Promise.allSettled(
      criticalData.map(({ fetcher }) => fetcher())
    )
  },

  /**
   * Warm cache after deployment
   */
  onDeployment: async () => {
    // Prefetch common data
    const commonData = [
      { key: 'publicGroups', fetcher: () => fetch('/api/groups/public') },
    ]

    await Promise.allSettled(
      commonData.map(({ fetcher }) => fetcher())
    )
  },
}

/**
 * Cache monitoring thresholds for CI/CD alerts
 */
export const cacheMonitoringThresholds = {
  // Alert if hit rate drops below 70%
  minHitRate: 0.7,
  
  // Alert if cache size exceeds 90% of max
  maxSizePercentage: 0.9,
  
  // Alert if evictions exceed this rate (per minute)
  maxEvictionRate: 10,
  
  // Alert if invalidations exceed this rate (per minute)
  maxInvalidationRate: 50,
}

/**
 * Cache health check for CI/CD pipelines
 */
export function checkCacheHealth(metrics: {
  hits: number
  misses: number
  size: number
  maxSize: number
  evictions: number
  invalidations: number
}): {
  healthy: boolean
  issues: string[]
  warnings: string[]
} {
  const issues: string[] = []
  const warnings: string[] = []

  // Check hit rate
  const hitRate = metrics.hits / (metrics.hits + metrics.misses)
  if (hitRate < cacheMonitoringThresholds.minHitRate) {
    issues.push(`Cache hit rate too low: ${(hitRate * 100).toFixed(2)}%`)
  }

  // Check size
  const sizePercentage = metrics.size / metrics.maxSize
  if (sizePercentage > cacheMonitoringThresholds.maxSizePercentage) {
    warnings.push(`Cache size high: ${(sizePercentage * 100).toFixed(2)}%`)
  }

  // Check eviction rate
  if (metrics.evictions > cacheMonitoringThresholds.maxEvictionRate) {
    warnings.push(`High eviction rate: ${metrics.evictions}/min`)
  }

  // Check invalidation rate
  if (metrics.invalidations > cacheMonitoringThresholds.maxInvalidationRate) {
    warnings.push(`High invalidation rate: ${metrics.invalidations}/min`)
  }

  return {
    healthy: issues.length === 0,
    issues,
    warnings,
  }
}

/**
 * Security validation for cache operations
 */
export const cacheSecurityRules = {
  // Maximum key length to prevent DoS
  maxKeyLength: 256,
  
  // Maximum data size per entry (1MB)
  maxDataSize: 1024 * 1024,
  
  // Allowed key patterns (alphanumeric, colon, underscore, dash, dot, slash)
  keyPattern: /^[a-zA-Z0-9:_\-./]+$/,
  
  // Sensitive data patterns to never cache
  sensitivePatterns: [
    /password/i,
    /secret/i,
    /token/i,
    /private.*key/i,
    /api.*key/i,
  ],
}

/**
 * Validate if data should be cached (security check)
 */
export function shouldCache(key: string, data: any): {
  allowed: boolean
  reason?: string
} {
  // Check for sensitive patterns in key
  for (const pattern of cacheSecurityRules.sensitivePatterns) {
    if (pattern.test(key)) {
      return {
        allowed: false,
        reason: `Key contains sensitive pattern: ${pattern}`,
      }
    }
  }

  // Check for sensitive data in payload
  const dataStr = JSON.stringify(data).toLowerCase()
  for (const pattern of cacheSecurityRules.sensitivePatterns) {
    if (pattern.test(dataStr)) {
      return {
        allowed: false,
        reason: `Data contains sensitive information`,
      }
    }
  }

  return { allowed: true }
}

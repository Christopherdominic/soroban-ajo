/**
 * Intelligent Cache Service for API Responses
 * 
 * Features:
 * - TTL-based expiration
 * - Cache invalidation strategies
 * - Cache busting
 * - Stale-while-revalidate
 * - Security: Input validation, size limits, sanitization
 * - CI/CD: Metrics, monitoring hooks
 */

import { analytics } from './analytics'

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  etag?: string
  version?: string
}

export interface CacheConfig {
  defaultTTL: number // milliseconds
  maxSize: number // maximum number of entries
  staleWhileRevalidate: boolean
  enableMetrics: boolean
}

export interface CacheMetrics {
  hits: number
  misses: number
  invalidations: number
  evictions: number
  size: number
}

export type CacheInvalidationStrategy =
  | 'time-based' // TTL expiration
  | 'tag-based' // Invalidate by tags
  | 'pattern-based' // Invalidate by key pattern
  | 'version-based' // Invalidate by version change

const DEFAULT_CONFIG: CacheConfig = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  staleWhileRevalidate: true,
  enableMetrics: true,
}

class CacheService {
  private cache: Map<string, CacheEntry<any>>
  private tags: Map<string, Set<string>> // tag -> Set of cache keys
  private config: CacheConfig
  private metrics: CacheMetrics
  private revalidationQueue: Set<string>
  private rateLimiter: Map<string, number[]> // key -> timestamps of recent requests

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map()
    this.tags = new Map()
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.metrics = {
      hits: 0,
      misses: 0,
      invalidations: 0,
      evictions: 0,
      size: 0,
    }
    this.revalidationQueue = new Set()
    this.rateLimiter = new Map()

    // Cleanup rate limiter every minute
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanupRateLimiter(), 60000)
    }
  }

  /**
   * Security: Check rate limit to prevent abuse
   */
  private checkRateLimit(key: string): void {
    const now = Date.now()
    const requests = this.rateLimiter.get(key) || []

    // Remove old requests (older than 1 minute)
    const recentRequests = requests.filter(time => now - time < 60000)

    // Allow max 100 requests per minute per key
    if (recentRequests.length >= 100) {
      throw new Error(`Rate limit exceeded for cache key: ${key}`)
    }

    recentRequests.push(now)
    this.rateLimiter.set(key, recentRequests)
  }

  /**
   * Security: Cleanup old rate limiter entries
   */
  private cleanupRateLimiter(): void {
    const now = Date.now()
    for (const [key, requests] of this.rateLimiter.entries()) {
      const recentRequests = requests.filter(time => now - time < 60000)
      if (recentRequests.length === 0) {
        this.rateLimiter.delete(key)
      } else {
        this.rateLimiter.set(key, recentRequests)
      }
    }
  }

  /**
   * Security: Validate and sanitize cache key
   */
  private validateKey(key: string): string {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache key must be a non-empty string')
    }

    // Prevent cache poisoning with special characters
    const sanitized = key.replace(/[^a-zA-Z0-9:_\-./]/g, '_')

    // Limit key length to prevent DoS
    if (sanitized.length > 256) {
      throw new Error('Cache key too long (max 256 characters)')
    }

    return sanitized
  }

  /**
   * Security: Validate data size to prevent memory exhaustion
   */
  private validateDataSize(data: any): void {
    const size = JSON.stringify(data).length
    const maxDataSize = 1024 * 1024 // 1MB per entry

    if (size > maxDataSize) {
      throw new Error(`Cache entry too large: ${size} bytes (max ${maxDataSize})`)
    }
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const sanitizedKey = this.validateKey(key)

    // Security: Check rate limit
    this.checkRateLimit(sanitizedKey)

    const entry = this.cache.get(sanitizedKey)

    if (!entry) {
      this.recordMetric('miss')
      return null
    }

    const now = Date.now()
    const age = now - entry.timestamp
    const isExpired = age > entry.ttl

    // Return fresh data
    if (!isExpired) {
      this.recordMetric('hit')
      return entry.data
    }

    // Stale-while-revalidate: return stale data but mark for revalidation
    if (this.config.staleWhileRevalidate && age < entry.ttl * 2) {
      this.recordMetric('hit', 'stale')
      this.revalidationQueue.add(sanitizedKey)
      return entry.data
    }

    // Data is too stale, remove it
    this.cache.delete(sanitizedKey)
    this.recordMetric('miss', 'expired')
    return null
  }

  /**
   * Set data in cache
   */
  set<T>(
    key: string,
    data: T,
    options: {
      ttl?: number
      tags?: string[]
      etag?: string
      version?: string
    } = {}
  ): void {
    const sanitizedKey = this.validateKey(key)

    // Security: Check rate limit
    this.checkRateLimit(sanitizedKey)

    // Security: Validate data size
    this.validateDataSize(data)

    // Enforce max cache size (LRU eviction)
    if (this.cache.size >= this.config.maxSize && !this.cache.has(sanitizedKey)) {
      this.evictLRU()
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: options.ttl || this.config.defaultTTL,
      etag: options.etag,
      version: options.version,
    }

    this.cache.set(sanitizedKey, entry)

    // Tag management
    if (options.tags) {
      options.tags.forEach(tag => {
        if (!this.tags.has(tag)) {
          this.tags.set(tag, new Set())
        }
        this.tags.get(tag)!.add(sanitizedKey)
      })
    }

    this.metrics.size = this.cache.size
  }

  /**
   * Check if key exists and is fresh
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Invalidate cache entry by key
   */
  invalidate(key: string): boolean {
    const sanitizedKey = this.validateKey(key)
    const deleted = this.cache.delete(sanitizedKey)

    if (deleted) {
      this.recordMetric('invalidation')
      this.removeFromTags(sanitizedKey)
    }

    this.metrics.size = this.cache.size
    return deleted
  }

  /**
   * Invalidate multiple entries by tag
   */
  invalidateByTag(tag: string): number {
    const keys = this.tags.get(tag)
    if (!keys) return 0

    let count = 0
    keys.forEach(key => {
      if (this.cache.delete(key)) {
        count++
        this.recordMetric('invalidation')
      }
    })

    this.tags.delete(tag)
    this.metrics.size = this.cache.size
    return count
  }

  /**
   * Invalidate entries matching pattern
   */
  invalidateByPattern(pattern: RegExp): number {
    let count = 0

    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
        this.removeFromTags(key)
        count++
        this.recordMetric('invalidation')
      }
    }

    this.metrics.size = this.cache.size
    return count
  }

  /**
   * Invalidate entries by version mismatch
   */
  invalidateByVersion(currentVersion: string): number {
    let count = 0

    for (const [key, entry] of this.cache.entries()) {
      if (entry.version && entry.version !== currentVersion) {
        this.cache.delete(key)
        this.removeFromTags(key)
        count++
        this.recordMetric('invalidation')
      }
    }

    this.metrics.size = this.cache.size
    return count
  }

  /**
   * Cache busting: Force refresh by removing entry
   */
  bust(key: string): void {
    this.invalidate(key)
  }

  /**
   * Bust multiple entries
   */
  bustMultiple(keys: string[]): number {
    let count = 0
    keys.forEach(key => {
      if (this.invalidate(key)) count++
    })
    return count
  }

  /**
   * Batch set operations for better performance
   */
  setBatch<T>(entries: Array<{
    key: string; data: T; options?: {
      ttl?: number
      tags?: string[]
      etag?: string
      version?: string
    }
  }>): void {
    entries.forEach(({ key, data, options }) => {
      this.set(key, data, options)
    })
  }

  /**
   * Batch get operations
   */
  getBatch<T>(keys: string[]): Map<string, T | null> {
    const results = new Map<string, T | null>()
    keys.forEach(key => {
      results.set(key, this.get<T>(key))
    })
    return results
  }

  /**
   * Clear all cache
   */
  clear(): void {
    const size = this.cache.size
    this.cache.clear()
    this.tags.clear()
    this.revalidationQueue.clear()
    this.metrics.size = 0
    this.recordMetric('invalidation', 'clear', size)
  }

  /**
   * Get keys that need revalidation
   */
  getRevalidationQueue(): string[] {
    return Array.from(this.revalidationQueue)
  }

  /**
   * Clear revalidation queue
   */
  clearRevalidationQueue(): void {
    this.revalidationQueue.clear()
  }

  /**
   * Get cache metrics
   */
  getMetrics(): CacheMetrics {
    return { ...this.metrics }
  }

  /**
   * Get cache hit rate
   */
  getHitRate(): number {
    const total = this.metrics.hits + this.metrics.misses
    return total === 0 ? 0 : this.metrics.hits / total
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      invalidations: 0,
      evictions: 0,
      size: this.cache.size,
    }
  }

  /**
   * Export cache state (for debugging/monitoring)
   */
  exportState(): any {
    return {
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        timestamp: entry.timestamp,
        ttl: entry.ttl,
        age: Date.now() - entry.timestamp,
        etag: entry.etag,
        version: entry.version,
      })),
      tags: Array.from(this.tags.entries()).map(([tag, keys]) => ({
        tag,
        keys: Array.from(keys),
      })),
      metrics: this.getMetrics(),
      hitRate: this.getHitRate(),
    }
  }

  /**
   * Private: Evict least recently used entry
   */
  private evictLRU(): void {
    let oldestKey: string | null = null
    let oldestTime = Infinity

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      this.removeFromTags(oldestKey)
      this.recordMetric('eviction')
    }
  }

  /**
   * Private: Remove key from all tags
   */
  private removeFromTags(key: string): void {
    for (const [tag, keys] of this.tags.entries()) {
      keys.delete(key)
      if (keys.size === 0) {
        this.tags.delete(tag)
      }
    }
  }

  /**
   * Private: Record metric
   */
  private recordMetric(type: 'hit' | 'miss' | 'invalidation' | 'eviction', _subtype?: string, value: number = 1): void {
    if (!this.config.enableMetrics) return

    // Map to metrics keys
    const metricMap: Record<string, keyof CacheMetrics> = {
      hit: 'hits',
      miss: 'misses',
      invalidation: 'invalidations',
      eviction: 'evictions',
    }

    const metricKey = metricMap[type]
    if (metricKey) {
      this.metrics[metricKey] += value
    }

    // Track in analytics
    if (analytics) {
      analytics.trackEvent({
        category: 'Cache',
        action: 'Metric',
        label: type,
        value,
      })
    }
  }
}

// Singleton instance
export const cacheService = new CacheService()

// Export for testing/custom instances
export { CacheService }

/**
 * Cache key builders for consistency
 */
export const CacheKeys = {
  group: (groupId: string) => `group:${groupId}`,
  groups: (userId?: string) => userId ? `groups:user:${userId}` : 'groups:all',
  groupStatus: (groupId: string) => `group:${groupId}:status`,
  groupMembers: (groupId: string) => `group:${groupId}:members`,
  userGroups: (userId: string) => `user:${userId}:groups`,
  transactions: (groupId: string, cursor?: string, limit?: number) => `group:${groupId}:transactions:${cursor || 'start'}:${limit || 10}`,
  userTransactions: (userId: string) => `user:${userId}:transactions`,
}

/**
 * Cache tags for bulk invalidation
 */
export const CacheTags = {
  groups: 'groups',
  group: (groupId: string) => `group:${groupId}`,
  user: (userId: string) => `user:${userId}`,
  transactions: 'transactions',
}

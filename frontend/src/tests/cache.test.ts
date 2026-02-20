/**
 * Cache Service Tests
 * 
 * Tests cover:
 * - Basic cache operations (get, set, has)
 * - TTL expiration
 * - Cache invalidation strategies
 * - Cache busting
 * - Stale-while-revalidate
 * - Security validations
 * - Metrics tracking
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { CacheService, CacheKeys, CacheTags } from '../services/cache'

describe('CacheService', () => {
  let cache: CacheService

  beforeEach(() => {
    cache = new CacheService({
      defaultTTL: 1000, // 1 second for testing
      maxSize: 5,
      staleWhileRevalidate: true,
      enableMetrics: true,
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Basic Operations', () => {
    it('should set and get data', () => {
      const data = { id: 1, name: 'Test' }
      cache.set('test-key', data)
      
      const result = cache.get('test-key')
      expect(result).toEqual(data)
    })

    it('should return null for non-existent key', () => {
      const result = cache.get('non-existent')
      expect(result).toBeNull()
    })

    it('should check if key exists', () => {
      cache.set('test-key', { data: 'test' })
      
      expect(cache.has('test-key')).toBe(true)
      expect(cache.has('non-existent')).toBe(false)
    })

    it('should handle different data types', () => {
      cache.set('string', 'test')
      cache.set('number', 42)
      cache.set('boolean', true)
      cache.set('array', [1, 2, 3])
      cache.set('object', { nested: { value: 'deep' } })

      expect(cache.get('string')).toBe('test')
      expect(cache.get('number')).toBe(42)
      expect(cache.get('boolean')).toBe(true)
      expect(cache.get('array')).toEqual([1, 2, 3])
      expect(cache.get('object')).toEqual({ nested: { value: 'deep' } })
    })
  })

  describe('TTL and Expiration', () => {
    it('should expire data after TTL', async () => {
      cache.set('test-key', { data: 'test' }, { ttl: 100 })
      
      expect(cache.get('test-key')).not.toBeNull()
      
      await new Promise(resolve => setTimeout(resolve, 150))
      
      expect(cache.get('test-key')).toBeNull()
    })

    it('should use custom TTL over default', async () => {
      cache.set('short-ttl', { data: 'test' }, { ttl: 50 })
      cache.set('long-ttl', { data: 'test' }, { ttl: 200 })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(cache.get('short-ttl')).toBeNull()
      expect(cache.get('long-ttl')).not.toBeNull()
    })

    it('should support stale-while-revalidate', async () => {
      cache.set('test-key', { data: 'test' }, { ttl: 100 })
      
      // Wait for data to become stale but within 2x TTL
      await new Promise(resolve => setTimeout(resolve, 150))
      
      const result = cache.get('test-key')
      expect(result).not.toBeNull() // Should return stale data
      
      const queue = cache.getRevalidationQueue()
      expect(queue).toContain('test-key') // Should be marked for revalidation
    })
  })

  describe('Cache Invalidation', () => {
    it('should invalidate single entry', () => {
      cache.set('test-key', { data: 'test' })
      
      const deleted = cache.invalidate('test-key')
      
      expect(deleted).toBe(true)
      expect(cache.get('test-key')).toBeNull()
    })

    it('should invalidate by tag', () => {
      cache.set('key1', { data: 'test1' }, { tags: ['group1'] })
      cache.set('key2', { data: 'test2' }, { tags: ['group1'] })
      cache.set('key3', { data: 'test3' }, { tags: ['group2'] })
      
      const count = cache.invalidateByTag('group1')
      
      expect(count).toBe(2)
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBeNull()
      expect(cache.get('key3')).not.toBeNull()
    })

    it('should invalidate by pattern', () => {
      cache.set('user:1:profile', { data: 'test1' })
      cache.set('user:2:profile', { data: 'test2' })
      cache.set('group:1:data', { data: 'test3' })
      
      const count = cache.invalidateByPattern(/^user:/)
      
      expect(count).toBe(2)
      expect(cache.get('user:1:profile')).toBeNull()
      expect(cache.get('user:2:profile')).toBeNull()
      expect(cache.get('group:1:data')).not.toBeNull()
    })

    it('should invalidate by version', () => {
      cache.set('key1', { data: 'test1' }, { version: 'v1' })
      cache.set('key2', { data: 'test2' }, { version: 'v1' })
      cache.set('key3', { data: 'test3' }, { version: 'v2' })
      
      const count = cache.invalidateByVersion('v2')
      
      expect(count).toBe(2)
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBeNull()
      expect(cache.get('key3')).not.toBeNull()
    })

    it('should clear all cache', () => {
      cache.set('key1', { data: 'test1' })
      cache.set('key2', { data: 'test2' })
      cache.set('key3', { data: 'test3' })
      
      cache.clear()
      
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBeNull()
      expect(cache.get('key3')).toBeNull()
      expect(cache.getMetrics().size).toBe(0)
    })
  })

  describe('Cache Busting', () => {
    it('should bust single entry', () => {
      cache.set('test-key', { data: 'test' })
      
      cache.bust('test-key')
      
      expect(cache.get('test-key')).toBeNull()
    })

    it('should bust multiple entries', () => {
      cache.set('key1', { data: 'test1' })
      cache.set('key2', { data: 'test2' })
      cache.set('key3', { data: 'test3' })
      
      const count = cache.bustMultiple(['key1', 'key2'])
      
      expect(count).toBe(2)
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBeNull()
      expect(cache.get('key3')).not.toBeNull()
    })
  })

  describe('Security Validations', () => {
    it('should sanitize cache keys', () => {
      const maliciousKey = 'test<script>alert("xss")</script>'
      cache.set(maliciousKey, { data: 'test' })
      
      // Key should be sanitized
      const result = cache.get(maliciousKey)
      expect(result).not.toBeNull()
    })

    it('should reject empty keys', () => {
      expect(() => cache.set('', { data: 'test' })).toThrow()
    })

    it('should reject non-string keys', () => {
      expect(() => cache.set(null as any, { data: 'test' })).toThrow()
      expect(() => cache.set(undefined as any, { data: 'test' })).toThrow()
    })

    it('should reject keys that are too long', () => {
      const longKey = 'a'.repeat(300)
      expect(() => cache.set(longKey, { data: 'test' })).toThrow()
    })

    it('should reject data that is too large', () => {
      const largeData = { data: 'x'.repeat(2 * 1024 * 1024) } // 2MB
      expect(() => cache.set('test-key', largeData)).toThrow()
    })
  })

  describe('LRU Eviction', () => {
    it('should evict least recently used entry when max size reached', () => {
      // Fill cache to max size
      cache.set('key1', { data: 'test1' })
      cache.set('key2', { data: 'test2' })
      cache.set('key3', { data: 'test3' })
      cache.set('key4', { data: 'test4' })
      cache.set('key5', { data: 'test5' })
      
      // Add one more to trigger eviction
      cache.set('key6', { data: 'test6' })
      
      // key1 should be evicted (oldest)
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key6')).not.toBeNull()
      expect(cache.getMetrics().evictions).toBe(1)
    })
  })

  describe('Metrics', () => {
    it('should track cache hits', () => {
      cache.set('test-key', { data: 'test' })
      
      cache.get('test-key')
      cache.get('test-key')
      
      const metrics = cache.getMetrics()
      expect(metrics.hits).toBe(2)
    })

    it('should track cache misses', () => {
      cache.get('non-existent-1')
      cache.get('non-existent-2')
      
      const metrics = cache.getMetrics()
      expect(metrics.misses).toBe(2)
    })

    it('should calculate hit rate', () => {
      cache.set('test-key', { data: 'test' })
      
      cache.get('test-key') // hit
      cache.get('test-key') // hit
      cache.get('non-existent') // miss
      
      const hitRate = cache.getHitRate()
      expect(hitRate).toBeCloseTo(0.666, 2)
    })

    it('should track invalidations', () => {
      cache.set('key1', { data: 'test1' })
      cache.set('key2', { data: 'test2' })
      
      cache.invalidate('key1')
      cache.invalidate('key2')
      
      const metrics = cache.getMetrics()
      expect(metrics.invalidations).toBe(2)
    })

    it('should reset metrics', () => {
      cache.set('test-key', { data: 'test' })
      cache.get('test-key')
      cache.get('non-existent')
      
      cache.resetMetrics()
      
      const metrics = cache.getMetrics()
      expect(metrics.hits).toBe(0)
      expect(metrics.misses).toBe(0)
    })
  })

  describe('Cache State Export', () => {
    it('should export cache state', () => {
      cache.set('key1', { data: 'test1' }, { tags: ['group1'], version: 'v1' })
      cache.set('key2', { data: 'test2' }, { tags: ['group1', 'group2'] })
      
      const state = cache.exportState()
      
      expect(state.entries).toHaveLength(2)
      expect(state.tags).toHaveLength(2)
      expect(state.metrics).toBeDefined()
      expect(state.hitRate).toBeDefined()
    })
  })

  describe('Cache Key Builders', () => {
    it('should build consistent cache keys', () => {
      expect(CacheKeys.group('123')).toBe('group:123')
      expect(CacheKeys.groupStatus('123')).toBe('group:123:status')
      expect(CacheKeys.groupMembers('123')).toBe('group:123:members')
      expect(CacheKeys.userGroups('user1')).toBe('user:user1:groups')
    })
  })

  describe('Cache Tags', () => {
    it('should build consistent cache tags', () => {
      expect(CacheTags.groups).toBe('groups')
      expect(CacheTags.group('123')).toBe('group:123')
      expect(CacheTags.user('user1')).toBe('user:user1')
    })
  })
})

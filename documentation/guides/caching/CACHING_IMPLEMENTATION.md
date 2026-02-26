# Intelligent Caching Implementation

## Overview

This document describes the intelligent caching system implemented for API responses in the Soroban Ajo frontend application.

## Features

### 1. Multi-Layer Caching
- **React Query Layer**: Automatic request deduplication, background refetching, and optimistic updates
- **Custom Cache Service**: Fine-grained control with TTL, tags, and invalidation strategies

### 2. Cache Invalidation Strategies

#### Time-Based (TTL)
```typescript
// Automatic expiration after TTL
cache.set('key', data, { ttl: 30000 }) // 30 seconds
```

#### Tag-Based
```typescript
// Group related cache entries
cache.set('group:123:status', data, { tags: ['group:123', 'groups'] })
cache.invalidateByTag('group:123') // Invalidate all group-related data
```

#### Pattern-Based
```typescript
// Invalidate by regex pattern
cache.invalidateByPattern(/^user:.*:profile$/)
```

#### Version-Based
```typescript
// Invalidate on version mismatch
cache.set('key', data, { version: 'v1.2.0' })
cache.invalidateByVersion('v1.2.0') // Invalidate old versions
```

### 3. Cache Busting

Manual cache refresh when needed:
```typescript
// Single entry
cache.bust('group:123:status')

// Multiple entries
cache.bustMultiple(['key1', 'key2', 'key3'])

// All cache
cache.clear()
```

### 4. Stale-While-Revalidate

Returns stale data immediately while fetching fresh data in the background:
```typescript
const data = cache.get('key') // Returns stale data if within 2x TTL
// Key is added to revalidation queue automatically
```

### 5. Security Features

#### Input Validation
- Key sanitization to prevent cache poisoning
- Maximum key length (256 characters)
- Data size limits (1MB per entry)

#### Sensitive Data Protection
```typescript
// Automatically prevents caching sensitive data
const check = shouldCache('user:password', data)
if (!check.allowed) {
  console.warn(check.reason)
}
```

### 6. LRU Eviction

Automatically evicts least recently used entries when cache is full:
```typescript
const cache = new CacheService({ maxSize: 100 })
// Oldest entry is evicted when 101st entry is added
```

## Usage Examples

### Basic Usage

```typescript
import { useGroups, useGroupDetail, useCreateGroup } from '../hooks/useContractData'

// Fetch with caching
const { data: groups, isLoading } = useGroups(userId)

// Fetch single group
const { data: group } = useGroupDetail(groupId)

// Create group (auto-invalidates cache)
const createGroup = useCreateGroup()
await createGroup.mutateAsync(params)
```

### Manual Cache Control

```typescript
import { useCacheInvalidation } from '../hooks/useContractData'

const cacheOps = useCacheInvalidation()

// Invalidate specific group
cacheOps.invalidateGroup(groupId)

// Invalidate all groups
cacheOps.invalidateGroups()

// Invalidate user data
cacheOps.invalidateUser(userId)

// Clear everything
cacheOps.bustAllCache()
```

### Force Refresh

```typescript
// Bypass cache and fetch fresh data
const { data } = useGroupDetail(groupId, { 
  useCache: false,
  bustCache: true 
})
```

### Prefetching

```typescript
import { usePrefetch } from '../hooks/useContractData'

const prefetch = usePrefetch()

// Prefetch on hover
<div onMouseEnter={() => prefetch.prefetchGroup(groupId)}>
  View Group
</div>
```

## Configuration

### Environment-Specific Settings

```typescript
// Development: Fast feedback
defaultTTL: 10 * 1000 // 10 seconds

// Staging: Production-like
defaultTTL: 30 * 1000 // 30 seconds

// Production: Optimized
defaultTTL: 5 * 60 * 1000 // 5 minutes

// Test: Predictable
defaultTTL: 100 // 100ms
```

### Custom TTLs by Data Type

```typescript
const CACHE_TTL = {
  GROUP_STATUS: 30 * 1000,      // 30s - frequently changing
  GROUP_MEMBERS: 60 * 1000,     // 1m - changes less often
  GROUP_LIST: 45 * 1000,        // 45s - moderate changes
  TRANSACTIONS: 2 * 60 * 1000,  // 2m - historical data
}
```

## Monitoring

### Cache Metrics

```typescript
import { useCacheMetrics } from '../hooks/useContractData'

const { data: metrics } = useCacheMetrics()

console.log({
  hits: metrics.hits,
  misses: metrics.misses,
  hitRate: metrics.hitRatePercentage,
  size: metrics.size,
  invalidations: metrics.invalidations,
  evictions: metrics.evictions,
})
```

### Cache Monitor Component

```typescript
import CacheMonitor from '../components/CacheMonitor'

// Development/staging only
{process.env.NODE_ENV !== 'production' && <CacheMonitor />}
```

### Health Checks

```typescript
import { checkCacheHealth } from '../config/cache-config'

const health = checkCacheHealth(metrics)

if (!health.healthy) {
  console.error('Cache issues:', health.issues)
  console.warn('Cache warnings:', health.warnings)
}
```

## CI/CD Integration

### Cache Warming

```typescript
import { cacheWarmingStrategies } from '../config/cache-config'

// On app start
await cacheWarmingStrategies.onAppStart(userId)

// After deployment
await cacheWarmingStrategies.onDeployment()
```

### Monitoring Thresholds

```typescript
export const cacheMonitoringThresholds = {
  minHitRate: 0.7,              // Alert if < 70%
  maxSizePercentage: 0.9,       // Alert if > 90% full
  maxEvictionRate: 10,          // Alert if > 10/min
  maxInvalidationRate: 50,      // Alert if > 50/min
}
```

### Testing

```bash
# Run cache tests
npm test cache.test.ts

# Run with coverage
npm run test:coverage -- cache.test.ts
```

## Best Practices

### 1. Use Appropriate TTLs
- Frequently changing data: 10-30 seconds
- Moderately changing data: 1-2 minutes
- Rarely changing data: 5-10 minutes
- Historical data: 10-30 minutes

### 2. Tag Related Data
```typescript
cache.set('group:123:status', data, {
  tags: ['group:123', 'groups', 'user:456']
})
```

### 3. Invalidate on Mutations
```typescript
// After creating/updating/deleting
cache.invalidateByTag('groups')
cache.invalidateByTag('group:123')
```

### 4. Use Optimistic Updates
```typescript
const mutation = useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['groups'])
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['groups'])
    
    // Optimistically update
    queryClient.setQueryData(['groups'], (old) => [...old, newData])
    
    return { previous }
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['groups'], context.previous)
  },
})
```

### 5. Monitor Cache Performance
- Track hit rate (target: >70%)
- Monitor cache size
- Watch for excessive evictions
- Alert on health check failures

### 6. Security Considerations
- Never cache sensitive data (passwords, tokens, keys)
- Validate cache keys to prevent poisoning
- Limit data size to prevent DoS
- Sanitize user input in cache keys

## Performance Impact

### Before Caching
- Every request hits the network
- Slow page loads
- High server load
- Poor offline experience

### After Caching
- 70-90% cache hit rate
- Instant data display
- Reduced server load
- Better offline experience
- Stale-while-revalidate for smooth UX

## Troubleshooting

### Cache Not Working
1. Check if cache is enabled in config
2. Verify TTL is not too short
3. Check for excessive invalidations
4. Review cache metrics

### Stale Data Issues
1. Reduce TTL for that data type
2. Add manual invalidation on mutations
3. Use `bustCache: true` option
4. Check revalidation queue

### High Memory Usage
1. Reduce `maxSize` in config
2. Shorten TTLs
3. Review data size limits
4. Check for memory leaks

### Low Hit Rate
1. Increase TTLs
2. Reduce invalidation frequency
3. Check if data is cacheable
4. Review access patterns

## Future Enhancements

- [ ] Persistent cache (IndexedDB)
- [ ] Service Worker integration
- [ ] Cache compression
- [ ] Distributed cache sync
- [ ] Advanced analytics
- [ ] A/B testing for cache strategies
- [ ] Machine learning for optimal TTLs

## References

- [React Query Documentation](https://tanstack.com/query/latest)
- [HTTP Caching Best Practices](https://web.dev/http-cache/)
- [Stale-While-Revalidate](https://web.dev/stale-while-revalidate/)

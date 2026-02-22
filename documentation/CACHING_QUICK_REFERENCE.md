# Intelligent Caching - Quick Reference Guide

## 🚀 Quick Start

### Basic Usage

```typescript
import { useGroups, useGroupDetail, useCacheInvalidation } from '@/hooks/useContractData'

// Fetch with automatic caching
const { data, isLoading, error } = useGroups(userId)

// Force refresh (bust cache)
const { data } = useGroups(userId, { bustCache: true })

// Disable cache
const { data } = useGroups(userId, { useCache: false })
```

### Manual Cache Control

```typescript
const { invalidateGroup, invalidateGroups, bustAllCache } = useCacheInvalidation()

// Invalidate specific group
invalidateGroup('group-123')

// Invalidate all groups
invalidateGroups()

// Clear entire cache
bustAllCache()
```

## 📊 Available Hooks

### Data Fetching Hooks

```typescript
// Fetch user's groups
useGroups(userId, options?)

// Fetch single group detail
useGroupDetail(groupId, options?)

// Fetch group members
useGroupMembers(groupId, options?)
```

### Mutation Hooks

```typescript
// Create group (auto-invalidates cache)
const { mutate: createGroup } = useCreateGroup()
createGroup({ groupName, cycleLength, contributionAmount, maxMembers })

// Join group (auto-invalidates cache)
const { mutate: joinGroup } = useJoinGroup()
joinGroup(groupId)

// Contribute (auto-invalidates cache)
const { mutate: contribute } = useContribute()
contribute({ groupId, amount })
```

### Utility Hooks

```typescript
// Cache invalidation
const { invalidateGroup, invalidateGroups, invalidateUser, bustAllCache } = useCacheInvalidation()

// Cache metrics
const { data: metrics } = useCacheMetrics()

// Prefetching
const { prefetchGroup, prefetchGroupMembers } = usePrefetch()
```

## ⚙️ Configuration Options

### Cache Options

```typescript
interface CacheOptions {
  useCache?: boolean    // Enable/disable cache (default: true)
  bustCache?: boolean   // Force refresh (default: false)
}
```

### Environment-Specific TTLs

```typescript
// Development
defaultTTL: 10 * 1000        // 10 seconds

// Staging
defaultTTL: 30 * 1000        // 30 seconds

// Production
defaultTTL: 5 * 60 * 1000    // 5 minutes

// Test
defaultTTL: 100              // 100ms
```

## 🔑 Cache Keys

```typescript
import { CacheKeys } from '@/services/cache'

CacheKeys.group(groupId)              // 'group:123'
CacheKeys.groupStatus(groupId)        // 'group:123:status'
CacheKeys.groupMembers(groupId)       // 'group:123:members'
CacheKeys.userGroups(userId)          // 'user:user1:groups'
CacheKeys.transactions(groupId)       // 'group:123:transactions'
```

## 🏷️ Cache Tags

```typescript
import { CacheTags } from '@/services/cache'

CacheTags.groups                      // 'groups'
CacheTags.group(groupId)              // 'group:123'
CacheTags.user(userId)                // 'user:user1'
CacheTags.transactions                // 'transactions'
```

## 🔄 Invalidation Strategies

### 1. Time-Based (TTL)
```typescript
// Automatic expiration after TTL
cache.set('key', data, { ttl: 30000 }) // 30 seconds
```

### 2. Tag-Based
```typescript
// Invalidate all entries with tag
cache.invalidateByTag('groups')
```

### 3. Pattern-Based
```typescript
// Invalidate by regex pattern
cache.invalidateByPattern(/^user:.*:groups$/)
```

### 4. Version-Based
```typescript
// Invalidate by version mismatch
cache.invalidateByVersion('v2')
```

## 📈 Monitoring

### View Cache Metrics

```typescript
const { data: metrics } = useCacheMetrics()

console.log(`Hit Rate: ${metrics.hitRatePercentage}%`)
console.log(`Cache Size: ${metrics.size}`)
console.log(`Hits: ${metrics.hits}`)
console.log(`Misses: ${metrics.misses}`)
```

### Export Cache State

```typescript
import { cacheService } from '@/services/cache'

const state = cacheService.exportState()
console.log(state)
```

### Health Check

```typescript
import { checkCacheHealth } from '@/config/cache-config'

const health = checkCacheHealth(metrics)
if (!health.healthy) {
  console.error('Cache issues:', health.issues)
}
```

## 🎯 Common Patterns

### Optimistic Updates

```typescript
const { mutate } = useContribute()

mutate(
  { groupId, amount },
  {
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries(['group', groupId])
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['group', groupId])
      
      // Optimistically update
      queryClient.setQueryData(['group', groupId], (old) => ({
        ...old,
        totalContributions: old.totalContributions + amount
      }))
      
      return { previous }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['group', groupId], context.previous)
    }
  }
)
```

### Prefetching on Hover

```typescript
const { prefetchGroup } = usePrefetch()

<GroupCard
  onMouseEnter={() => prefetchGroup(groupId)}
  onClick={() => navigate(`/groups/${groupId}`)}
/>
```

### Stale-While-Revalidate

```typescript
// Automatically enabled in production
// Returns stale data immediately while fetching fresh data in background
const { data } = useGroups(userId)
```

### Background Refetching

```typescript
// Automatically refetch on:
// - Window focus
// - Network reconnect
// - Interval (if configured)

useQuery({
  queryKey: ['groups'],
  queryFn: fetchGroups,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchInterval: 30000, // 30 seconds
})
```

## 🔒 Security Best Practices

### Input Validation

```typescript
// Keys are automatically sanitized
cache.set('user<script>alert(1)</script>', data)
// Stored as: 'user_script_alert_1___script_'

// Size limits enforced
cache.set('key', largeData) // Throws if > 1MB
```

### Sensitive Data

```typescript
// Automatically prevents caching sensitive data
import { shouldCache } from '@/config/cache-config'

const { allowed, reason } = shouldCache('api-key', data)
if (!allowed) {
  console.warn('Cannot cache:', reason)
}
```

## 🧪 Testing

### Mock Cache in Tests

```typescript
import { CacheService } from '@/services/cache'

const mockCache = new CacheService({
  defaultTTL: 100,
  maxSize: 10,
  staleWhileRevalidate: false,
  enableMetrics: true,
})
```

### Test Cache Behavior

```typescript
it('should cache API responses', async () => {
  const { result } = renderHook(() => useGroups('user1'))
  
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  
  // Second call should hit cache
  const { result: result2 } = renderHook(() => useGroups('user1'))
  expect(result2.current.data).toEqual(result.current.data)
})
```

## 🐛 Debugging

### Enable Debug Logging

```typescript
// In development, cache operations are logged
console.log('[Cache] Hit:', key)
console.log('[Cache] Miss:', key)
console.log('[Cache] Invalidate:', key)
```

### Inspect Cache State

```typescript
// In browser console
import { cacheService } from '@/services/cache'

// View all entries
cacheService.exportState()

// View metrics
cacheService.getMetrics()

// View revalidation queue
cacheService.getRevalidationQueue()
```

### Clear Cache

```typescript
// Clear all cache
cacheService.clear()

// Or use hook
const { bustAllCache } = useCacheInvalidation()
bustAllCache()
```

## 📚 Related Files

- `src/hooks/useContractData.ts` - React Query hooks
- `src/services/cache.ts` - Core cache service
- `src/services/soroban.ts` - API integration
- `src/config/cache-config.ts` - Configuration
- `src/tests/cache.test.ts` - Test examples

## 💡 Tips

1. **Use tags for bulk invalidation**: Tag related entries for easy invalidation
2. **Prefetch on hover**: Improve perceived performance
3. **Monitor hit rate**: Aim for > 70% hit rate
4. **Adjust TTLs**: Balance freshness vs performance
5. **Use optimistic updates**: Better UX for mutations
6. **Test cache behavior**: Ensure correct invalidation
7. **Watch cache size**: Prevent memory issues

## ⚠️ Common Pitfalls

1. **Over-caching**: Don't cache sensitive data
2. **Under-invalidating**: Stale data shown to users
3. **Over-invalidating**: Poor cache hit rate
4. **Large entries**: Keep entries < 1MB
5. **Too many entries**: Monitor cache size
6. **Ignoring errors**: Handle cache failures gracefully

## 🎉 Success Metrics

- Cache hit rate: > 70%
- Average response time (cached): < 100ms
- Cache size: < 90% of max
- Eviction rate: < 10/min
- User satisfaction: Faster perceived performance

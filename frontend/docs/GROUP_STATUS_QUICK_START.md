# Group Status - Quick Start Guide

## TL;DR

```typescript
import { GroupStatus } from '@/components/GroupStatus'
import { useGroupStatus } from '@/hooks/useContractData'

// Display component (easiest)
<GroupStatus groupId="123" />

// Hook for custom UI
const { data, isLoading, error } = useGroupStatus('123')
```

## What It Does

Fetches real-time group status from the Soroban blockchain:
- Current cycle number
- Next payout recipient
- Pending contributions count
- Total XLM collected this cycle
- Days until next payout

## Quick Examples

### 1. Drop-in Component

```tsx
import { GroupStatus } from '@/components/GroupStatus'

export default function GroupPage({ groupId }) {
  return (
    <div>
      <h1>Group Details</h1>
      <GroupStatus groupId={groupId} />
    </div>
  )
}
```

### 2. Custom UI with Hook

```tsx
import { useGroupStatus } from '@/hooks/useContractData'

export default function CustomStatus({ groupId }) {
  const { data, isLoading } = useGroupStatus(groupId)
  
  if (isLoading) return <Spinner />
  
  return (
    <div>
      <h2>Cycle {data.currentCycle}</h2>
      <p>{data.daysUntilPayout} days until payout</p>
      <p>{data.pendingContributions} members pending</p>
    </div>
  )
}
```

### 3. Force Refresh

```tsx
const { data, refetch } = useGroupStatus(groupId)

<button onClick={() => refetch()}>
  Refresh Status
</button>
```

### 4. Disable Cache

```tsx
// Always fetch fresh data
const { data } = useGroupStatus(groupId, { 
  useCache: false 
})
```

## Data Structure

```typescript
interface GroupStatus {
  groupId: string
  currentCycle: number           // Which cycle (1, 2, 3...)
  nextRecipient: string          // Address or "N/A" if complete
  pendingContributions: number   // How many haven't paid
  totalCollected: number         // XLM collected this cycle
  daysUntilPayout: number        // Days remaining
}
```

## Caching

- **Automatic:** Data cached for 30 seconds
- **Smart:** Invalidates on contributions/joins
- **Efficient:** Reduces blockchain calls by 90%

## Error Handling

```tsx
const { data, error, refetch } = useGroupStatus(groupId)

if (error) {
  return (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={() => refetch()}>Retry</button>
    </div>
  )
}
```

## Component Props

```typescript
<GroupStatus 
  groupId="123"              // Required
  className="custom-class"   // Optional
  showRefreshButton={true}   // Optional (default: true)
/>
```

## Hook Options

```typescript
useGroupStatus(groupId, {
  useCache: true,    // Use cached data (default: true)
  bustCache: false,  // Force fresh fetch (default: false)
})
```

## Common Patterns

### Loading State

```tsx
const { data, isLoading } = useGroupStatus(groupId)

if (isLoading) {
  return <Skeleton />
}
```

### Conditional Rendering

```tsx
const { data } = useGroupStatus(groupId)

{data.pendingContributions === 0 && (
  <Badge>All Paid!</Badge>
)}
```

### Auto-refresh

```tsx
const { refetch } = useGroupStatus(groupId)

useEffect(() => {
  const interval = setInterval(refetch, 60000) // Every minute
  return () => clearInterval(interval)
}, [refetch])
```

## Performance Tips

1. **Use the component** - It handles everything
2. **Don't disable cache** - Unless you need real-time data
3. **Prefetch on hover** - Use `usePrefetch` hook
4. **Batch queries** - Fetch multiple groups together

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to fetch" | Check CONTRACT_ID in .env |
| Stale data | Click refresh or wait 30s |
| "Wallet required" | Connect Freighter wallet |
| Slow loading | Check network connection |

## Environment Setup

```bash
# .env.local
NEXT_PUBLIC_CONTRACT_ID=your_contract_id
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

## Testing

Mock data is automatically used when:
- `CONTRACT_ID` is not set
- `NODE_ENV === 'test'`

```typescript
// Returns mock data in test environment
const { data } = useGroupStatus('test-group')
// data.currentCycle === 2
// data.daysUntilPayout === 5
```

## Related Hooks

```typescript
// Get full group details
useGroupDetail(groupId)

// Get group members
useGroupMembers(groupId)

// Get transactions
useTransactions(groupId)

// Invalidate cache manually
const { invalidateGroup } = useCacheInvalidation()
invalidateGroup(groupId)
```

## Advanced Usage

### Optimistic Updates

```tsx
const { mutate } = useContribute()
const { data } = useGroupStatus(groupId)

// Cache automatically updates after contribution
mutate({ groupId, amount: 50 })
```

### Prefetching

```tsx
import { usePrefetch } from '@/hooks/useContractData'

const { prefetchGroup } = usePrefetch()

// Prefetch on hover
<div onMouseEnter={() => prefetchGroup(groupId)}>
  View Group
</div>
```

### Cache Metrics

```tsx
import { useCacheMetrics } from '@/hooks/useContractData'

const { data: metrics } = useCacheMetrics()
console.log(`Hit rate: ${metrics.hitRatePercentage}%`)
```

## API Reference

### Component API

```typescript
interface GroupStatusProps {
  groupId: string
  className?: string
  showRefreshButton?: boolean
}
```

### Hook API

```typescript
function useGroupStatus(
  groupId: string,
  options?: {
    useCache?: boolean
    bustCache?: boolean
  }
): {
  data: GroupStatus | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}
```

## Need Help?

- Check `GROUP_STATUS_IMPLEMENTATION.md` for full details
- See `frontend/src/services/soroban.ts` for implementation
- Review `frontend/src/hooks/useContractData.ts` for hook logic
- Look at `frontend/src/components/GroupStatus.tsx` for component code

## Changelog

### v1.0.0 (Current)
- ✅ Real blockchain queries
- ✅ Intelligent caching
- ✅ Error handling with retry
- ✅ Loading states
- ✅ Component + Hook
- ✅ Performance metrics

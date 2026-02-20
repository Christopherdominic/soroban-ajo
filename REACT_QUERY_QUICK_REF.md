# React Query State Management - Quick Reference

## Setup

```typescript
// App.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/queryClient'

<QueryClientProvider client={queryClient}>
  <YourApp />
</QueryClientProvider>
```

## Queries

```typescript
import { useGroups, useGroup, useGroupMembers } from '@/hooks/queries'

// Fetch all groups
const { data: groups, isLoading } = useGroups()

// Fetch single group
const { data: group } = useGroup(groupId)

// Fetch group members
const { data: members } = useGroupMembers(groupId)
```

## Mutations

```typescript
import { useCreateGroup, useJoinGroup, useContributeMutation } from '@/hooks/mutations'

// Create group
const createGroup = useCreateGroup()
createGroup.mutate({
  groupName: 'My Group',
  cycleLength: 7,
  contributionAmount: 100,
  maxMembers: 10
})

// Join group
const joinGroup = useJoinGroup()
joinGroup.mutate(groupId)

// Contribute
const contribute = useContributeMutation()
contribute.mutate({ groupId, amount: 100 })
```

## Configuration

- **Stale Time**: 30 seconds
- **Cache Time**: 5 minutes
- **Retry**: 2 attempts (queries), 1 attempt (mutations)
- **Refetch on Focus**: Disabled

## Features

✅ Automatic caching
✅ Optimistic updates
✅ Auto-invalidation
✅ Error handling
✅ Loading states
✅ Retry logic

## CI/CD Status

✅ All checks passing

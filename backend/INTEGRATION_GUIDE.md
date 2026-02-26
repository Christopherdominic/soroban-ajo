# Integration Guide: Using Database Cache in Controllers

## Overview

This guide shows how to integrate the database caching layer with your existing controllers.

## Pattern: Cache-First with Blockchain Fallback

```typescript
// 1. Check cache first
// 2. If not found, fetch from blockchain
// 3. Cache the result
// 4. Return data
```

## Example: Update Groups Controller

### Before (No Cache)
```typescript
// Every request hits the blockchain
export async function getGroup(req: Request, res: Response) {
  const { groupId } = req.params;
  const group = await sorobanService.getGroupInfo(groupId); // Slow!
  res.json(group);
}
```

### After (With Cache)
```typescript
import { dbService } from '../services/databaseService';
import { sorobanService } from '../services/sorobanService';

export async function getGroup(req: Request, res: Response) {
  const { groupId } = req.params;
  
  // Try cache first
  let group = await dbService.getGroup(groupId);
  
  if (!group) {
    // Fetch from blockchain
    const blockchainData = await sorobanService.getGroupInfo(groupId);
    
    // Cache it
    await dbService.upsertGroup(groupId, {
      name: blockchainData.name,
      contributionAmount: BigInt(blockchainData.contribution_amount),
      frequency: blockchainData.frequency,
      maxMembers: blockchainData.max_members,
      currentRound: blockchainData.current_round,
      isActive: blockchainData.is_active,
    });
    
    // Get cached version with relations
    group = await dbService.getGroup(groupId);
  }
  
  res.json(group);
}
```

## Example: List All Groups (Fast)

### Before
```typescript
export async function getAllGroups(req: Request, res: Response) {
  // Fetches from blockchain - very slow!
  const groups = await sorobanService.getAllGroups();
  res.json(groups);
}
```

### After
```typescript
export async function getAllGroups(req: Request, res: Response) {
  // Instant from cache
  const groups = await dbService.getAllGroups();
  res.json(groups);
}
```

## Example: Record Contribution

### After Blockchain Transaction
```typescript
export async function makeContribution(req: Request, res: Response) {
  const { groupId, amount } = req.body;
  const walletAddress = req.user.walletAddress;
  
  // 1. Submit to blockchain
  const txResult = await sorobanService.contribute(groupId, amount);
  
  // 2. Cache the contribution
  await dbService.addContribution({
    groupId,
    walletAddress,
    amount: BigInt(amount),
    round: txResult.round,
    txHash: txResult.hash,
  });
  
  // 3. Update group cache
  const updatedGroup = await sorobanService.getGroupInfo(groupId);
  await dbService.upsertGroup(groupId, {
    name: updatedGroup.name,
    contributionAmount: BigInt(updatedGroup.contribution_amount),
    frequency: updatedGroup.frequency,
    maxMembers: updatedGroup.max_members,
    currentRound: updatedGroup.current_round,
    isActive: updatedGroup.is_active,
  });
  
  res.json({ success: true, txHash: txResult.hash });
}
```

## Example: Get Contributions with Cache

```typescript
export async function getContributions(req: Request, res: Response) {
  const { groupId } = req.params;
  const { round } = req.query;
  
  // Fast from cache
  const contributions = await dbService.getContributions(
    groupId,
    round ? parseInt(round as string) : undefined
  );
  
  res.json(contributions);
}
```

## Cache Invalidation Strategy

### Option 1: Time-Based (TTL)
```typescript
// Add updatedAt check
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const group = await dbService.getGroup(groupId);
const isStale = group && (Date.now() - group.updatedAt.getTime() > CACHE_TTL);

if (!group || isStale) {
  // Refresh from blockchain
}
```

### Option 2: Event-Based
```typescript
// Invalidate on write operations
async function onContribution(groupId: string) {
  // Refresh group data
  const fresh = await sorobanService.getGroupInfo(groupId);
  await dbService.upsertGroup(groupId, fresh);
}
```

### Option 3: Manual Refresh Endpoint
```typescript
export async function refreshGroup(req: Request, res: Response) {
  const { groupId } = req.params;
  
  const fresh = await sorobanService.getGroupInfo(groupId);
  await dbService.upsertGroup(groupId, fresh);
  
  res.json({ success: true });
}
```

## Background Sync Job (Optional)

```typescript
import cron from 'node-cron';

// Sync all groups every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('Syncing groups from blockchain...');
  
  const groups = await dbService.getAllGroups();
  
  for (const group of groups) {
    try {
      const fresh = await sorobanService.getGroupInfo(group.id);
      await dbService.upsertGroup(group.id, fresh);
    } catch (error) {
      console.error(`Failed to sync group ${group.id}:`, error);
    }
  }
  
  console.log('Sync complete');
});
```

## Helper Service (Recommended)

Create a unified service that handles caching logic:

```typescript
// src/services/groupCacheService.ts
import { dbService } from './databaseService';
import { sorobanService } from './sorobanService';

export class GroupCacheService {
  async getGroup(groupId: string, forceRefresh = false) {
    if (!forceRefresh) {
      const cached = await dbService.getGroup(groupId);
      if (cached) return cached;
    }
    
    const fresh = await sorobanService.getGroupInfo(groupId);
    await dbService.upsertGroup(groupId, {
      name: fresh.name,
      contributionAmount: BigInt(fresh.contribution_amount),
      frequency: fresh.frequency,
      maxMembers: fresh.max_members,
      currentRound: fresh.current_round,
      isActive: fresh.is_active,
    });
    
    return dbService.getGroup(groupId);
  }
  
  async getAllGroups() {
    return dbService.getAllGroups();
  }
  
  async refreshGroup(groupId: string) {
    return this.getGroup(groupId, true);
  }
}

export const groupCacheService = new GroupCacheService();
```

Then in controllers:
```typescript
import { groupCacheService } from '../services/groupCacheService';

export async function getGroup(req: Request, res: Response) {
  const { groupId } = req.params;
  const group = await groupCacheService.getGroup(groupId);
  res.json(group);
}
```

## Testing

Test with and without cache:
```typescript
// First request (cache miss)
console.time('First request');
await getGroup('group-1');
console.timeEnd('First request'); // ~1000ms

// Second request (cache hit)
console.time('Second request');
await getGroup('group-1');
console.timeEnd('Second request'); // ~10ms
```

## Monitoring

Add cache hit/miss metrics:
```typescript
let cacheHits = 0;
let cacheMisses = 0;

export async function getGroup(groupId: string) {
  const cached = await dbService.getGroup(groupId);
  
  if (cached) {
    cacheHits++;
    console.log(`Cache hit rate: ${(cacheHits / (cacheHits + cacheMisses) * 100).toFixed(2)}%`);
    return cached;
  }
  
  cacheMisses++;
  // Fetch from blockchain...
}
```

## Summary

1. **Read operations**: Check cache first, fallback to blockchain
2. **Write operations**: Write to blockchain, then update cache
3. **List operations**: Serve directly from cache
4. **Invalidation**: Time-based, event-based, or manual
5. **Monitoring**: Track cache hit rates

This pattern reduces blockchain calls by 80-95% in typical usage.

import { dbService } from './databaseService';
import { SorobanService } from './sorobanService';
import Redis from 'ioredis';

// initialize Redis client (will read from REDIS_URL or fallback to localhost)
export const redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

const sorobanService = new SorobanService();

/**
 * Example: Fetch group with caching
 * First checks database, falls back to blockchain if not found
 */
/**
 * Get a group, preferring cache layers.  This example now layers Redis on
 * top of the existing database cache so that reads are extremely fast.
 *
 * Order of operations:
 * 1. Check Redis cache
 * 2. If miss, check PostgreSQL via dbService
 * 3. If still miss, fetch from blockchain and populate both caches
 */
export async function getGroupWithCache(groupId: string) {
  const redisKey = `group:${groupId}`;

  // 1. Redis
  const cachedRedis = await redisClient.get(redisKey);
  if (cachedRedis) {
    return JSON.parse(cachedRedis);
  }

  // 2. Postgres cache
  const cachedDb = await dbService.getGroup(groupId);
  if (cachedDb) {
    // warm redis for subsequent requests
    await redisClient.set(redisKey, JSON.stringify(cachedDb), 'EX', 60 * 5);
    return cachedDb;
  }

  // 3. Blockchain fallback
  const blockchainData = await sorobanService.getGroup(groupId);
  if (!blockchainData) {
    throw new Error('Group not found on blockchain');
  }

  // Persist to db cache
  const freqString = blockchainData.frequency || 'monthly';
  let frequencyInt = 30; // default to 30 days
  if (freqString === 'daily') frequencyInt = 1;
  else if (freqString === 'weekly') frequencyInt = 7;

  const upserted = await dbService.upsertGroup(groupId, {
    name: blockchainData.name,
    contributionAmount: BigInt(blockchainData.contributionAmount),
    frequency: frequencyInt,
    maxMembers: blockchainData.maxMembers,
    isActive: blockchainData.isActive,
  });

  // Also cache in Redis
  await redisClient.set(redisKey, JSON.stringify(upserted), 'EX', 60 * 5);

  return upserted;
}

/**
 * Example: Cache contribution after blockchain transaction
 */
export async function recordContribution(
  groupId: string,
  walletAddress: string,
  amount: bigint,
  round: number,
  txHash: string
) {
  // Check if already cached
  const existing = await dbService.getContributionByTxHash(txHash);
  if (existing) {
    return existing;
  }

  // Cache the contribution
  return dbService.addContribution({
    groupId,
    walletAddress,
    amount,
    round,
    txHash,
  });
}

/**
 * Example: Get all groups (fast from cache)
 */
export async function getAllGroupsFast() {
  return dbService.getAllGroups();
}

// Generic Redis helpers exposed for middleware or other services
export async function cacheSet(key: string, value: string, ttlSeconds = 60) {
  return redisClient.set(key, value, 'EX', ttlSeconds);
}

export async function cacheGet(key: string): Promise<string | null> {
  return redisClient.get(key);
}

export async function cacheDel(key: string) {
  return redisClient.del(key);
}

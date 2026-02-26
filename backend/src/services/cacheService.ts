import { dbService } from './databaseService';
import { SorobanService } from './sorobanService';

const sorobanService = new SorobanService();

/**
 * Example: Fetch group with caching
 * First checks database, falls back to blockchain if not found
 */
export async function getGroupWithCache(groupId: string) {
  // Try cache first
  const cached = await dbService.getGroup(groupId);
  if (cached) {
    return cached;
  }

  // Fetch from blockchain
  const blockchainData = await sorobanService.getGroup(groupId);
  if (!blockchainData) {
    throw new Error('Group not found on blockchain');
  }

  // Cache it
  const freqString = blockchainData.frequency || 'monthly';
  let frequencyInt = 30; // default to 30 days
  if (freqString === 'daily') frequencyInt = 1;
  else if (freqString === 'weekly') frequencyInt = 7;

  await dbService.upsertGroup(groupId, {
    name: blockchainData.name,
    contributionAmount: BigInt(blockchainData.contributionAmount),
    frequency: frequencyInt,
    maxMembers: blockchainData.maxMembers,
    isActive: blockchainData.isActive,
  });

  return dbService.getGroup(groupId);
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

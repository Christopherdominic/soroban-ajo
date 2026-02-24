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

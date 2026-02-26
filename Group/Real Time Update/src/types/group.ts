export interface GroupData {
  id: string;
  name: string;
  description: string;
  totalMembers: number;
  currentMembers: number;
  contributionAmount: string;
  cycleLength: number;
  currentCycle: number;
  totalCycles: number;
  currentCycleStartTime: number;
  nextCycleTime: number;
  totalContributed: string;
  totalRequired: string;
  status: 'active' | 'completed' | 'pending';
  members: GroupMember[];
  creator: string;
  contractAddress: string;
}

export interface GroupMember {
  address: string;
  joinedAt: number;
  hasContributedThisCycle: boolean;
  totalContributions: string;
  isRecipientThisCycle: boolean;
  nickname?: string;
}

export interface Transaction {
  id: string;
  type: 'contribution' | 'payout' | 'join' | 'create';
  from: string;
  to?: string;
  amount?: string;
  timestamp: number;
  txHash: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface Activity {
  id: string;
  type: 'contribution' | 'payout' | 'member_joined' | 'cycle_completed';
  actor: string;
  timestamp: number;
  data: Record<string, any>;
}

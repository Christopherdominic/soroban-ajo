// Type definitions for Soroban Ajo

export interface Group {
  id: string
  name: string
  description?: string
  creator: string
  cycleLength: number
  contributionAmount: number
  maxMembers: number
  currentMembers: number
  totalContributions: number
  status: 'active' | 'completed' | 'paused'
  createdAt: string
  nextPayoutDate: string
}

export interface Member {
  address: string
  groupId: string
  joinedDate: string
  contributions: number
  status: 'active' | 'inactive' | 'completed'
}

export interface Transaction {
  id: string
  groupId: string
  member: string
  amount: number
  type: 'contribution' | 'payout' | 'refund'
  timestamp: string
  status: 'pending' | 'confirmed' | 'failed'
}

export interface GroupStatus {
  groupId: string
  currentCycle: number
  nextRecipient: string
  pendingContributions: number
  totalCollected: number
  daysUntilPayout: number
}

export interface WalletConnection {
  isConnected: boolean
  address?: string
  network: 'testnet' | 'mainnet'
  balance?: number
}

export interface GroupCreationData {
  groupName: string
  description: string
  cycleLength: number
  contributionAmount: number
  maxMembers: number
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  duration?: number
  invitedMembers?: string[]
}

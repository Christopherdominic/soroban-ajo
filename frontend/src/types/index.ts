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
  frequency?: 'weekly' | 'monthly'
  duration?: number
  invitedMembers?: string[]
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

export interface TransactionFilters {
  dateRange?: {
    start: string
    end: string
  }
  type?: 'contribution' | 'payout' | 'refund' | 'all'
  member?: string
  status?: 'pending' | 'confirmed' | 'failed' | 'all'
}

export type TransactionSortField = 'date' | 'amount' | 'member' | 'type'
export type SortDirection = 'asc' | 'desc'

export interface TransactionSort {
  field: TransactionSortField
  direction: SortDirection
}

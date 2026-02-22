export interface UserProfile {
  address: string
  displayName?: string
  email?: string
  avatar?: string
  bio?: string
  joinedAt: string
  preferences: UserPreferences
  stats: UserStats
}

export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    groupUpdates: boolean
    payoutReminders: boolean
    contributionReminders: boolean
  }
  privacy: {
    showProfile: boolean
    showActivity: boolean
    showStats: boolean
  }
  display: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    currency: string
  }
}

export interface UserStats {
  totalGroups: number
  activeGroups: number
  completedGroups: number
  totalContributions: number
  totalPayouts: number
  successRate: number
}

export interface ActivityItem {
  id: string
  type: 'contribution' | 'payout' | 'group_joined' | 'group_created'
  groupName: string
  amount?: number
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}

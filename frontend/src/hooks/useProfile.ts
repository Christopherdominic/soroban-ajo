import { useState, useEffect, useCallback } from 'react'
import { create } from 'zustand'
import { useAuth } from './useAuth'
import type { UserProfile, UserPreferences, ActivityItem } from '@/types/profile'

interface ProfileStore {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  setProfile: (profile: UserProfile) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  clearProfile: () => void
}

const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile, error: null }),
  updatePreferences: (preferences) =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            preferences: { ...state.profile.preferences, ...preferences },
          }
        : null,
    })),
  clearProfile: () => set({ profile: null, error: null }),
}))

export function useProfile() {
  const { address, isAuthenticated } = useAuth()
  const { profile, isLoading, error, setProfile, updatePreferences, clearProfile } = useProfileStore()
  const [activities, setActivities] = useState<ActivityItem[]>([])

  const fetchProfile = useCallback(async () => {
    if (!address || !isAuthenticated) {
      clearProfile()
      return
    }

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/profile/${address}`)
      // const data = await response.json()
      
      // Mock data for now
      const mockProfile: UserProfile = {
        address,
        displayName: `User ${address.slice(0, 6)}`,
        email: '',
        bio: '',
        joinedAt: new Date().toISOString(),
        preferences: {
          notifications: {
            email: true,
            push: true,
            groupUpdates: true,
            payoutReminders: true,
            contributionReminders: true,
          },
          privacy: {
            showProfile: true,
            showActivity: true,
            showStats: true,
          },
          display: {
            theme: 'auto',
            language: 'en',
            currency: 'USD',
          },
        },
        stats: {
          totalGroups: 5,
          activeGroups: 3,
          completedGroups: 2,
          totalContributions: 1500.50,
          totalPayouts: 1200.00,
          successRate: 95,
        },
      }

      setProfile(mockProfile)
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    }
  }, [address, isAuthenticated, setProfile, clearProfile])

  const fetchActivities = useCallback(async () => {
    if (!address || !isAuthenticated) {
      setActivities([])
      return
    }

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/profile/${address}/activities`)
      // const data = await response.json()
      
      // Mock data for demo
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'contribution',
          groupName: 'Family Savings Group',
          amount: 100,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
        },
        {
          id: '2',
          type: 'payout',
          groupName: 'Community Fund',
          amount: 500,
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          status: 'completed',
        },
        {
          id: '3',
          type: 'group_joined',
          groupName: 'Tech Savers',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          status: 'completed',
        },
      ]
      
      setActivities(mockActivities)
    } catch (err) {
      console.error('Failed to fetch activities:', err)
    }
  }, [address, isAuthenticated])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/profile/${address}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify(updates),
      // })

      setProfile({ ...profile, ...updates })
    } catch (err) {
      console.error('Failed to update profile:', err)
      throw err
    }
  }

  const savePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!profile) return

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/profile/${address}/preferences`, {
      //   method: 'PATCH',
      //   body: JSON.stringify(preferences),
      // })

      updatePreferences(preferences)
    } catch (err) {
      console.error('Failed to save preferences:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchProfile()
    fetchActivities()
  }, [fetchProfile, fetchActivities])

  return {
    profile,
    activities,
    isLoading,
    error,
    updateProfile,
    savePreferences,
    refreshProfile: fetchProfile,
    refreshActivities: fetchActivities,
  }
}

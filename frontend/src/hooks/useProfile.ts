import { useState, useEffect, useCallback } from 'react'

export interface UserProfile {
  address: string
  displayName?: string
  bio?: string
  avatar?: string
  email?: string
  joinedDate: string
  preferences: UserPreferences
  stats: UserStats
}

export interface UserPreferences {
  notifications: boolean
  emailUpdates: boolean
  theme: 'light' | 'dark' | 'auto'
  language: string
  currency: string
}

export interface UserStats {
  totalGroups: number
  activeGroups: number
  completedGroups: number
  totalContributions: number
  totalReceived: number
}

export interface Activity {
  id: string
  type: 'contribution' | 'payout' | 'group_created' | 'group_joined'
  groupId: string
  groupName?: string
  amount?: number
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}

const STORAGE_PREFIX = 'soroban_ajo_profile_'
const ACTIVITIES_PREFIX = 'soroban_ajo_activities_'

// Simulated IPFS upload (in production, use actual IPFS service)
const uploadToIPFS = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      // In production, upload to IPFS and return CID
      // For now, store base64 in localStorage
      resolve(base64)
    }
    reader.readAsDataURL(file)
  })
}

// Storage service for profile data
class ProfileStorageService {
  private getStorageKey(address: string): string {
    return `${STORAGE_PREFIX}${address.toLowerCase()}`
  }

  private getActivitiesKey(address: string): string {
    return `${ACTIVITIES_PREFIX}${address.toLowerCase()}`
  }

  getProfile(address: string): UserProfile | null {
    try {
      const data = localStorage.getItem(this.getStorageKey(address))
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error loading profile:', error)
      return null
    }
  }

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(
        this.getStorageKey(profile.address),
        JSON.stringify(profile)
      )
    } catch (error) {
      console.error('Error saving profile:', error)
      throw new Error('Failed to save profile')
    }
  }

  getActivities(address: string): Activity[] {
    try {
      const data = localStorage.getItem(this.getActivitiesKey(address))
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading activities:', error)
      return []
    }
  }

  saveActivities(address: string, activities: Activity[]): void {
    try {
      localStorage.setItem(
        this.getActivitiesKey(address),
        JSON.stringify(activities)
      )
    } catch (error) {
      console.error('Error saving activities:', error)
      throw new Error('Failed to save activities')
    }
  }

  addActivity(address: string, activity: Activity): void {
    const activities = this.getActivities(address)
    activities.unshift(activity) // Add to beginning
    // Keep only last 100 activities
    if (activities.length > 100) {
      activities.splice(100)
    }
    this.saveActivities(address, activities)
  }
}

const storageService = new ProfileStorageService()

export const useProfile = (address?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load profile data
  const loadProfile = useCallback(async (userAddress: string) => {
    setLoading(true)
    setError(null)

    try {
      // Check localStorage first
      let userProfile = storageService.getProfile(userAddress)

      if (!userProfile) {
        // Create default profile for new users
        userProfile = {
          address: userAddress,
          joinedDate: new Date().toISOString(),
          preferences: {
            notifications: true,
            emailUpdates: false,
            theme: 'auto',
            language: 'en',
            currency: 'USD',
          },
          stats: {
            totalGroups: 0,
            activeGroups: 0,
            completedGroups: 0,
            totalContributions: 0,
            totalReceived: 0,
          },
        }
        storageService.saveProfile(userProfile)
      }

      setProfile(userProfile)

      // Load activities
      const userActivities = storageService.getActivities(userAddress)
      setActivities(userActivities)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [])

  // Update profile
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<void> => {
      if (!profile) {
        throw new Error('No profile loaded')
      }

      setLoading(true)
      setError(null)

      try {
        const updatedProfile = {
          ...profile,
          ...updates,
          address: profile.address, // Prevent address change
        }

        storageService.saveProfile(updatedProfile)
        setProfile(updatedProfile)

        // Track profile update activity
        storageService.addActivity(profile.address, {
          id: `activity_${Date.now()}`,
          type: 'group_created', // Using as generic update type
          groupId: 'profile',
          timestamp: new Date().toISOString(),
          status: 'completed',
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update profile')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [profile]
  )

  // Update preferences
  const updatePreferences = useCallback(
    async (preferences: Partial<UserPreferences>): Promise<void> => {
      if (!profile) {
        throw new Error('No profile loaded')
      }

      setLoading(true)
      setError(null)

      try {
        const updatedProfile = {
          ...profile,
          preferences: {
            ...profile.preferences,
            ...preferences,
          },
        }

        storageService.saveProfile(updatedProfile)
        setProfile(updatedProfile)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update preferences')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [profile]
  )

  // Upload profile image
  const uploadProfileImage = useCallback(
    async (file: File): Promise<string> => {
      if (!profile) {
        throw new Error('No profile loaded')
      }

      setLoading(true)
      setError(null)

      try {
        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error('File must be an image')
        }

        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          throw new Error('Image must be less than 5MB')
        }

        // Upload to IPFS (simulated)
        const imageUrl = await uploadToIPFS(file)

        // Update profile with new avatar
        await updateProfile({ avatar: imageUrl })

        return imageUrl
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload image')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [profile, updateProfile]
  )

  // Add activity
  const addActivity = useCallback(
    (activity: Omit<Activity, 'id' | 'timestamp'>): void => {
      if (!profile) return

      const newActivity: Activity = {
        ...activity,
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      }

      storageService.addActivity(profile.address, newActivity)
      setActivities((prev) => [newActivity, ...prev].slice(0, 100))
    },
    [profile]
  )

  // Update stats
  const updateStats = useCallback(
    (stats: Partial<UserStats>): void => {
      if (!profile) return

      const updatedProfile = {
        ...profile,
        stats: {
          ...profile.stats,
          ...stats,
        },
      }

      storageService.saveProfile(updatedProfile)
      setProfile(updatedProfile)
    },
    [profile]
  )

  // Load profile on mount or address change
  useEffect(() => {
    if (address) {
      loadProfile(address)
    }
  }, [address, loadProfile])

  return {
    profile,
    activities,
    loading,
    error,
    updateProfile,
    updatePreferences,
    uploadProfileImage,
    addActivity,
    updateStats,
    refreshProfile: () => address && loadProfile(address),
    isLoading,
    error,
    updateProfile,
    savePreferences,
    refreshProfile: fetchProfile,
    refreshActivities: fetchActivities,
  }
}

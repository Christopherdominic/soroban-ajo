/**
 * Profile Service
 * 
 * Handles profile data operations with localStorage as the persistence layer.
 * In a production environment with a backend, this would make HTTP requests.
 * For this blockchain-based app, we use decentralized storage.
 */

import { UserProfile, UserPreferences, Activity } from '../hooks/useProfile'

const STORAGE_PREFIX = 'soroban_ajo_profile_'
const ACTIVITIES_PREFIX = 'soroban_ajo_activities_'
const PREFERENCES_PREFIX = 'soroban_ajo_preferences_'

export class ProfileService {
  /**
   * Get profile by address
   * Equivalent to: GET /api/profile/:address
   */
  static async getProfile(address: string): Promise<UserProfile | null> {
    try {
      const key = `${STORAGE_PREFIX}${address.toLowerCase()}`
      const data = localStorage.getItem(key)
      
      if (!data) {
        return null
      }

      return JSON.parse(data) as UserProfile
    } catch (error) {
      console.error('ProfileService.getProfile error:', error)
      throw new Error('Failed to fetch profile')
    }
  }

  /**
   * Update profile
   * Equivalent to: PATCH /api/profile/:address
   */
  static async updateProfile(
    address: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      const existing = await this.getProfile(address)
      
      if (!existing) {
        throw new Error('Profile not found')
      }

      const updated: UserProfile = {
        ...existing,
        ...updates,
        address: existing.address, // Prevent address modification
      }

      const key = `${STORAGE_PREFIX}${address.toLowerCase()}`
      localStorage.setItem(key, JSON.stringify(updated))

      return updated
    } catch (error) {
      console.error('ProfileService.updateProfile error:', error)
      throw new Error('Failed to update profile')
    }
  }

  /**
   * Create new profile
   * Equivalent to: POST /api/profile
   */
  static async createProfile(address: string): Promise<UserProfile> {
    try {
      const existing = await this.getProfile(address)
      
      if (existing) {
        return existing
      }

      const newProfile: UserProfile = {
        address,
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

      const key = `${STORAGE_PREFIX}${address.toLowerCase()}`
      localStorage.setItem(key, JSON.stringify(newProfile))

      return newProfile
    } catch (error) {
      console.error('ProfileService.createProfile error:', error)
      throw new Error('Failed to create profile')
    }
  }

  /**
   * Get user activities
   * Equivalent to: GET /api/profile/:address/activities
   */
  static async getActivities(
    address: string,
    limit: number = 50
  ): Promise<Activity[]> {
    try {
      const key = `${ACTIVITIES_PREFIX}${address.toLowerCase()}`
      const data = localStorage.getItem(key)
      
      if (!data) {
        return []
      }

      const activities = JSON.parse(data) as Activity[]
      return activities.slice(0, limit)
    } catch (error) {
      console.error('ProfileService.getActivities error:', error)
      throw new Error('Failed to fetch activities')
    }
  }

  /**
   * Add activity
   * Equivalent to: POST /api/profile/:address/activities
   */
  static async addActivity(
    address: string,
    activity: Omit<Activity, 'id' | 'timestamp'>
  ): Promise<Activity> {
    try {
      const newActivity: Activity = {
        ...activity,
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      }

      const key = `${ACTIVITIES_PREFIX}${address.toLowerCase()}`
      const existing = await this.getActivities(address, 1000)
      
      const updated = [newActivity, ...existing].slice(0, 100) // Keep last 100
      localStorage.setItem(key, JSON.stringify(updated))

      return newActivity
    } catch (error) {
      console.error('ProfileService.addActivity error:', error)
      throw new Error('Failed to add activity')
    }
  }

  /**
   * Update preferences
   * Equivalent to: PATCH /api/profile/:address/preferences
   */
  static async updatePreferences(
    address: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    try {
      const profile = await this.getProfile(address)
      
      if (!profile) {
        throw new Error('Profile not found')
      }

      const updated: UserPreferences = {
        ...profile.preferences,
        ...preferences,
      }

      await this.updateProfile(address, { preferences: updated })

      return updated
    } catch (error) {
      console.error('ProfileService.updatePreferences error:', error)
      throw new Error('Failed to update preferences')
    }
  }

  /**
   * Upload profile image to IPFS
   * In production, this would upload to IPFS or S3
   */
  static async uploadProfileImage(file: File): Promise<string> {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('Image must be less than 5MB')
      }

      // Simulate IPFS upload
      // In production: upload to IPFS and return CID
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onloadend = () => {
          const base64 = reader.result as string
          // In production, this would be an IPFS CID like:
          // 'ipfs://QmXxxx...'
          resolve(base64)
        }
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'))
        }
        
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('ProfileService.uploadProfileImage error:', error)
      throw new Error('Failed to upload image')
    }
  }

  /**
   * Delete profile (for testing/cleanup)
   */
  static async deleteProfile(address: string): Promise<void> {
    try {
      const profileKey = `${STORAGE_PREFIX}${address.toLowerCase()}`
      const activitiesKey = `${ACTIVITIES_PREFIX}${address.toLowerCase()}`
      const preferencesKey = `${PREFERENCES_PREFIX}${address.toLowerCase()}`
      
      localStorage.removeItem(profileKey)
      localStorage.removeItem(activitiesKey)
      localStorage.removeItem(preferencesKey)
    } catch (error) {
      console.error('ProfileService.deleteProfile error:', error)
      throw new Error('Failed to delete profile')
    }
  }

  /**
   * Check if profile exists
   */
  static async profileExists(address: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(address)
      return profile !== null
    } catch (error) {
      return false
    }
  }

  /**
   * Get or create profile
   * Ensures a profile always exists for the given address
   */
  static async getOrCreateProfile(address: string): Promise<UserProfile> {
    try {
      const existing = await this.getProfile(address)
      
      if (existing) {
        return existing
      }

      return await this.createProfile(address)
    } catch (error) {
      console.error('ProfileService.getOrCreateProfile error:', error)
      throw new Error('Failed to get or create profile')
    }
  }
}

export default ProfileService

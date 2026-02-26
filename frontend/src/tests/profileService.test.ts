/**
 * Profile Service Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ProfileService } from '../services/profileService'
import { UserProfile, Activity } from '../hooks/useProfile'

describe('ProfileService', () => {
  const testAddress = 'GABC123TEST456ADDRESS789'
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    // Cleanup after each test
    localStorage.clear()
  })

  describe('Profile Management', () => {
    it('should create a new profile', async () => {
      const profile = await ProfileService.createProfile(testAddress)

      expect(profile).toBeDefined()
      expect(profile.address).toBe(testAddress)
      expect(profile.joinedDate).toBeDefined()
      expect(profile.preferences).toBeDefined()
      expect(profile.stats).toBeDefined()
    })

    it('should return existing profile if already created', async () => {
      const profile1 = await ProfileService.createProfile(testAddress)
      const profile2 = await ProfileService.createProfile(testAddress)

      expect(profile1.address).toBe(profile2.address)
      expect(profile1.joinedDate).toBe(profile2.joinedDate)
    })

    it('should get profile by address', async () => {
      await ProfileService.createProfile(testAddress)
      const profile = await ProfileService.getProfile(testAddress)

      expect(profile).toBeDefined()
      expect(profile?.address).toBe(testAddress)
    })

    it('should return null for non-existent profile', async () => {
      const profile = await ProfileService.getProfile('NONEXISTENT')

      expect(profile).toBeNull()
    })

    it('should update profile', async () => {
      await ProfileService.createProfile(testAddress)
      
      const updated = await ProfileService.updateProfile(testAddress, {
        displayName: 'Test User',
        bio: 'Test bio',
      })

      expect(updated.displayName).toBe('Test User')
      expect(updated.bio).toBe('Test bio')
      expect(updated.address).toBe(testAddress)
    })

    it('should not allow address modification', async () => {
      await ProfileService.createProfile(testAddress)
      
      const updated = await ProfileService.updateProfile(testAddress, {
        address: 'DIFFERENT_ADDRESS' as any,
      })

      expect(updated.address).toBe(testAddress)
    })

    it('should check if profile exists', async () => {
      expect(await ProfileService.profileExists(testAddress)).toBe(false)
      
      await ProfileService.createProfile(testAddress)
      
      expect(await ProfileService.profileExists(testAddress)).toBe(true)
    })

    it('should get or create profile', async () => {
      const profile1 = await ProfileService.getOrCreateProfile(testAddress)
      expect(profile1).toBeDefined()

      const profile2 = await ProfileService.getOrCreateProfile(testAddress)
      expect(profile1.joinedDate).toBe(profile2.joinedDate)
    })

    it('should delete profile', async () => {
      await ProfileService.createProfile(testAddress)
      expect(await ProfileService.profileExists(testAddress)).toBe(true)

      await ProfileService.deleteProfile(testAddress)
      expect(await ProfileService.profileExists(testAddress)).toBe(false)
    })
  })

  describe('Activities', () => {
    it('should return empty array for new profile', async () => {
      const activities = await ProfileService.getActivities(testAddress)
      expect(activities).toEqual([])
    })

    it('should add activity', async () => {
      const activity = await ProfileService.addActivity(testAddress, {
        type: 'contribution',
        groupId: 'group1',
        groupName: 'Test Group',
        amount: 100,
        status: 'completed',
      })

      expect(activity.id).toBeDefined()
      expect(activity.timestamp).toBeDefined()
      expect(activity.type).toBe('contribution')
    })

    it('should retrieve activities', async () => {
      await ProfileService.addActivity(testAddress, {
        type: 'contribution',
        groupId: 'group1',
        amount: 100,
        status: 'completed',
      })

      await ProfileService.addActivity(testAddress, {
        type: 'payout',
        groupId: 'group1',
        amount: 300,
        status: 'completed',
      })

      const activities = await ProfileService.getActivities(testAddress)
      expect(activities).toHaveLength(2)
      expect(activities[0].type).toBe('payout') // Most recent first
    })

    it('should limit activities to specified count', async () => {
      // Add 10 activities
      for (let i = 0; i < 10; i++) {
        await ProfileService.addActivity(testAddress, {
          type: 'contribution',
          groupId: `group${i}`,
          amount: 100,
          status: 'completed',
        })
      }

      const activities = await ProfileService.getActivities(testAddress, 5)
      expect(activities).toHaveLength(5)
    })

    it('should keep only last 100 activities', async () => {
      // Add 150 activities
      for (let i = 0; i < 150; i++) {
        await ProfileService.addActivity(testAddress, {
          type: 'contribution',
          groupId: `group${i}`,
          amount: 100,
          status: 'completed',
        })
      }

      const activities = await ProfileService.getActivities(testAddress, 200)
      expect(activities.length).toBeLessThanOrEqual(100)
    })
  })

  describe('Preferences', () => {
    it('should update preferences', async () => {
      await ProfileService.createProfile(testAddress)

      const updated = await ProfileService.updatePreferences(testAddress, {
        notifications: false,
        theme: 'dark',
      })

      expect(updated.notifications).toBe(false)
      expect(updated.theme).toBe('dark')
      expect(updated.emailUpdates).toBe(false) // Default preserved
    })

    it('should throw error for non-existent profile', async () => {
      await expect(
        ProfileService.updatePreferences('NONEXISTENT', { notifications: false })
      ).rejects.toThrow('Profile not found')
    })
  })

  describe('Profile Image Upload', () => {
    it('should validate image file type', async () => {
      const textFile = new File(['test'], 'test.txt', { type: 'text/plain' })

      await expect(
        ProfileService.uploadProfileImage(textFile)
      ).rejects.toThrow('File must be an image')
    })

    it('should validate image file size', async () => {
      // Create a file larger than 5MB
      const largeData = new Array(6 * 1024 * 1024).fill('a').join('')
      const largeFile = new File([largeData], 'large.jpg', { type: 'image/jpeg' })

      await expect(
        ProfileService.uploadProfileImage(largeFile)
      ).rejects.toThrow('Image must be less than 5MB')
    })

    it('should upload valid image', async () => {
      const imageFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' })

      const url = await ProfileService.uploadProfileImage(imageFile)
      expect(url).toBeDefined()
      expect(typeof url).toBe('string')
    })
  })

  describe('Error Handling', () => {
    it('should handle update on non-existent profile', async () => {
      await expect(
        ProfileService.updateProfile('NONEXISTENT', { displayName: 'Test' })
      ).rejects.toThrow('Profile not found')
    })

    it('should handle localStorage errors gracefully', async () => {
      // Mock localStorage to throw error
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = () => {
        throw new Error('Storage full')
      }

      await expect(
        ProfileService.createProfile(testAddress)
      ).rejects.toThrow()

      // Restore
      Storage.prototype.setItem = originalSetItem
    })
  })
})

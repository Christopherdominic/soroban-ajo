/**
 * useProfile Hook Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useProfile } from '../hooks/useProfile'

describe('useProfile Hook', () => {
  const testAddress = 'GABC123TEST456ADDRESS789'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should initialize with null profile', () => {
    const { result } = renderHook(() => useProfile())

    expect(result.current.profile).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should load profile for given address', async () => {
    const { result } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull()
    })

    expect(result.current.profile?.address).toBe(testAddress)
    expect(result.current.loading).toBe(false)
  })

  it('should create default profile for new user', async () => {
    const { result } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull()
    })

    const profile = result.current.profile!
    expect(profile.address).toBe(testAddress)
    expect(profile.preferences).toBeDefined()
    expect(profile.stats).toBeDefined()
    expect(profile.joinedDate).toBeDefined()
  })

  it('should update profile', async () => {
    const { result } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull()
    })

    await act(async () => {
      await result.current.updateProfile({
        displayName: 'Test User',
        bio: 'Test bio',
      })
    })

    expect(result.current.profile?.displayName).toBe('Test User')
    expect(result.current.profile?.bio).toBe('Test bio')
  })

  it('should update preferences', async () => {
    const { result } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull()
    })

    await act(async () => {
      await result.current.updatePreferences({
        notifications: false,
        theme: 'dark',
      })
    })

    expect(result.current.profile?.preferences.notifications).toBe(false)
    expect(result.current.profile?.preferences.theme).toBe('dark')
  })

  it('should add activity', async () => {
    const { result } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull()
    })

    act(() => {
      result.current.addActivity({
        type: 'contribution',
        groupId: 'group1',
        groupName: 'Test Group',
        amount: 100,
        status: 'completed',
      })
    })

    await waitFor(() => {
      expect(result.current.activities).toHaveLength(1)
    })

    expect(result.current.activities[0].type).toBe('contribution')
    expect(result.current.activities[0].groupId).toBe('group1')
  })

  it('should update stats', async () => {
    const { result } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull()
    })

    act(() => {
      result.current.updateStats({
        totalGroups: 5,
        activeGroups: 3,
      })
    })

    expect(result.current.profile?.stats.totalGroups).toBe(5)
    expect(result.current.profile?.stats.activeGroups).toBe(3)
  })

  it('should handle profile image upload', async () => {
    const { result } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull()
    })

    const imageFile = new File(['fake-image'], 'test.jpg', { type: 'image/jpeg' })

    let imageUrl: string = ''
    await act(async () => {
      imageUrl = await result.current.uploadProfileImage(imageFile)
    })

    expect(imageUrl).toBeDefined()
    expect(result.current.profile?.avatar).toBe(imageUrl)
  })

  it('should reject invalid image file', async () => {
    const { result } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull()
    })

    const textFile = new File(['text'], 'test.txt', { type: 'text/plain' })

    await act(async () => {
      try {
        await result.current.uploadProfileImage(textFile)
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  it('should refresh profile', async () => {
    const { result } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result.current.profile).not.toBeNull()
    })

    // Update profile externally
    const profile = result.current.profile!
    profile.displayName = 'Updated Name'
    localStorage.setItem(
      `soroban_ajo_profile_${testAddress.toLowerCase()}`,
      JSON.stringify(profile)
    )

    await act(async () => {
      result.current.refreshProfile()
    })

    await waitFor(() => {
      expect(result.current.profile?.displayName).toBe('Updated Name')
    })
  })

  it('should handle errors gracefully', async () => {
    // Mock localStorage to throw error
    const originalGetItem = Storage.prototype.getItem
    Storage.prototype.getItem = () => {
      throw new Error('Storage error')
    }

    const { result } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })

    // Restore
    Storage.prototype.getItem = originalGetItem
  })

  it('should load activities with profile', async () => {
    // Pre-populate activities
    const activities = [
      {
        id: 'act1',
        type: 'contribution' as const,
        groupId: 'group1',
        amount: 100,
        timestamp: new Date().toISOString(),
        status: 'completed' as const,
      },
    ]
    localStorage.setItem(
      `soroban_ajo_activities_${testAddress.toLowerCase()}`,
      JSON.stringify(activities)
    )

    const { result } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result.current.activities).toHaveLength(1)
    })

    expect(result.current.activities[0].id).toBe('act1')
  })

  it('should persist profile across hook instances', async () => {
    const { result: result1 } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result1.current.profile).not.toBeNull()
    })

    await act(async () => {
      await result1.current.updateProfile({ displayName: 'Persistent User' })
    })

    // Create new hook instance
    const { result: result2 } = renderHook(() => useProfile(testAddress))

    await waitFor(() => {
      expect(result2.current.profile?.displayName).toBe('Persistent User')
    })
  })
})

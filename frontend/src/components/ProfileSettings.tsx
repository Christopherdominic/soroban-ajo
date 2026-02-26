/**
 * Profile Settings Component
 * Example implementation showing how to use the profile management system
 */

import React, { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useAuthSession } from '../utils/auth'

export const ProfileSettings: React.FC = () => {
  const { address, isAuthenticated } = useAuthSession()
  const {
    profile,
    loading,
    error,
    updateProfile,
    updatePreferences,
    uploadProfileImage,
  } = useProfile(address || undefined)

  const [displayName, setDisplayName] = useState(profile?.displayName || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [uploading, setUploading] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please connect your wallet to manage your profile.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
      </div>
    )
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        displayName: displayName || undefined,
        bio: bio || undefined,
      })
      alert('Profile updated successfully!')
    } catch (err) {
      alert('Failed to update profile')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await uploadProfileImage(file)
      alert('Profile image updated!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleToggleNotifications = async () => {
    try {
      await updatePreferences({
        notifications: !profile?.preferences.notifications,
      })
    } catch (err) {
      alert('Failed to update preferences')
    }
  }

  const handleThemeChange = async (theme: 'light' | 'dark' | 'auto') => {
    try {
      await updatePreferences({ theme })
    } catch (err) {
      alert('Failed to update theme')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
        
        {/* Avatar */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                {profile?.displayName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block">
              {uploading ? 'Uploading...' : 'Change Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG or PNG</p>
          </div>
        </div>

        {/* Display Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Wallet Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Address
          </label>
          <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-600">
            {profile?.address}
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Save Profile
        </button>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Preferences</h3>

        {/* Notifications */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div>
            <p className="font-medium">Notifications</p>
            <p className="text-sm text-gray-600">Receive notifications for group activities</p>
          </div>
          <button
            onClick={handleToggleNotifications}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              profile?.preferences.notifications ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                profile?.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Theme */}
        <div className="mb-4">
          <p className="font-medium mb-2">Theme</p>
          <div className="flex space-x-2">
            {(['light', 'dark', 'auto'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`px-4 py-2 rounded-lg capitalize transition ${
                  profile?.preferences.theme === theme
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={profile?.preferences.language}
            onChange={(e) => updatePreferences({ language: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="yo">Yorùbá</option>
            <option value="ig">Igbo</option>
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={profile?.preferences.currency}
            onChange={(e) => updatePreferences({ currency: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="NGN">NGN (₦)</option>
            <option value="XLM">XLM (Lumens)</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Your Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Groups</p>
            <p className="text-2xl font-bold text-blue-600">{profile?.stats.totalGroups || 0}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Active Groups</p>
            <p className="text-2xl font-bold text-green-600">{profile?.stats.activeGroups || 0}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Contributions</p>
            <p className="text-2xl font-bold text-purple-600">{profile?.stats.totalContributions || 0}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-orange-600">{profile?.stats.completedGroups || 0}</p>
          </div>
        </div>
      </div>

      {/* Member Since */}
      <div className="text-center text-sm text-gray-600">
        Member since {new Date(profile?.joinedDate || '').toLocaleDateString()}
      </div>
    </div>
  )
}

export default ProfileSettings

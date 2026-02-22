import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { UserProfile } from '@/types/profile'

interface ProfileFormProps {
  profile: UserProfile
  onSave: (updates: Partial<UserProfile>) => Promise<void>
  isLoading?: boolean
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    displayName: profile.displayName || '',
    email: profile.email || '',
    bio: profile.bio || '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await onSave(formData)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Profile update error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = 
    formData.displayName !== (profile.displayName || '') ||
    formData.email !== (profile.email || '') ||
    formData.bio !== (profile.bio || '')

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          <div className="skeleton h-6 w-32 rounded" />
          <div className="skeleton h-10 w-full rounded" />
          <div className="skeleton h-10 w-full rounded" />
          <div className="skeleton h-24 w-full rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display Name */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Enter your display name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            maxLength={50}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">Used for notifications and account recovery</p>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.bio.length}/200 characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={!hasChanges || isSaving}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFormData({
              displayName: profile.displayName || '',
              email: profile.email || '',
              bio: profile.bio || '',
            })}
            disabled={!hasChanges || isSaving}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

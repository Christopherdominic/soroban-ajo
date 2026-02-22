import React from 'react'
import type { UserProfile } from '@/types/profile'

interface ProfileCardProps {
  profile: UserProfile
  isLoading?: boolean
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-start gap-6">
          <div className="skeleton w-24 h-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-8 w-48 rounded" />
            <div className="skeleton h-4 w-64 rounded" />
            <div className="skeleton h-4 w-32 rounded" />
          </div>
        </div>
      </div>
    )
  }

  const getAvatarInitials = () => {
    if (profile.displayName) {
      return profile.displayName.slice(0, 2).toUpperCase()
    }
    return profile.address.slice(0, 2).toUpperCase()
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.displayName || 'User avatar'}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-blue-100">
              <span className="text-3xl font-bold text-white">{getAvatarInitials()}</span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {profile.displayName || 'Anonymous User'}
          </h2>
          <p className="text-gray-600 mb-2 font-mono text-sm">
            {formatAddress(profile.address)}
          </p>
          {profile.bio && (
            <p className="text-gray-700 mt-3">{profile.bio}</p>
          )}
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{profile.stats.totalGroups}</div>
          <div className="text-sm text-gray-600 mt-1">Total Groups</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">${profile.stats.totalContributions.toFixed(2)}</div>
          <div className="text-sm text-gray-600 mt-1">Contributed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{profile.stats.successRate}%</div>
          <div className="text-sm text-gray-600 mt-1">Success Rate</div>
        </div>
      </div>
    </div>
  )
}

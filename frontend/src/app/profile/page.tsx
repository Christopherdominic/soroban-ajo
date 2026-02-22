'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { ProfileCard } from '@/components/ProfileCard'
import { ProfileForm } from '@/components/ProfileForm'
import { SettingsPanel } from '@/components/SettingsPanel'
import type { ActivityItem } from '@/types/profile'

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, address, logout } = useAuth()
  const { profile, activities, isLoading, updateProfile, savePreferences } = useProfile()
  const [activeSection, setActiveSection] = useState<'overview' | 'edit' | 'settings' | 'activity'>('overview')

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'edit', label: 'Edit Profile', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'activity', label: 'Activity', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-600">Manage your account and preferences</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-lg p-4 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as typeof activeSection)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
                  </svg>
                  {section.label}
                </button>
              ))}
            </nav>

            {/* Wallet Info */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Connected Wallet</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-gray-600">Connected</span>
                </div>
                <div className="font-mono text-xs text-gray-800 bg-gray-50 p-2 rounded break-all">
                  {address}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeSection === 'overview' && (
              <>
                <ProfileCard profile={profile} isLoading={isLoading} />
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Active Groups"
                    value={profile.stats.activeGroups}
                    icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    color="blue"
                  />
                  <StatCard
                    title="Completed Groups"
                    value={profile.stats.completedGroups}
                    icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    color="green"
                  />
                  <StatCard
                    title="Total Payouts"
                    value={`$${profile.stats.totalPayouts.toFixed(2)}`}
                    icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    color="purple"
                  />
                </div>
              </>
            )}

            {activeSection === 'edit' && (
              <ProfileForm profile={profile} onSave={updateProfile} isLoading={isLoading} />
            )}

            {activeSection === 'settings' && (
              <SettingsPanel preferences={profile.preferences} onSave={savePreferences} isLoading={isLoading} />
            )}

            {activeSection === 'activity' && (
              <ActivityHistory activities={activities} isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
interface StatCardProps {
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'green' | 'purple'
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
    </div>
  )
}

interface ActivityHistoryProps {
  activities: ActivityItem[]
  isLoading: boolean
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activity Yet</h3>
        <p className="text-gray-600">Your activity history will appear here</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  )
}

interface ActivityItemProps {
  activity: ActivityItem
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const typeConfig = {
    contribution: { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'blue' },
    payout: { icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', color: 'green' },
    group_joined: { icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', color: 'purple' },
    group_created: { icon: 'M12 4v16m8-8H4', color: 'indigo' },
  }

  const config = typeConfig[activity.type]

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`w-10 h-10 rounded-full bg-${config.color}-100 flex items-center justify-center flex-shrink-0`}>
        <svg className={`w-5 h-5 text-${config.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.groupName}</p>
        {activity.amount && (
          <p className="text-sm text-gray-600">${activity.amount.toFixed(2)}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${
        activity.status === 'completed' ? 'bg-green-100 text-green-700' :
        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {activity.status}
      </span>
    </div>
  )
}

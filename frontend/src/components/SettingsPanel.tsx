import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { UserPreferences } from '@/types/profile'

interface SettingsPanelProps {
  preferences: UserPreferences
  onSave: (preferences: Partial<UserPreferences>) => Promise<void>
  isLoading?: boolean
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ preferences, onSave, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'display'>('notifications')
  const [localPreferences, setLocalPreferences] = useState(preferences)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (section: keyof UserPreferences, key: string) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key as keyof typeof prev[typeof section]],
      },
    }))
  }

  const handleSelect = (section: keyof UserPreferences, key: string, value: string) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(localPreferences)
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
      console.error('Settings save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(localPreferences)

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'privacy', label: 'Privacy', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'display', label: 'Display', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ]

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          <div className="skeleton h-10 w-full rounded" />
          <div className="skeleton h-64 w-full rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <ToggleItem
                  label="Email Notifications"
                  description="Receive updates via email"
                  checked={localPreferences.notifications.email}
                  onChange={() => handleToggle('notifications', 'email')}
                />
                <ToggleItem
                  label="Push Notifications"
                  description="Receive browser push notifications"
                  checked={localPreferences.notifications.push}
                  onChange={() => handleToggle('notifications', 'push')}
                />
                <ToggleItem
                  label="Group Updates"
                  description="Get notified about group activities"
                  checked={localPreferences.notifications.groupUpdates}
                  onChange={() => handleToggle('notifications', 'groupUpdates')}
                />
                <ToggleItem
                  label="Payout Reminders"
                  description="Reminders when payouts are available"
                  checked={localPreferences.notifications.payoutReminders}
                  onChange={() => handleToggle('notifications', 'payoutReminders')}
                />
                <ToggleItem
                  label="Contribution Reminders"
                  description="Reminders for upcoming contributions"
                  checked={localPreferences.notifications.contributionReminders}
                  onChange={() => handleToggle('notifications', 'contributionReminders')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <ToggleItem
                  label="Show Profile"
                  description="Make your profile visible to other users"
                  checked={localPreferences.privacy.showProfile}
                  onChange={() => handleToggle('privacy', 'showProfile')}
                />
                <ToggleItem
                  label="Show Activity"
                  description="Display your activity history"
                  checked={localPreferences.privacy.showActivity}
                  onChange={() => handleToggle('privacy', 'showActivity')}
                />
                <ToggleItem
                  label="Show Statistics"
                  description="Make your stats visible to others"
                  checked={localPreferences.privacy.showStats}
                  onChange={() => handleToggle('privacy', 'showStats')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Display Tab */}
        {activeTab === 'display' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
              <div className="space-y-6">
                <SelectItem
                  label="Theme"
                  description="Choose your preferred color scheme"
                  value={localPreferences.display.theme}
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'auto', label: 'Auto' },
                  ]}
                  onChange={(value) => handleSelect('display', 'theme', value)}
                />
                <SelectItem
                  label="Language"
                  description="Select your preferred language"
                  value={localPreferences.display.language}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Español' },
                    { value: 'fr', label: 'Français' },
                  ]}
                  onChange={(value) => handleSelect('display', 'language', value)}
                />
                <SelectItem
                  label="Currency"
                  description="Choose your display currency"
                  value={localPreferences.display.currency}
                  options={[
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'EUR', label: 'EUR (€)' },
                    { value: 'GBP', label: 'GBP (£)' },
                  ]}
                  onChange={(value) => handleSelect('display', 'currency', value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {hasChanges && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
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
                onClick={() => setLocalPreferences(preferences)}
                disabled={isSaving}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper Components
interface ToggleItemProps {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}

const ToggleItem: React.FC<ToggleItemProps> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-1">
      <div className="font-medium text-gray-900">{label}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
)

interface SelectItemProps {
  label: string
  description: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

const SelectItem: React.FC<SelectItemProps> = ({ label, description, value, options, onChange }) => (
  <div>
    <label className="block font-medium text-gray-900 mb-1">{label}</label>
    <p className="text-sm text-gray-600 mb-3">{description}</p>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

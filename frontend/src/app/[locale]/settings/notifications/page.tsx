'use client';

import React from 'react';
import { useNotificationGenerator } from '@/hooks/useNotificationGenerator';
import NotificationPreferences from '@/components/NotificationPreferences';
import { Bell } from 'lucide-react';

export default function NotificationSettingsPage() {
  const {
    generateContributionDueNotification,
    generateContributionOverdueNotification,
    generatePayoutReceivedNotification,
    generateMemberJoinedNotification,
    generateCycleCompletedNotification,
    generateAnnouncementNotification,
  } = useNotificationGenerator();

  const testNotifications = [
    {
      label: 'Contribution Due (24h)',
      action: () => generateContributionDueNotification('Family Savings Group', 24, 'group-1'),
    },
    {
      label: 'Contribution Due (1h)',
      action: () => generateContributionDueNotification('Emergency Fund', 1, 'group-2'),
    },
    {
      label: 'Contribution Overdue',
      action: () => generateContributionOverdueNotification('Business Startup', 'group-3'),
    },
    {
      label: 'Payout Received',
      action: () => generatePayoutReceivedNotification(500, 'Vacation Fund', 'group-4'),
    },
    {
      label: 'Member Joined',
      action: () => generateMemberJoinedNotification('Alice', 'Community Savings', 'group-5'),
    },
    {
      label: 'Cycle Completed',
      action: () => generateCycleCompletedNotification('Housing Fund', 'group-6'),
    },
    {
      label: 'Announcement',
      action: () => generateAnnouncementNotification(
        'New Feature Available',
        'Check out our new analytics dashboard!',
        'group-7'
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Notification Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage how you receive notifications about your savings groups
          </p>
        </div>

        <NotificationPreferences />

        {/* Test Notifications Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Test Notifications
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Click any button below to generate a test notification
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {testNotifications.map((test, index) => (
              <button
                key={index}
                onClick={test.action}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {test.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

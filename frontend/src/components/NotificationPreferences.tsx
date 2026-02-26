'use client';

import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { subscribeToPushNotifications, unsubscribeFromPushNotifications, requestNotificationPermission } from '@/services/pushNotifications';
import { Bell, Mail, Smartphone, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationPreferences() {
  const { preferences, updatePreferences, setPushSubscription } = useNotifications();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  const handlePushToggle = async () => {
    if (!pushEnabled) {
      const permission = await requestNotificationPermission();
      setPushPermission(permission);

      if (permission === 'granted') {
        const subscription = await subscribeToPushNotifications();
        if (subscription) {
          setPushSubscription(subscription);
          setPushEnabled(true);
          updatePreferences({ push: true });
          toast.success('Push notifications enabled');
        } else {
          toast.error('Failed to enable push notifications');
        }
      } else {
        toast.error('Notification permission denied');
      }
    } else {
      const success = await unsubscribeFromPushNotifications();
      if (success) {
        setPushSubscription(null);
        setPushEnabled(false);
        updatePreferences({ push: false });
        toast.success('Push notifications disabled');
      }
    }
  };

  const togglePreference = (key: keyof typeof preferences) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Notification Preferences
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Choose how you want to receive notifications about your savings groups
        </p>
      </div>

      {/* Notification Channels */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Notification Channels
          </h4>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    In-App Notifications
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show notifications in the app
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.inApp}
                onChange={() => togglePreference('inApp')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Push Notifications
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {pushPermission === 'denied'
                      ? 'Permission denied - enable in browser settings'
                      : 'Receive browser push notifications'}
                  </p>
                </div>
              </div>
              <button
                onClick={handlePushToggle}
                disabled={pushPermission === 'denied'}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  pushEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                } ${pushPermission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    pushEnabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.email}
                onChange={() => togglePreference('email')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Notification Types */}
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Notification Types
          </h4>

          <div className="space-y-2">
            {[
              { key: 'contributionDue24h', label: 'Contribution due in 24 hours', icon: '⏰' },
              { key: 'contributionDue1h', label: 'Contribution due in 1 hour', icon: '⚡' },
              { key: 'contributionOverdue', label: 'Contribution overdue', icon: '⚠️' },
              { key: 'payoutReceived', label: 'Payout received', icon: '💰' },
              { key: 'memberJoined', label: 'New member joined group', icon: '👥' },
              { key: 'cycleCompleted', label: 'Group cycle completed', icon: '✅' },
              { key: 'announcements', label: 'Group announcements', icon: '📢' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences[item.key as keyof typeof preferences] as boolean}
                  onChange={() => togglePreference(item.key as keyof typeof preferences)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900 dark:text-blue-300">
          Your notification preferences are saved automatically
        </p>
      </div>
    </div>
  );
}

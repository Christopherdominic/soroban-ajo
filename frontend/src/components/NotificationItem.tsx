'use client';

import React from 'react';
import { Notification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { X, Bell, DollarSign, Users, CheckCircle, Megaphone, AlertCircle } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const iconMap = {
  contribution_due: Bell,
  contribution_overdue: AlertCircle,
  payout_received: DollarSign,
  member_joined: Users,
  cycle_completed: CheckCircle,
  announcement: Megaphone,
};

const colorMap = {
  contribution_due: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  contribution_overdue: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  payout_received: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  member_joined: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  cycle_completed: 'bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400',
  announcement: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
};

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const Icon = iconMap[notification.type];

  return (
    <div
      className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
      }`}
    >
      <div className="flex gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorMap[notification.type]}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </p>
            </div>

            <button
              onClick={() => onDelete(notification.id)}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Delete notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark as read
              </button>
            )}
            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View details
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

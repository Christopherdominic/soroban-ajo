'use client'

import React from 'react'
import { useNotificationStore, NotificationItem } from '../store/notificationStore'
import { formatDistanceToNow } from 'date-fns'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell, Trash2 } from 'lucide-react'
import { clsx } from 'clsx'

export const NotificationHistory: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearHistory,
    removeNotification,
  } = useNotificationStore()
  const [isOpen, setIsOpen] = React.useState(false)

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
        aria-label="Toggle notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/5" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[500px]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <div className="flex gap-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                      title="Clear history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={clsx(
                        'p-4 flex gap-3 hover:bg-gray-50 transition-colors group relative cursor-pointer text-left',
                        !notification.read && 'bg-blue-50/30'
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={clsx(
                            'text-sm leading-snug',
                            notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'
                          )}
                        >
                          {notification.message}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
                <button
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

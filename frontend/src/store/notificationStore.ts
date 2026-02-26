import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationItem {
  id: string
  type: NotificationType
  message: string
  timestamp: number
  read: boolean
  metadata?: Record<string, any>
}

interface NotificationState {
  notifications: NotificationItem[]
  unreadCount: number
}

interface NotificationActions {
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearHistory: () => void
  removeNotification: (id: string) => void
}

type NotificationStore = NotificationState & NotificationActions

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const newItem: NotificationItem = {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          read: false,
        }

        set((state) => ({
          notifications: [newItem, ...state.notifications].slice(0, 50), // Keep last 50
          unreadCount: state.unreadCount + 1,
        }))
      },

      markAsRead: (id) => {
        set((state) => {
          const item = state.notifications.find((n) => n.id === id)
          if (!item || item.read) return state

          return {
            notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }
        })
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }))
      },

      clearHistory: () => {
        set({ notifications: [], unreadCount: 0 })
      },

      removeNotification: (id) => {
        set((state) => {
          const item = state.notifications.find((n) => n.id === id)
          const newUnreadCount = item && !item.read ? state.unreadCount - 1 : state.unreadCount

          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: Math.max(0, newUnreadCount),
          }
        })
      },
    }),
    {
      name: 'ajo-notifications',
    }
  )
)

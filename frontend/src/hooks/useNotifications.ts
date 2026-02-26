import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'contribution_due' | 'contribution_overdue' | 'payout_received' | 'member_joined' | 'cycle_completed' | 'announcement';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  groupId?: string;
  actionUrl?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  contributionDue24h: boolean;
  contributionDue1h: boolean;
  contributionOverdue: boolean;
  payoutReceived: boolean;
  memberJoined: boolean;
  cycleCompleted: boolean;
  announcements: boolean;
}

interface NotificationState {
  notifications: Notification[];
  preferences: NotificationPreferences;
  pushSubscription: PushSubscription | null;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  setPushSubscription: (subscription: PushSubscription | null) => void;
  getUnreadCount: () => number;
}

const defaultPreferences: NotificationPreferences = {
  email: false,
  push: true,
  inApp: true,
  contributionDue24h: true,
  contributionDue1h: true,
  contributionOverdue: true,
  payoutReceived: true,
  memberJoined: true,
  cycleCompleted: true,
  announcements: true,
};

export const useNotifications = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      preferences: defaultPreferences,
      pushSubscription: null,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          read: false,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 100),
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      updatePreferences: (preferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        }));
      },

      setPushSubscription: (subscription) => {
        set({ pushSubscription: subscription });
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'ajo-notifications',
      partialize: (state) => ({
        notifications: state.notifications,
        preferences: state.preferences,
      }),
    }
  )
);

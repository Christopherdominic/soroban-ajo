import toast from 'react-hot-toast'
import { analytics } from '../services/analytics'
import { useNotificationStore } from '../store/notificationStore'

export const showNotification = {
  success: (message: string, metadata?: Record<string, unknown>) => {
    analytics.trackEvent({
      category: 'Notification',
      action: 'Success',
      label: message,
      metadata,
    })

    useNotificationStore.getState().addNotification({
      type: 'success',
      message,
      metadata,
    })

    toast.success(message, {
      duration: 4000,
      position: 'top-right',
    })
  },

  error: (message: string, metadata?: Record<string, unknown>) => {
    analytics.trackError(new Error(message), { ...metadata, operation: 'notification' }, 'low')

    useNotificationStore.getState().addNotification({
      type: 'error',
      message,
      metadata,
    })

    toast.error(message, {
      duration: 5000,
      position: 'top-right',
    })
  },

  warning: (message: string, metadata?: Record<string, unknown>) => {
    useNotificationStore.getState().addNotification({
      type: 'warning',
      message,
      metadata,
    })

    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#FFFBEB',
        color: '#92400E',
        border: '1px solid #FCD34D',
      },
    })
  },

  info: (message: string, metadata?: Record<string, unknown>) => {
    useNotificationStore.getState().addNotification({
      type: 'info',
      message,
      metadata,
    })

    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#EFF6FF',
        color: '#1E40AF',
        border: '1px solid #BFDBFE',
      },
    })
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
    })
  },

  promise: async <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
    metadata?: Record<string, unknown>
  ) => {
    const start = performance.now()

    try {
      const result = await toast.promise(promise, messages, {
        position: 'top-right',
        success: {
          duration: 4000,
        },
        error: {
          duration: 5000,
        },
      })

      const duration = performance.now() - start

      useNotificationStore.getState().addNotification({
        type: 'success',
        message: messages.success,
        metadata: { ...metadata, duration },
      })

      analytics.trackMetric('promise_notification', duration, {
        ...metadata,
        status: 'success',
      })

      return result
    } catch (error) {
      const duration = performance.now() - start

      useNotificationStore.getState().addNotification({
        type: 'error',
        message: messages.error,
        metadata: { ...metadata, duration, error: String(error) },
      })

      analytics.trackMetric('promise_notification', duration, {
        ...metadata,
        status: 'error',
      })

      throw error
    }
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId)
  },
}

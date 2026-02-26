// Monitoring service — ready for Sentry integration
// To enable Sentry: npm install @sentry/nextjs and uncomment Sentry calls

interface MonitoringEvent {
  error: Error
  context?: Record<string, any>
  severity?: 'low' | 'medium' | 'high' | 'critical'
  userId?: string
  sessionId?: string
}

class MonitoringService {
  private enabled: boolean
  private dsn?: string

  constructor() {
    this.dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
    this.enabled = !!this.dsn
  }

  initialize() {
    if (!this.enabled) {
      console.info('[Monitoring] Monitoring disabled — set NEXT_PUBLIC_SENTRY_DSN to enable')
      return
    }
    // Sentry.init({ dsn: this.dsn, tracesSampleRate: 1.0 })
    console.info('[Monitoring] Monitoring initialized')
  }

  captureError({ error, context, severity = 'medium', userId }: MonitoringEvent) {
    if (this.enabled) {
      // Sentry.withScope((scope) => {
      //   scope.setLevel(severity)
      //   if (userId) scope.setUser({ id: userId })
      //   if (context) scope.setExtras(context)
      //   Sentry.captureException(error)
      // })
    }
    // Always log to analytics
    try {
      const { analytics } = require('./analytics')
      analytics.trackError(error, { ...context, severity }, severity)
    } catch {}

    console.error(`[Monitoring] ${severity.toUpperCase()}:`, error.message, context)
  }

  captureMessage(message: string, severity: MonitoringEvent['severity'] = 'low') {
    if (this.enabled) {
      // Sentry.captureMessage(message, severity)
    }
    console.info(`[Monitoring] ${message}`)
  }

  setUser(userId: string, email?: string) {
    if (this.enabled) {
      // Sentry.setUser({ id: userId, email })
    }
  }

  clearUser() {
    if (this.enabled) {
      // Sentry.setUser(null)
    }
  }
}

export const monitoring = new MonitoringService()

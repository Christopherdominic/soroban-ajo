// Analytics and monitoring service for tracking user actions and performance

export interface AnalyticsEvent {
  category: string
  action: string
  label?: string
  value?: number
  timestamp?: number
  metadata?: Record<string, any>
}

export interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  metadata?: Record<string, any>
}

export interface ErrorEvent {
  message: string
  stack?: string
  context?: Record<string, any>
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: number
}

class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private metrics: PerformanceMetric[] = []
  private errors: ErrorEvent[] = []
  private sessionId: string
  private userId?: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializePerformanceObserver()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initializePerformanceObserver() {
    if (typeof window === 'undefined') return

    // Track navigation timing
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (perfData) {
        this.trackMetric('page_load', perfData.loadEventEnd - perfData.fetchStart, {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          ttfb: perfData.responseStart - perfData.requestStart,
          download: perfData.responseEnd - perfData.responseStart,
          dom: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        })
      }
    })
  }

  setUserId(userId: string) {
    this.userId = userId
  }

  // Track user actions
  trackEvent(event: AnalyticsEvent) {
    const enrichedEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    }

    this.events.push(enrichedEvent)
    console.log('[Analytics]', enrichedEvent)

    // Send to analytics backend (placeholder)
    this.sendToBackend('event', enrichedEvent)
  }

  // Track performance metrics
  trackMetric(name: string, duration: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    }

    this.metrics.push(metric)
    console.log('[Performance]', metric)

    // Send to monitoring backend
    this.sendToBackend('metric', metric)
  }

  // Track errors
  trackError(error: Error | string, context?: Record<string, any>, severity: ErrorEvent['severity'] = 'medium') {
    const errorEvent: ErrorEvent = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      context: {
        ...context,
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      severity,
      timestamp: Date.now(),
    }

    this.errors.push(errorEvent)
    console.error('[Error]', errorEvent)

    // Send to error tracking backend
    this.sendToBackend('error', errorEvent)
  }

  // Measure function execution time
  async measureAsync<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      this.trackMetric(name, duration, { ...metadata, status: 'success' })
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.trackMetric(name, duration, { ...metadata, status: 'error' })
      throw error
    }
  }

  measureSync<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    const start = performance.now()
    try {
      const result = fn()
      const duration = performance.now() - start
      this.trackMetric(name, duration, { ...metadata, status: 'success' })
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.trackMetric(name, duration, { ...metadata, status: 'error' })
      throw error
    }
  }

  // Get analytics data for dashboards
  getEvents(limit?: number): AnalyticsEvent[] {
    return limit ? this.events.slice(-limit) : this.events
  }

  getMetrics(limit?: number): PerformanceMetric[] {
    return limit ? this.metrics.slice(-limit) : this.metrics
  }

  getErrors(limit?: number): ErrorEvent[] {
    return limit ? this.errors.slice(-limit) : this.errors
  }

  // Get aggregated stats
  getStats() {
    return {
      totalEvents: this.events.length,
      totalMetrics: this.metrics.length,
      totalErrors: this.errors.length,
      sessionId: this.sessionId,
      userId: this.userId,
      avgMetricDuration: this.metrics.length > 0
        ? this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length
        : 0,
      errorsBySeverity: {
        low: this.errors.filter(e => e.severity === 'low').length,
        medium: this.errors.filter(e => e.severity === 'medium').length,
        high: this.errors.filter(e => e.severity === 'high').length,
        critical: this.errors.filter(e => e.severity === 'critical').length,
      },
    }
  }

  // Clear old data (keep last 1000 entries)
  cleanup() {
    const maxEntries = 1000
    if (this.events.length > maxEntries) {
      this.events = this.events.slice(-maxEntries)
    }
    if (this.metrics.length > maxEntries) {
      this.metrics = this.metrics.slice(-maxEntries)
    }
    if (this.errors.length > maxEntries) {
      this.errors = this.errors.slice(-maxEntries)
    }
  }

  private sendToBackend(_type: string, _data: any) {
    // TODO: Implement actual backend integration
    // Options: Google Analytics, Mixpanel, PostHog, custom backend
    // For now, just store locally and log
    
    // Example: Send to custom analytics endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type, data }),
    // }).catch(err => console.error('Failed to send analytics', err))
  }
}

// Singleton instance
export const analytics = new AnalyticsService()

// Convenience functions for common events
export const trackUserAction = {
  groupCreated: (groupId: string, params: any) => {
    analytics.trackEvent({
      category: 'Group',
      action: 'Created',
      label: groupId,
      metadata: params,
    })
  },

  groupJoined: (groupId: string) => {
    analytics.trackEvent({
      category: 'Group',
      action: 'Joined',
      label: groupId,
    })
  },

  contributionMade: (groupId: string, amount: number) => {
    analytics.trackEvent({
      category: 'Contribution',
      action: 'Made',
      label: groupId,
      value: amount,
    })
  },

  payoutReceived: (groupId: string, amount: number) => {
    analytics.trackEvent({
      category: 'Payout',
      action: 'Received',
      label: groupId,
      value: amount,
    })
  },

  walletConnected: (walletType: string) => {
    analytics.trackEvent({
      category: 'Wallet',
      action: 'Connected',
      label: walletType,
    })
  },

  walletDisconnected: () => {
    analytics.trackEvent({
      category: 'Wallet',
      action: 'Disconnected',
    })
  },

  pageViewed: (pageName: string) => {
    analytics.trackEvent({
      category: 'Navigation',
      action: 'Page View',
      label: pageName,
    })
  },

  searchPerformed: (query: string, resultsCount: number) => {
    analytics.trackEvent({
      category: 'Search',
      action: 'Performed',
      label: query,
      value: resultsCount,
    })
  },

  filterApplied: (filterType: string, filterValue: string) => {
    analytics.trackEvent({
      category: 'Filter',
      action: 'Applied',
      label: `${filterType}: ${filterValue}`,
    })
  },
}

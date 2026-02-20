import React, { useEffect, useState } from 'react'
import { analytics } from '../services/analytics'
import type { AnalyticsEvent, PerformanceMetric, ErrorEvent } from '../services/analytics'

export const MonitoringDashboard: React.FC = () => {
  const [stats, setStats] = useState(analytics.getStats())
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [errors, setErrors] = useState<ErrorEvent[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(analytics.getStats())
      setEvents(analytics.getEvents(10))
      setMetrics(analytics.getMetrics(10))
      setErrors(analytics.getErrors(10))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Monitoring Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Events" value={stats.totalEvents} />
        <StatCard title="Total Metrics" value={stats.totalMetrics} />
        <StatCard title="Total Errors" value={stats.totalErrors} />
        <StatCard 
          title="Avg Duration" 
          value={`${stats.avgMetricDuration.toFixed(2)}ms`} 
        />
      </div>

      {/* Error Severity */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Errors by Severity</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-500">{stats.errorsBySeverity.low}</div>
            <div className="text-sm text-gray-600">Low</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.errorsBySeverity.medium}</div>
            <div className="text-sm text-gray-600">Medium</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.errorsBySeverity.high}</div>
            <div className="text-sm text-gray-600">High</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{stats.errorsBySeverity.critical}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Recent Events</h2>
        <div className="space-y-2">
          {events.length === 0 ? (
            <p className="text-gray-500 text-sm">No events yet</p>
          ) : (
            events.map((event, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-3 py-2 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{event.category}</span>
                    <span className="mx-2">→</span>
                    <span>{event.action}</span>
                    {event.label && <span className="text-gray-600 ml-2">({event.label})</span>}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp ?? Date.now()).toLocaleTimeString()}
                  </span>
                </div>
                {event.value !== undefined && (
                  <div className="text-sm text-gray-600 mt-1">Value: {event.value}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Performance Metrics</h2>
        <div className="space-y-2">
          {metrics.length === 0 ? (
            <p className="text-gray-500 text-sm">No metrics yet</p>
          ) : (
            metrics.map((metric, idx) => (
              <div key={idx} className="border-l-4 border-green-500 pl-3 py-2 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{metric.name}</span>
                    <span className="ml-3 text-sm">
                      <span className={getDurationColor(metric.duration)}>
                        {metric.duration.toFixed(2)}ms
                      </span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {metric.metadata && (
                  <div className="text-xs text-gray-600 mt-1">
                    {JSON.stringify(metric.metadata)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Errors */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Recent Errors</h2>
        <div className="space-y-2">
          {errors.length === 0 ? (
            <p className="text-gray-500 text-sm">No errors yet</p>
          ) : (
            errors.map((error, idx) => (
              <div key={idx} className={`border-l-4 pl-3 py-2 bg-gray-50 ${getSeverityColor(error.severity)}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-red-600">{error.message}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getSeverityBadge(error.severity)}`}>
                        {error.severity}
                      </span>
                    </div>
                    {error.stack && (
                      <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
                        {error.stack.split('\n').slice(0, 3).join('\n')}
                      </pre>
                    )}
                    {error.context && (
                      <div className="text-xs text-gray-600 mt-1">
                        Context: {JSON.stringify(error.context, null, 2)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Session Info</h2>
        <div className="space-y-1 text-sm">
          <div><span className="font-medium">Session ID:</span> {stats.sessionId}</div>
          {stats.userId && <div><span className="font-medium">User ID:</span> {stats.userId}</div>}
        </div>
      </div>
    </div>
  )
}

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="text-sm text-gray-600">{title}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
  </div>
)

const getDurationColor = (duration: number): string => {
  if (duration < 100) return 'text-green-600'
  if (duration < 500) return 'text-yellow-600'
  if (duration < 1000) return 'text-orange-600'
  return 'text-red-600'
}

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'low': return 'border-gray-400'
    case 'medium': return 'border-yellow-500'
    case 'high': return 'border-orange-500'
    case 'critical': return 'border-red-500'
    default: return 'border-gray-400'
  }
}

const getSeverityBadge = (severity: string): string => {
  switch (severity) {
    case 'low': return 'bg-gray-200 text-gray-700'
    case 'medium': return 'bg-yellow-200 text-yellow-800'
    case 'high': return 'bg-orange-200 text-orange-800'
    case 'critical': return 'bg-red-200 text-red-800'
    default: return 'bg-gray-200 text-gray-700'
  }
}

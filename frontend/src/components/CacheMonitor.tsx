/**
 * Cache Monitoring Dashboard Component
 * 
 * For development and CI/CD monitoring:
 * - Real-time cache metrics
 * - Cache health status
 * - Manual cache operations
 * - Performance insights
 */

import React, { useState } from 'react'
import { useCacheMetrics, useCacheInvalidation } from '../hooks/useContractData'
import { checkCacheHealth } from '../config/cache-config'

export const CacheMonitor: React.FC = () => {
  const { data: metrics, refetch } = useCacheMetrics()
  const cacheOps = useCacheInvalidation()
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  if (!metrics) {
    return <div className="p-4">Loading cache metrics...</div>
  }

  const health = checkCacheHealth({
    hits: metrics.hits,
    misses: metrics.misses,
    size: metrics.size,
    maxSize: 200, // From config
    evictions: metrics.evictions,
    invalidations: metrics.invalidations,
  })

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Cache Monitor</h2>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              cacheOps.bustAllCache()
              refetch()
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear All Cache
          </button>
        </div>
      </div>

      {/* Health Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        health.healthy ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
      } border-2`}>
        <h3 className="font-bold text-lg mb-2">
          Health Status: {health.healthy ? '✅ Healthy' : '⚠️ Issues Detected'}
        </h3>
        {health.issues.length > 0 && (
          <div className="mb-2">
            <p className="font-semibold text-red-700">Issues:</p>
            <ul className="list-disc list-inside">
              {health.issues.map((issue, i) => (
                <li key={i} className="text-red-600">{issue}</li>
              ))}
            </ul>
          </div>
        )}
        {health.warnings.length > 0 && (
          <div>
            <p className="font-semibold text-yellow-700">Warnings:</p>
            <ul className="list-disc list-inside">
              {health.warnings.map((warning, i) => (
                <li key={i} className="text-yellow-600">{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Hit Rate"
          value={`${metrics.hitRatePercentage}%`}
          subtitle={`${metrics.hits} hits / ${metrics.misses} misses`}
          color="blue"
        />
        <MetricCard
          title="Cache Size"
          value={metrics.size}
          subtitle="entries"
          color="green"
        />
        <MetricCard
          title="Invalidations"
          value={metrics.invalidations}
          subtitle="total"
          color="yellow"
        />
        <MetricCard
          title="Evictions"
          value={metrics.evictions}
          subtitle="LRU evictions"
          color="red"
        />
      </div>

      {/* Cache Entries */}
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-bold text-lg mb-4">Cache Entries</h3>
        {metrics.state.entries.length === 0 ? (
          <p className="text-gray-500">No cache entries</p>
        ) : (
          <div className="space-y-2">
            {metrics.state.entries.map((entry: any) => (
              <div
                key={entry.key}
                className="border rounded p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpandedEntry(
                  expandedEntry === entry.key ? null : entry.key
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-mono text-sm font-semibold">{entry.key}</p>
                    <p className="text-xs text-gray-500">
                      Age: {Math.round(entry.age / 1000)}s / TTL: {Math.round(entry.ttl / 1000)}s
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      entry.age < entry.ttl
                        ? 'bg-green-100 text-green-700'
                        : entry.age < entry.ttl * 2
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.age < entry.ttl ? 'Fresh' : entry.age < entry.ttl * 2 ? 'Stale' : 'Expired'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        cacheOps.invalidateGroup(entry.key)
                        refetch()
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Bust
                    </button>
                  </div>
                </div>
                {expandedEntry === entry.key && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Version:</span> {entry.version || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">ETag:</span> {entry.etag || 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cache Tags */}
      {metrics.state.tags.length > 0 && (
        <div className="bg-white rounded-lg p-4 mt-4">
          <h3 className="font-bold text-lg mb-4">Cache Tags</h3>
          <div className="space-y-2">
            {metrics.state.tags.map((tag: any) => (
              <div key={tag.tag} className="border rounded p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-mono text-sm font-semibold">{tag.tag}</p>
                    <p className="text-xs text-gray-500">
                      {tag.keys.length} entries
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      cacheOps.invalidateGroups()
                      refetch()
                    }}
                    className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                  >
                    Invalidate Tag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle: string
  color: 'blue' | 'green' | 'yellow' | 'red'
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 border-blue-500 text-blue-700',
    green: 'bg-green-100 border-green-500 text-green-700',
    yellow: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    red: 'bg-red-100 border-red-500 text-red-700',
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <p className="text-sm font-semibold mb-1">{title}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs opacity-75">{subtitle}</p>
    </div>
  )
}

export default CacheMonitor

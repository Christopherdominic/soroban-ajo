// Issue #33: Create group analytics page
// Complexity: High (200 pts)
// Status: Placeholder - theme-aware charts (#58)

import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

interface AnalyticsMetric {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
}

export const GroupAnalytics: React.FC = () => {
  const tickFill = 'var(--chart-tick)' // theme-aware via .dark in globals.css

  const metrics: AnalyticsMetric[] = [
    { label: 'Total Contributions', value: '$12,500', change: '+12%', trend: 'up' },
    { label: 'Active Members', value: '32', change: '+2', trend: 'up' },
    { label: 'Avg Cycle Time', value: '29 days', change: '-1 day', trend: 'down' },
    { label: 'Payouts Completed', value: '14', change: '+1', trend: 'up' },
  ]

  // TASK: ADDED DUMMY DATA FOR THE CHARTS TO RENDER (#54)
  const trendData = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 5000 },
    { name: 'Apr', amount: 4500 },
    { name: 'May', amount: 6000 },
    { name: 'Jun', amount: 5500 },
  ]

  const timelineData = [
    { name: 'Week 1', completed: 4, pending: 2 },
    { name: 'Week 2', completed: 3, pending: 4 },
    { name: 'Week 3', completed: 5, pending: 1 },
    { name: 'Week 4', completed: 2, pending: 3 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Group Analytics</h2>
        <p className="text-gray-600 dark:text-slate-400">Track performance and contribution trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/50 p-6 border border-gray-100 dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-slate-400">{metric.label}</p>
            <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-slate-100">{metric.value}</p>
            <p
              className={`text-sm mt-1 ${metric.trend === 'up'
                ? 'text-green-600 dark:text-emerald-400'
                : metric.trend === 'down'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-slate-400'
                }`}
            >
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/50 p-6 border border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-slate-100">Contribution Trends</h3>
          <div className="h-64 bg-gray-50 dark:bg-slate-700/50 rounded pt-4 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-primary)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--chart-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-line)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: tickFill, fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: tickFill, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--chart-tooltip-bg)',
                    borderColor: 'var(--chart-tooltip-border)',
                    color: 'var(--chart-tooltip-text)',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--chart-primary)" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/50 p-6 border border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-slate-100">Payout Timeline</h3>
          <div className="h-64 bg-gray-50 dark:bg-slate-700/50 rounded pt-4 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-line)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: tickFill, fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: tickFill, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    backgroundColor: 'var(--chart-tooltip-bg)',
                    borderColor: 'var(--chart-tooltip-border)',
                    color: 'var(--chart-tooltip-text)',
                    borderRadius: '8px',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                <Bar dataKey="completed" fill="var(--chart-primary)" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="pending" fill="var(--chart-secondary)" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/50 p-6 border border-gray-100 dark:border-slate-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-slate-100">Top Contributors</h3>
        <div className="space-y-3">
          {['GAAAA...AAAA', 'GBBBB...BBBB', 'GCCCC...CCCC'].map((addr) => (
            <div key={addr} className="flex items-center justify-between">
              <span className="font-mono text-sm text-gray-600 dark:text-slate-400">{addr}</span>
              <span className="font-semibold text-gray-900 dark:text-slate-100">$1,500</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
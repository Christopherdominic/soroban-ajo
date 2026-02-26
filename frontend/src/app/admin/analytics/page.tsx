'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/Button'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

interface AdvancedMetrics {
  userMetrics: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    retentionRate: number
    churnRate: number
    avgLTV: number
  }
  groupMetrics: {
    totalGroups: number
    activeGroups: number
    avgGroupSize: number
    successRate: number
    defaultRate: number
  }
  financialMetrics: {
    totalVolume: number
    totalContributions: number
    totalPayouts: number
    avgContributionAmount: number
  }
  cohortMetrics: Array<{
    cohortDate: string
    cohortSize: number
    retentionRates: number[]
  }>
}

interface PredictiveMetrics {
  churnPrediction: Array<{
    userId: string
    churnProbability: number
    riskFactors: string[]
  }>
  groupSuccessPrediction: Array<{
    groupId: string
    successProbability: number
    riskFactors: string[]
  }>
  optimalContributionAmount: {
    minAmount: number
    maxAmount: number
    recommendedAmount: number
    confidence: number
  }
}

interface FunnelData {
  stage: string
  totalUsers: number
  conversionRate: number
  dropoffRate: number
  avgTimeInStage: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AdvancedMetrics | null>(null)
  const [predictions, setPredictions] = useState<PredictiveMetrics | null>(null)
  const [funnelData, setFunnelData] = useState<FunnelData[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'groups' | 'financial' | 'predictive'>('overview')

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const [metricsRes, predictionsRes, funnelRes] = await Promise.all([
        fetch(`/api/analytics/advanced?start=${dateRange.start}&end=${dateRange.end}`),
        fetch('/api/analytics/predictive'),
        fetch('/api/analytics/funnel'),
      ])

      const [metricsData, predictionsData, funnelData] = await Promise.all([
        metricsRes.json(),
        predictionsRes.json(),
        funnelRes.json(),
      ])

      setMetrics(metricsData)
      setPredictions(predictionsData)
      setFunnelData(funnelData)
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          dateRange,
          includeMetrics: true,
          includePredictions: true,
          includeFunnel: true,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics.${format}`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Advanced business intelligence and insights</p>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => exportData('csv')} variant="secondary">
              Export CSV
            </Button>
            <Button onClick={() => exportData('excel')} variant="secondary">
              Export Excel
            </Button>
            <Button onClick={() => exportData('pdf')} variant="secondary">
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['overview', 'users', 'groups', 'financial', 'predictive'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-600">Total Users</div>
                <div className="text-2xl font-bold text-gray-900">{metrics.userMetrics.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-green-600">+{metrics.userMetrics.newUsers} new</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-600">Active Groups</div>
                <div className="text-2xl font-bold text-gray-900">{metrics.groupMetrics.activeGroups}</div>
                <div className="text-sm text-blue-600">{metrics.groupMetrics.successRate.toFixed(1)}% success rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-600">Total Volume</div>
                <div className="text-2xl font-bold text-gray-900">${metrics.financialMetrics.totalVolume.toLocaleString()}</div>
                <div className="text-sm text-purple-600">Avg: ${metrics.financialMetrics.avgContributionAmount.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-600">Retention Rate</div>
                <div className="text-2xl font-bold text-gray-900">{(metrics.userMetrics.retentionRate * 100).toFixed(1)}%</div>
                <div className="text-sm text-red-600">{(metrics.userMetrics.churnRate * 100).toFixed(1)}% churn</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={generateGrowthData(metrics)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funnel Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalUsers" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Users:</span>
                    <span className="font-bold">{metrics.userMetrics.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-bold">{metrics.userMetrics.activeUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Users:</span>
                    <span className="font-bold text-green-600">+{metrics.userMetrics.newUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retention Rate:</span>
                    <span className="font-bold text-blue-600">{(metrics.userMetrics.retentionRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Rate:</span>
                    <span className="font-bold text-red-600">{(metrics.userMetrics.churnRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg LTV:</span>
                    <span className="font-bold">${metrics.userMetrics.avgLTV.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Active', value: metrics.userMetrics.activeUsers },
                        { name: 'Inactive', value: metrics.userMetrics.totalUsers - metrics.userMetrics.activeUsers },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Groups Tab */}
      {activeTab === 'groups' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Groups:</span>
                    <span className="font-bold">{metrics.groupMetrics.totalGroups}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Groups:</span>
                    <span className="font-bold text-green-600">{metrics.groupMetrics.activeGroups}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Group Size:</span>
                    <span className="font-bold">{metrics.groupMetrics.avgGroupSize.toFixed(1)} members</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-bold text-blue-600">{(metrics.groupMetrics.successRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Default Rate:</span>
                    <span className="font-bold text-red-600">{(metrics.groupMetrics.defaultRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Group Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generateGroupPerformanceData(metrics)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Financial Tab */}
      {activeTab === 'financial' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ${metrics.financialMetrics.totalVolume.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-2">All time contributions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  ${metrics.financialMetrics.totalContributions.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-2">Total amount contributed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Avg Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  ${metrics.financialMetrics.avgContributionAmount.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600 mt-2">Per contribution</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Predictive Tab */}
      {activeTab === 'predictive' && predictions && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Churn Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictions.churnPrediction.slice(0, 5).map((prediction) => (
                    <div key={prediction.userId} className="flex justify-between items-center">
                      <span className="text-sm font-mono">{prediction.userId.slice(0, 8)}...</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              prediction.churnProbability > 0.7 ? 'bg-red-500' : 
                              prediction.churnProbability > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${prediction.churnProbability * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">
                          {(prediction.churnProbability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Group Success Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictions.groupSuccessPrediction.slice(0, 5).map((prediction) => (
                    <div key={prediction.groupId} className="flex justify-between items-center">
                      <span className="text-sm font-mono">{prediction.groupId.slice(0, 8)}...</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              prediction.successProbability > 0.8 ? 'bg-green-500' : 
                              prediction.successProbability > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${prediction.successProbability * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">
                          {(prediction.successProbability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Optimal Contribution Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Minimum</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${predictions.optimalContributionAmount.minAmount}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Recommended</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${predictions.optimalContributionAmount.recommendedAmount}
                  </div>
                  <div className="text-sm text-gray-500">
                    {(predictions.optimalContributionAmount.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Maximum</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${predictions.optimalContributionAmount.maxAmount}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Helper functions to generate chart data
function generateGrowthData(metrics: AdvancedMetrics) {
  return [
    { date: 'Week 1', users: metrics.userMetrics.totalUsers * 0.7 },
    { date: 'Week 2', users: metrics.userMetrics.totalUsers * 0.8 },
    { date: 'Week 3', users: metrics.userMetrics.totalUsers * 0.9 },
    { date: 'Week 4', users: metrics.userMetrics.totalUsers },
  ]
}

function generateGroupPerformanceData(metrics: AdvancedMetrics) {
  return [
    { metric: 'Success Rate', value: metrics.groupMetrics.successRate * 100 },
    { metric: 'Default Rate', value: metrics.groupMetrics.defaultRate * 100 },
    { metric: 'Avg Size', value: metrics.groupMetrics.avgGroupSize * 10 },
  ]
}

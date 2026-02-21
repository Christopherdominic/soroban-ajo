import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import type { Group, Member } from '@/types'

interface GroupAnalyticsProps {
  group?: Group
  members?: Member[]
  isLoading?: boolean
}

interface PerformanceMetric {
  label: string
  value: string
  progress: number
}

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`

const shortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

const AnalyticsSkeleton: React.FC = () => (
  <div className="space-y-6" aria-busy="true" aria-live="polite">
    <div className="space-y-2">
      <div className="skeleton h-8 w-56" />
      <div className="skeleton h-4 w-72" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="theme-surface p-6 rounded space-y-3">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-8 w-28" />
          <div className="skeleton h-4 w-20" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="theme-surface p-6 rounded space-y-4">
        <div className="skeleton h-6 w-44" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton h-10 w-full" />
        ))}
      </div>
      <div className="theme-surface p-6 rounded space-y-4">
        <div className="skeleton h-6 w-40" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton h-12 w-full" />
        ))}
      </div>
    </div>
  </div>
)

const EmptyAnalyticsState: React.FC = () => (
  <div className="theme-surface p-6 rounded" role="status" aria-live="polite">
    <h3 className="text-xl font-bold">No analytics data yet</h3>
    <p className="theme-muted mt-2">
      Start collecting member contributions to unlock contribution breakdown, payout schedule, and performance metrics.
    </p>
  </div>
)

const sampleGroup: Group = {
  id: 'group-1',
  name: 'Market Women Ajo',
  creator: 'GCREATORAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  cycleLength: 30,
  contributionAmount: 500,
  maxMembers: 10,
  currentMembers: 8,
  totalContributions: 4000,
  status: 'active',
  createdAt: '2026-01-01',
  nextPayoutDate: '2026-02-28',
}

const sampleMembers: Member[] = [
  {
    address: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    groupId: 'group-1',
    joinedDate: '2026-01-02',
    contributions: 500,
    status: 'active',
  },
  {
    address: 'GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
    groupId: 'group-1',
    joinedDate: '2026-01-03',
    contributions: 500,
    status: 'active',
  },
]

const buildPayoutSchedule = (group: Group) => {
  const baseDate = new Date(group.nextPayoutDate)
  const cycles = Math.min(Math.max(group.currentMembers, 1), 4)

  return Array.from({ length: cycles }, (_, index) => {
    const payoutDate = new Date(baseDate)
    payoutDate.setDate(baseDate.getDate() + index * group.cycleLength)

    return {
      cycle: index + 1,
      date: payoutDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      amount: group.contributionAmount * Math.max(group.currentMembers, 1),
      status: index === 0 ? 'upcoming' : 'scheduled',
    }
  })
}

export const GroupAnalytics: React.FC<GroupAnalyticsProps> = ({
  group = sampleGroup,
  members,
  isLoading = false,
}) => {
  if (isLoading) {
    return <AnalyticsSkeleton />
  }

  const resolvedMembers = members ?? sampleMembers
  const activeMembers = resolvedMembers.filter((member) => member.status === 'active')
  const contributors = resolvedMembers.filter((member) => member.contributions > 0)

  const totalFromMembers = resolvedMembers.reduce((total, member) => total + member.contributions, 0)
  const totalContributions = Math.max(group.totalContributions, totalFromMembers)
  const scheduledPayoutAmount = group.contributionAmount * Math.max(group.currentMembers, 1)
  const expectedPerCycle = Math.max(group.currentMembers, 1) * group.contributionAmount
  const completionRate = expectedPerCycle > 0 ? Math.min((totalContributions / expectedPerCycle) * 100, 100) : 0
  const averageContribution =
    resolvedMembers.length > 0 ? totalContributions / resolvedMembers.length : 0

  const hasData = totalContributions > 0 || resolvedMembers.length > 0
  if (!hasData) {
    return <EmptyAnalyticsState />
  }

  const payoutSchedule = buildPayoutSchedule(group)

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: 'Funding Progress',
      value: `${completionRate.toFixed(0)}%`,
      progress: completionRate,
    },
    {
      label: 'Member Participation',
      value: `${group.currentMembers > 0 ? ((activeMembers.length / group.currentMembers) * 100).toFixed(0) : '0'}%`,
      progress: group.currentMembers > 0 ? (activeMembers.length / group.currentMembers) * 100 : 0,
    },
    {
      label: 'Contributors This Cycle',
      value: `${contributors.length}/${group.currentMembers}`,
      progress: group.currentMembers > 0 ? (contributors.length / group.currentMembers) * 100 : 0,
    },
    {
      label: 'Average Contribution',
      value: formatCurrency(averageContribution),
      progress:
        group.contributionAmount > 0
          ? Math.min((averageContribution / group.contributionAmount) * 100, 100)
          : 0,
    },
  ]

  const chartData = resolvedMembers.slice(0, 8).map((member) => ({
    name: shortAddress(member.address),
    contribution: member.contributions,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Group Analytics</h2>
        <p className="theme-muted">Track contribution health, payout readiness, and member performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="theme-surface p-6 rounded">
          <p className="text-sm theme-muted">Total Contributions</p>
          <p className="text-2xl font-bold mt-2">{formatCurrency(totalContributions)}</p>
          <p className="text-sm theme-muted mt-1">Current group total</p>
        </div>

        <div className="theme-surface p-6 rounded">
          <p className="text-sm theme-muted">Member Contributions</p>
          <p className="text-2xl font-bold mt-2">
            {contributors.length}/{group.currentMembers}
          </p>
          <p className="text-sm theme-muted mt-1">Members with active contribution</p>
        </div>

        <div className="theme-surface p-6 rounded">
          <p className="text-sm theme-muted">Next Payout</p>
          <p className="text-2xl font-bold mt-2">
            {new Date(group.nextPayoutDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-sm theme-muted mt-1">{formatCurrency(scheduledPayoutAmount)} scheduled</p>
        </div>

        <div className="theme-surface p-6 rounded">
          <p className="text-sm theme-muted">Avg Contribution</p>
          <p className="text-2xl font-bold mt-2">{formatCurrency(averageContribution)}</p>
          <p className="text-sm theme-muted mt-1">Per member</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="theme-surface p-6 rounded">
          <h3 className="text-xl font-bold mb-4">Member Contribution Breakdown</h3>
          {resolvedMembers.length === 0 ? (
            <div className="theme-surface-muted p-4 rounded">
              <p className="theme-muted">No member contributions available yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resolvedMembers
                .slice()
                .sort((a, b) => b.contributions - a.contributions)
                .map((member) => {
                  const share =
                    totalContributions > 0 ? (member.contributions / totalContributions) * 100 : 0

                  return (
                    <div key={member.address} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-mono theme-muted">{shortAddress(member.address)}</span>
                        <span className="font-semibold">{formatCurrency(member.contributions)}</span>
                      </div>
                      <progress
                        className="w-full h-2 theme-surface-muted rounded overflow-hidden"
                        value={Math.min(share, 100)}
                        max={100}
                      />
                    </div>
                  )
                })}
            </div>
          )}
        </div>

        <div className="theme-surface p-6 rounded">
          <h3 className="text-xl font-bold mb-4">Payout Schedule</h3>
          <div className="space-y-3">
            {payoutSchedule.map((item) => (
              <div
                key={`${item.cycle}-${item.date}`}
                className="theme-surface-muted p-4 rounded flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">Cycle {item.cycle}</p>
                  <p className="text-sm theme-muted">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(item.amount)}</p>
                  <p className={`text-sm ${item.status === 'upcoming' ? 'theme-primary' : 'theme-muted'}`}>
                    {item.status === 'upcoming' ? 'Upcoming' : 'Scheduled'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="theme-surface p-6 rounded">
        <h3 className="text-xl font-bold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceMetrics.map((metric) => (
            <div key={metric.label} className="theme-surface-muted p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">{metric.label}</p>
                <p className="text-sm font-semibold">{metric.value}</p>
              </div>
              <progress
                className="w-full h-2 theme-surface-muted rounded overflow-hidden"
                value={Math.min(metric.progress, 100)}
                max={100}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="theme-surface p-6 rounded">
        <h3 className="text-xl font-bold mb-4">Contribution Trend by Member</h3>
        {chartData.length === 0 ? (
          <div className="theme-surface-muted p-4 rounded">
            <p className="theme-muted">No contribution trend data available yet.</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="contribution" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

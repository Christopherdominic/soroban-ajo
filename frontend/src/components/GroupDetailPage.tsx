import React, { useState } from 'react'
import { MemberList } from './MemberList'
import { ContributionForm } from './ContributionForm'
import { TransactionHistory } from './TransactionHistory'
import { GroupAnalytics } from './GroupAnalytics'
import type { Group, Member } from '@/types'

type TabKey = 'overview' | 'members' | 'history' | 'analytics' | 'settings'

interface GroupDetailPageProps {
  groupId: string
  group?: Group | null
  members?: Member[]
  isLoading?: boolean
  analyticsLoading?: boolean
}

const GroupDetailSkeleton: React.FC = () => (
  <div className="space-y-6" aria-busy="true" aria-live="polite">
    <div className="theme-surface p-6 space-y-4">
      <div className="skeleton h-8 w-64" />
      <div className="skeleton h-4 w-40" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="theme-surface-muted p-4 rounded space-y-2">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
    <div className="theme-surface p-6 space-y-4">
      <div className="skeleton h-6 w-48" />
      <div className="skeleton h-40 w-full" />
    </div>
  </div>
)

const GroupDetailEmptyState: React.FC<{ groupId: string }> = ({ groupId }) => (
  <div className="theme-surface p-6 rounded" role="status" aria-live="polite">
    <h3 className="text-xl font-bold">Group not found</h3>
    <p className="theme-muted mt-2">No details are available for group {groupId}. Try selecting another group.</p>
  </div>
)

export const GroupDetailPage: React.FC<GroupDetailPageProps> = ({
  groupId,
  group,
  members,
  isLoading = false,
  analyticsLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  const sampleGroup: Group = {
    id: groupId,
    name: 'Market Women Ajo',
    description: 'Community savings for small business owners',
    creator: 'GCREATORAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    cycleLength: 30,
    contributionAmount: 500,
    maxMembers: 10,
    currentMembers: 8,
    totalContributions: 4000,
    status: 'active',
    createdAt: '2026-01-01',
    nextPayoutDate: '2026-02-28',
    frequency: 'monthly',
  }

  const sampleMembers: Member[] = [
    {
      address: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      groupId,
      joinedDate: '2026-01-02',
      contributions: 500,
      status: 'active',
    },
    {
      address: 'GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      groupId,
      joinedDate: '2026-01-03',
      contributions: 500,
      status: 'active',
    },
    {
      address: 'GCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      groupId,
      joinedDate: '2026-01-04',
      contributions: 500,
      status: 'active',
    },
    {
      address: 'GDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
      groupId,
      joinedDate: '2026-01-05',
      contributions: 500,
      status: 'active',
    },
    {
      address: 'GEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
      groupId,
      joinedDate: '2026-01-06',
      contributions: 500,
      status: 'active',
    },
    {
      address: 'GFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
      groupId,
      joinedDate: '2026-01-07',
      contributions: 500,
      status: 'active',
    },
    {
      address: 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      groupId,
      joinedDate: '2026-01-08',
      contributions: 0,
      status: 'inactive',
    },
    {
      address: 'GHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
      groupId,
      joinedDate: '2026-01-09',
      contributions: 0,
      status: 'active',
    },
  ]

  if (isLoading) {
    return <GroupDetailSkeleton />
  }

  if (group === null) {
    return <GroupDetailEmptyState groupId={groupId} />
  }

  const resolvedGroup = group ?? sampleGroup
  const resolvedMembers = members && members.length > 0 ? members : sampleMembers

  return (
    <div className="space-y-6">
      <div className="theme-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">{resolvedGroup.name}</h2>
            <p className="theme-muted">Group ID: {groupId}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-semibold theme-status-active">
            {resolvedGroup.status.charAt(0).toUpperCase() + resolvedGroup.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="theme-surface-muted p-4 rounded">
            <p className="text-sm theme-muted">Members</p>
            <p className="text-2xl font-bold">{resolvedGroup.currentMembers}/{resolvedGroup.maxMembers}</p>
          </div>
          <div className="theme-surface-muted p-4 rounded">
            <p className="text-sm theme-muted">Cycle Length</p>
            <p className="text-2xl font-bold">{resolvedGroup.cycleLength} days</p>
          </div>
          <div className="theme-surface-muted p-4 rounded">
            <p className="text-sm theme-muted">Contribution</p>
            <p className="text-2xl font-bold">${resolvedGroup.contributionAmount}</p>
          </div>
          <div className="theme-surface-muted p-4 rounded">
            <p className="text-sm theme-muted">Total Collected</p>
            <p className="text-2xl font-bold">${resolvedGroup.totalContributions.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="theme-surface">
        <div className="border-b border-[color:var(--color-border)]">
          <nav className="flex gap-4 px-6">
            {(['overview', 'members', 'history', 'analytics', 'settings'] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-semibold transition ${
                  activeTab === tab
                    ? 'border-[color:var(--color-primary)] theme-primary'
                    : 'border-transparent theme-muted hover:opacity-80'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="theme-surface-muted p-4 rounded">
                  <h3 className="text-lg font-semibold mb-2">Next Payout</h3>
                  <p className="text-2xl font-bold theme-primary">{new Date(resolvedGroup.nextPayoutDate).toLocaleDateString()}</p>
                </div>
                <TransactionHistory groupId={groupId} transactions={[]} />
              </div>
              <ContributionForm groupId={groupId} contributionAmount={resolvedGroup.contributionAmount} />
            </div>
          )}

          {activeTab === 'members' && (
            <MemberList groupId={groupId} members={resolvedMembers} />
          )}

          {activeTab === 'history' && (
            <TransactionHistory groupId={groupId} transactions={[]} />
          )}

          {activeTab === 'analytics' && (
            <GroupAnalytics group={resolvedGroup} members={resolvedMembers} isLoading={analyticsLoading} />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Group Settings</h3>
              <p className="theme-muted">
                TODO: Add settings for group creator (pause group, update metadata, cancel group)
              </p>
              <button className="theme-btn-danger px-4 py-2">
                Cancel Group (Creator Only)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

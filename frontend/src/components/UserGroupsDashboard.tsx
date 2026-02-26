'use client'

// Issue #213: Implement User Groups Dashboard
// New component that shows:
//   - Summary stats (total savings, pending contributions, upcoming payouts)
//   - Created groups (marked with a "Creator" badge)
//   - Joined groups (marked with a "Member" badge)
//   - Quick actions per group (Contribute, View)

import React from 'react'
import { useRouter } from 'next/navigation'
import { Group } from '@/types'
import { formatXLM, formatRelativeTime } from '@/utils/formatters'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserGroupStats {
  totalSavingsXLM: number
  pendingContributionsCount: number
  upcomingPayouts: Array<{ groupName: string; daysUntil: number; amountXLM: number }>
  createdGroupsCount: number
  joinedGroupsCount: number
}

interface UserGroupsDashboardProps {
  groups: Group[]
  userAddress: string
  isLoading: boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeStats(groups: Group[], userAddress: string): UserGroupStats {
  const createdGroups = groups.filter(g => g.creator === userAddress)
  const joinedGroups = groups.filter(g => g.creator !== userAddress)

  const totalSavingsXLM = groups.reduce((sum, g) => sum + g.totalContributions, 0)

  // Pending = active groups where the user hasn't completed their cycle contribution
  // (Using currentMembers < maxMembers as a proxy until contract returns per-user data)
  const pendingContributionsCount = groups.filter(
    g => g.status === 'active'
  ).length

  const upcomingPayouts = groups
    .filter(g => g.status === 'active' && g.nextPayoutDate)
    .map(g => {
      const daysUntil = Math.max(
        0,
        Math.ceil(
          (new Date(g.nextPayoutDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
      return {
        groupName: g.name,
        daysUntil,
        amountXLM: g.contributionAmount * g.currentMembers,
      }
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 3) // show next 3 upcoming payouts

  return {
    totalSavingsXLM,
    pendingContributionsCount,
    upcomingPayouts,
    createdGroupsCount: createdGroups.length,
    joinedGroupsCount: joinedGroups.length,
  }
}

function daysUntilLabel(days: number): string {
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

const StatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-surface-200/80 dark:border-slate-700">
        <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-2/3 mb-3" />
        <div className="h-7 bg-gray-200 dark:bg-slate-600 rounded w-1/2" />
      </div>
    ))}
  </div>
)

const GroupRowSkeleton: React.FC = () => (
  <div className="animate-pulse flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-surface-200/80 dark:border-slate-700">
    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-600 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-1/3" />
      <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/2" />
    </div>
    <div className="h-8 w-20 bg-gray-200 dark:bg-slate-600 rounded-lg" />
  </div>
)

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent: string // tailwind bg class
  icon: React.ReactNode
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, accent, icon }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-surface-200/80 dark:border-slate-700 flex flex-col gap-3">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-surface-400 dark:text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-surface-900 dark:text-slate-100 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-surface-400 dark:text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
)

// ── Group row ─────────────────────────────────────────────────────────────────

interface GroupRowProps {
  group: Group
  role: 'creator' | 'member'
  onView: (id: string) => void
  onContribute: (id: string) => void
}

const STATUS_STYLES: Record<Group['status'], string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  completed: 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
}

const GroupRow: React.FC<GroupRowProps> = ({ group, role, onView, onContribute }) => {
  const daysUntilPayout = Math.max(
    0,
    Math.ceil(
      (new Date(group.nextPayoutDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  )

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-surface-200/80 dark:border-slate-700 hover:border-primary-300 dark:hover:border-indigo-500 transition-colors">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {group.name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-surface-900 dark:text-slate-100 truncate">
            {group.name}
          </p>
          {/* Role badge */}
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            role === 'creator'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
          }`}>
            {role === 'creator' ? 'Creator' : 'Member'}
          </span>
          {/* Status badge */}
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[group.status]}`}>
            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-surface-400 dark:text-slate-500">
          <span>{group.currentMembers}/{group.maxMembers} members</span>
          <span>·</span>
          <span>{formatXLM(group.contributionAmount, 2)} / cycle</span>
          {group.status === 'active' && (
            <>
              <span>·</span>
              <span className={daysUntilPayout <= 3 ? 'text-amber-500 font-medium' : ''}>
                Payout {daysUntilLabel(daysUntilPayout)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {group.status === 'active' && (
          <button
            onClick={() => onContribute(group.id)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            Contribute
          </button>
        )}
        <button
          onClick={() => onView(group.id)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 dark:border-slate-600 text-surface-600 dark:text-slate-300 hover:bg-surface-50 dark:hover:bg-slate-700 transition-colors"
        >
          View
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * UserGroupsDashboard
 *
 * Displays:
 *   1. Summary stats row: total savings, pending contributions, upcoming payouts, group counts
 *   2. "My Created Groups" section with Creator badge
 *   3. "Groups I've Joined" section with Member badge
 *   4. Upcoming payouts panel
 *
 * Drop this inside Dashboard.tsx above the existing controls bar.
 */
export const UserGroupsDashboard: React.FC<UserGroupsDashboardProps> = ({
  groups,
  userAddress,
  isLoading,
}) => {
  const router = useRouter()

  const createdGroups = groups.filter(g => g.creator === userAddress)
  const joinedGroups = groups.filter(g => g.creator !== userAddress)
  const stats = computeStats(groups, userAddress)

  const handleView = (id: string) => router.push(`/groups/${id}`)
  const handleContribute = (id: string) => router.push(`/groups/${id}?action=contribute`)

  if (isLoading) {
    return (
      <div className="mb-8 space-y-4">
        <StatsSkeleton />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <GroupRowSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (groups.length === 0) return null

  return (
    <div className="mb-8 space-y-6">

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Savings"
          value={formatXLM(stats.totalSavingsXLM, 2)}
          sub="across all groups"
          accent="bg-green-100 dark:bg-green-900/30"
          icon={
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Active Groups"
          value={groups.filter(g => g.status === 'active').length}
          sub={`${stats.pendingContributionsCount} need contribution`}
          accent="bg-blue-100 dark:bg-blue-900/30"
          icon={
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Created"
          value={stats.createdGroupsCount}
          sub="groups you started"
          accent="bg-indigo-100 dark:bg-indigo-900/30"
          icon={
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        />
        <StatCard
          label="Joined"
          value={stats.joinedGroupsCount}
          sub="groups you're a member of"
          accent="bg-amber-100 dark:bg-amber-900/30"
          icon={
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
        />
      </div>

      {/* ── Upcoming payouts ── */}
      {stats.upcomingPayouts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-surface-200/80 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-slate-100 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Upcoming Payouts
            </h3>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-slate-700">
            {stats.upcomingPayouts.map((payout, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-surface-800 dark:text-slate-200">{payout.groupName}</p>
                  <p className={`text-xs mt-0.5 ${payout.daysUntil <= 3 ? 'text-amber-500 font-semibold' : 'text-surface-400 dark:text-slate-500'}`}>
                    {daysUntilLabel(payout.daysUntil)}
                  </p>
                </div>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {formatXLM(payout.amountXLM, 2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Created groups ── */}
      {createdGroups.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-slate-500 px-1">
            Groups I Created
          </h3>
          <div className="space-y-2">
            {createdGroups.map(g => (
              <GroupRow
                key={g.id}
                group={g}
                role="creator"
                onView={handleView}
                onContribute={handleContribute}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Joined groups ── */}
      {joinedGroups.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-slate-500 px-1">
            Groups I've Joined
          </h3>
          <div className="space-y-2">
            {joinedGroups.map(g => (
              <GroupRow
                key={g.id}
                group={g}
                role="member"
                onView={handleView}
                onContribute={handleContribute}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Pending contributions warning ── */}
      {stats.pendingContributionsCount > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {stats.pendingContributionsCount} active {stats.pendingContributionsCount === 1 ? 'group needs' : 'groups need'} your contribution
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Click "Contribute" on the relevant group above to stay on track.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

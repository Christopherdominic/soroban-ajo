import React, { useEffect } from 'react'
import { ExploreGroup } from '@/hooks/useExplore'

interface GroupPreviewModalProps {
  group: ExploreGroup
  onClose: () => void
  onJoin: (groupId: string) => void
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => {
        const filled = value >= star
        const half = !filled && value >= star - 0.5
        return (
          <svg key={star} className={`w-4 h-4 ${filled || half ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      })}
      <span className="ml-1 text-sm text-gray-600 dark:text-[var(--color-text-muted)] font-medium">{value.toFixed(1)}</span>
    </span>
  )
}

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-success)] dark:border-[var(--color-border)]',
  completed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-primary)] dark:border-[var(--color-border)]',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-warning)] dark:border-[var(--color-border)]',
}

const tagColors: Record<string, string> = {
  savings: 'bg-blue-100 text-blue-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  housing: 'bg-orange-100 text-orange-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  education: 'bg-purple-100 text-purple-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  emergency: 'bg-red-100 text-red-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  business: 'bg-green-100 text-green-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  vacation: 'bg-cyan-100 text-cyan-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  family: 'bg-pink-100 text-pink-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  community: 'bg-indigo-100 text-indigo-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
}

export const GroupPreviewModal: React.FC<GroupPreviewModalProps> = ({ group, onClose, onJoin }) => {
  const isFull = group.currentMembers >= group.maxMembers
  const fillPercent = (group.currentMembers / group.maxMembers) * 100

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleJoin = () => {
    onJoin(group.id)
    onClose()
  }

  const shortAddress = (addr: string) => `${addr.slice(0, 8)}...${addr.slice(-4)}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-[var(--color-surface)] dark:text-[var(--color-text)] dark:border dark:border-[var(--color-border)]">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between z-10 rounded-t-2xl dark:bg-[var(--color-surface)] dark:border-[var(--color-border)]">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-[var(--color-text)] truncate">
                {group.name}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[group.status]}`}>
                {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {group.tags.map(tag => (
                <span key={tag} className={`px-2 py-0.5 rounded text-xs font-medium ${tagColors[tag] ?? 'bg-gray-100 text-gray-600 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]'}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-[var(--color-text-muted)] dark:hover:bg-[var(--color-surface-muted)] transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Description */}
          <p className="text-gray-600 dark:text-[var(--color-text-muted)] leading-relaxed">{group.description}</p>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Contribution</p>
              <p className="text-lg font-bold text-blue-700">${group.contributionAmount}</p>
              <p className="text-xs text-blue-500">{group.frequency}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">Duration</p>
              <p className="text-lg font-bold text-purple-700">{group.duration}</p>
              <p className="text-xs text-purple-500">cycles</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Total Raised</p>
              <p className="text-lg font-bold text-green-700">${group.totalRaised.toLocaleString()}</p>
              <p className="text-xs text-green-500">all time</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-xs text-orange-600 font-medium uppercase tracking-wide mb-1">Cycle Length</p>
              <p className="text-lg font-bold text-orange-700">{group.cycleLength}</p>
              <p className="text-xs text-orange-500">days</p>
            </div>
          </div>

          {/* Member Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-[var(--color-text)]">Members</span>
              <span className={`text-sm font-bold ${isFull ? 'text-red-600 dark:text-[var(--color-danger)]' : 'text-gray-900 dark:text-[var(--color-text)]'}`}>
                {group.currentMembers} / {group.maxMembers}
                {isFull && <span className="ml-1 text-xs font-semibold text-red-500 dark:text-[var(--color-danger)]">(Full)</span>}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden dark:bg-[var(--color-border)]">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : fillPercent >= 80 ? 'bg-orange-500' : 'bg-blue-600'}`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-[var(--color-text-muted)]">
              {isFull ? 'Group is full' : `${group.maxMembers - group.currentMembers} spot${group.maxMembers - group.currentMembers !== 1 ? 's' : ''} remaining`}
            </p>
          </div>

          {/* Creator Info */}
          <div className="bg-gray-50 rounded-xl p-4 dark:bg-[var(--color-surface-muted)] dark:border dark:border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-[var(--color-text)] mb-3">Creator</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {group.creator.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-mono text-gray-700 dark:text-[var(--color-text)] truncate">{shortAddress(group.creator)}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <StarRating value={group.creatorReputation} />
                  <span className="text-xs text-gray-500 dark:text-[var(--color-text-muted)]">
                    {group.creatorGroupsCount} group{group.creatorGroupsCount !== 1 ? 's' : ''} created
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Group Statistics */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-[var(--color-text)] mb-3">Group Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 dark:bg-[var(--color-surface)] dark:border-[var(--color-border)]">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-[var(--color-text-muted)]">Active Members</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-[var(--color-text)]">{group.currentMembers}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 dark:bg-[var(--color-surface)] dark:border-[var(--color-border)]">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-[var(--color-text-muted)]">Total Contributions</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-[var(--color-text)]">${group.totalContributions.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 dark:bg-[var(--color-surface)] dark:border-[var(--color-border)]">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-[var(--color-text-muted)]">Next Payout</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-[var(--color-text)]">{group.nextPayoutDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 dark:bg-[var(--color-surface)] dark:border-[var(--color-border)]">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-[var(--color-text-muted)]">Popularity</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-[var(--color-text)]">{group.popularity}/100</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {group.isJoined ? (
              <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 dark:bg-[var(--color-surface-muted)] dark:border-[var(--color-border)] dark:text-[var(--color-success)] font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Joined
              </div>
            ) : (
              <button
                onClick={handleJoin}
                disabled={isFull || group.status !== 'active'}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {isFull ? 'Group Full' : group.status !== 'active' ? 'Not Accepting Members' : 'Join Group'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

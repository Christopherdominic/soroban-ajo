// Issue #22: Create group card component
// Complexity: Trivial (100 pts)
// Status: Enhanced with premium styling, gradients, and animations
// TASK: Issue #62 Added Skeleton Loading State

import React from 'react'

interface GroupCardProps {
  groupId?: string
  groupName?: string
  memberCount?: number
  maxMembers?: number
  nextPayout?: string
  totalContributions?: number
  status?: 'active' | 'completed' | 'paused'
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive' | 'compact' | 'spacious'
  onClick?: () => void
  isLoading?: boolean
}

export const GroupCard: React.FC<GroupCardProps> = ({
  groupName = '',
  memberCount = 0,
  maxMembers = 1,
  nextPayout = '',
  totalContributions = 0,
  status = 'active',
  variant = 'interactive',
  onClick,
  isLoading = false,
}) => {
  const statusConfig = {
    active: {
      badge: 'badge badge-active',
      label: 'Active',
      dot: 'bg-emerald-500',
      accent: 'from-emerald-400 to-teal-500',
    },
    completed: {
      badge: 'badge badge-completed',
      label: 'Completed',
      dot: 'bg-primary-500',
      accent: 'from-primary-400 to-accent-500',
    },
    paused: {
      badge: 'badge badge-paused',
      label: 'Paused',
      dot: 'bg-amber-500',
      accent: 'from-amber-400 to-orange-500',
    },
  }

  const cardVariants = {
    default: 'card-default',
    elevated: 'card-elevated',
    outlined: 'card-outlined',
    interactive: 'card-interactive',
    compact: 'card-compact',
    spacious: 'card-spacious',
  }

  const cardClass = cardVariants[variant]
  const isCompact = variant === 'compact'
  const isSpaciousOrElevated = variant === 'spacious' || variant === 'elevated'
  const memberPercent = Math.round((memberCount / maxMembers) * 100)
  const config = statusConfig[status]

  // --- SKELETON LOADING STATE ---
  if (isLoading) {
    return (
      <div className={`${cardClass} pointer-events-none relative overflow-hidden`}>
        {/* Top Accent Bar Skeleton */}
        <div className="absolute top-0 left-0 right-0 h-1 skeleton" />

        {/* Header Skeleton */}
        <div className={`flex justify-between items-start ${isCompact ? 'mb-3' : 'mb-5'} pt-1`}>
          <div className={`skeleton rounded-lg ${isCompact ? 'h-5 w-1/2' : isSpaciousOrElevated ? 'h-7 w-2/3' : 'h-6 w-1/2'}`} />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>

        {/* Body Skeleton */}
        <div className={`${isCompact ? 'space-y-3' : 'space-y-4'}`}>
          <div className="flex justify-between items-center">
            <div className="skeleton h-3.5 w-14 rounded" />
            <div className="skeleton h-3.5 w-10 rounded" />
          </div>

          <div className="progress-bar">
            <div className="skeleton h-full w-full rounded-full" />
          </div>

          <div className="flex justify-between items-center">
            <div className="skeleton h-3.5 w-24 rounded" />
            <div className="skeleton h-3.5 w-16 rounded" />
          </div>

          <div className="flex justify-between items-center">
            <div className="skeleton h-3.5 w-20 rounded" />
            <div className="skeleton h-3.5 w-24 rounded" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className={`skeleton w-full rounded-xl ${isCompact ? 'mt-4 h-9' : 'mt-5 h-10'}`} />
      </div>
    )
  }

  // --- RENDER STATE ---
  return (
    <div
      className={`${cardClass} relative overflow-hidden group`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {/* Top Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.accent} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Header */}
      <div className={`flex justify-between items-start ${isCompact ? 'mb-3' : 'mb-5'} pt-1`}>
        <h3 className={`font-bold text-surface-900 leading-tight ${isCompact ? 'text-base' : isSpaciousOrElevated ? 'text-xl' : 'text-lg'}`}>
          {groupName}
        </h3>
        <span className={config.badge}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      </div>

      {/* Body */}
      <div className={`${isCompact ? 'space-y-3' : 'space-y-4'}`}>
        {/* Members */}
        <div className="flex justify-between items-center">
          <span className={`text-surface-500 font-medium ${isCompact ? 'text-xs' : 'text-sm'}`}>Members</span>
          <span className={`font-semibold text-surface-800 ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {memberCount}/{maxMembers}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${memberPercent}%` }}
          />
        </div>

        {/* Contributions */}
        <div className={`flex justify-between items-center ${isCompact ? 'text-xs' : 'text-sm'}`}>
          <span className="text-surface-500 font-medium">Contributed</span>
          <span className="font-bold text-surface-900">${totalContributions.toFixed(2)}</span>
        </div>

        {/* Next Payout */}
        <div className={`flex justify-between items-center ${isCompact ? 'text-xs' : 'text-sm'}`}>
          <span className="text-surface-500 font-medium">Next Payout</span>
          <span className="font-semibold text-primary-600">{nextPayout}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        className={`btn-primary w-full ${isCompact ? 'mt-4 py-2 text-xs' : 'mt-5 py-2.5 text-sm'}`}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
      >
        View Details
        <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
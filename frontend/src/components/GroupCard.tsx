// Issue #22: Create group card component
// Complexity: Trivial (100 pts)
// Status: Enhanced with variants and consistent styling

import React from 'react'

interface GroupCardProps {
  groupId: string
  groupName: string
  memberCount: number
  maxMembers: number
  nextPayout: string
  totalContributions: number
  status: 'active' | 'completed' | 'paused'
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive' | 'compact' | 'spacious'
  onClick?: () => void
}

export const GroupCard: React.FC<GroupCardProps> = ({
  groupName,
  memberCount,
  maxMembers,
  nextPayout,
  totalContributions,
  status,
  variant = 'interactive',
  onClick,
}) => {
  const statusColors = {
    active: 'theme-status-active',
    completed: 'theme-status-completed',
    paused: 'theme-status-paused',
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
  const progressPercent = maxMembers > 0 ? (memberCount / maxMembers) * 100 : 0
  const progressWidthClass =
    progressPercent >= 100
      ? 'w-full'
      : progressPercent >= 75
      ? 'w-3/4'
      : progressPercent >= 50
      ? 'w-1/2'
      : progressPercent >= 25
      ? 'w-1/4'
      : progressPercent > 0
      ? 'w-[10%]'
      : 'w-0'

  return (
    <div 
      className={cardClass}
      onClick={onClick}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className={`flex justify-between items-start ${isCompact ? 'mb-3' : 'mb-4'}`}>
        <h3 className={`font-bold ${isCompact ? 'text-lg' : isSpaciousOrElevated ? 'text-2xl' : 'text-xl'}`}>
          {groupName}
        </h3>
        <span 
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className={`card-body ${isCompact ? 'space-y-2' : 'space-y-3'}`}>
        <div className="flex justify-between items-center">
          <span className={`theme-muted ${isCompact ? 'text-sm' : 'text-base'}`}>Members</span>
          <span className={`font-semibold ${isCompact ? 'text-sm' : 'text-base'}`}>
            {memberCount}/{maxMembers}
          </span>
        </div>

        <div className="w-full rounded-full h-2 overflow-hidden bg-[color:var(--color-border)]">
          <div
            className={`h-2 rounded-full transition-all duration-300 ease-out bg-[color:var(--color-primary)] ${progressWidthClass}`}
          />
        </div>

        <div className={`flex justify-between items-center ${isCompact ? 'text-xs' : 'text-sm'}`}>
          <span className="theme-muted">Total Contributed</span>
          <span className="font-semibold">${totalContributions.toFixed(2)}</span>
        </div>

        <div className={`flex justify-between items-center ${isCompact ? 'text-xs' : 'text-sm'}`}>
          <span className="theme-muted">Next Payout</span>
          <span className="theme-primary font-semibold">{nextPayout}</span>
        </div>
      </div>

      <button 
        className={`w-full theme-btn font-semibold transition-colors duration-200 shadow-sm hover:shadow-md ${
          isCompact ? 'mt-3 py-1.5 text-sm' : 'mt-4 py-2 text-base'
        }`}
        onClick={(e) => {
          e.stopPropagation()
          // Handle view details action
        }}
      >
        View Details
      </button>
    </div>
  )
}

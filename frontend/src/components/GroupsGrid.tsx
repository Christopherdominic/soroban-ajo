import React from 'react'
import { Group } from '@/types'
import { GroupCard } from './GroupCard'

interface GroupsGridProps {
  groups?: Group[]
  isLoading?: boolean
  onGroupClick?: (groupId: string) => void
}

export const GroupsGrid: React.FC<GroupsGridProps> = ({
  groups,
  isLoading = false,
  onGroupClick
}) => {
  const list = groups ?? []
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
            <GroupCard isLoading />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((group, i) => (
        <div key={group.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
          <GroupCard
            groupId={group.id}
            groupName={group.name}
            memberCount={group.currentMembers}
            maxMembers={group.maxMembers}
            nextPayout={group.nextPayoutDate}
            totalContributions={group.totalContributions}
            status={group.status}
            onClick={() => onGroupClick?.(group.id)}
          />
        </div>
      ))}
    </div>
  )
}

// Issue #28: Build dashboard with groups list
// Complexity: Medium (150 pts)
// Status: Placeholder

import React from 'react'
import { GroupCard } from './GroupCard'

interface GroupSummary {
  id: string
  name: string
  memberCount: number
  maxMembers: number
  nextPayout: string
  totalContributions: number
  status: 'active' | 'completed' | 'paused'
}

interface GroupsListProps {
  groups?: GroupSummary[]
  onSelectGroup?: (groupId: string) => void
}

export const GroupsList: React.FC<GroupsListProps> = ({ groups = [], onSelectGroup }) => {
  // TODO: Fetch groups from smart contract
  // TODO: Add loading and empty states
  // TODO: Add filtering (active/completed)

  const sampleGroups: GroupSummary[] = [
    {
      id: 'group-1',
      name: 'Market Women Ajo',
      memberCount: 8,
      maxMembers: 10,
      nextPayout: 'Feb 28, 2026',
      totalContributions: 4000,
      status: 'active',
    },
    {
      id: 'group-2',
      name: 'Tech Team Savings',
      memberCount: 5,
      maxMembers: 5,
      nextPayout: 'Mar 5, 2026',
      totalContributions: 2500,
      status: 'active',
    },
    {
      id: 'group-3',
      name: 'Community Fund',
      memberCount: 10,
      maxMembers: 10,
      nextPayout: 'Completed',
      totalContributions: 5000,
      status: 'completed',
    },
  ]

  const displayGroups = groups.length > 0 ? groups : sampleGroups

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Groups</h2>
        <button className="text-blue-600 hover:text-blue-700 font-semibold">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayGroups.map((group) => (
          <div
            key={group.id}
            onClick={() => onSelectGroup?.(group.id)}
            className="cursor-pointer"
          >
            <GroupCard
              groupId={group.id}
              groupName={group.name}
              memberCount={group.memberCount}
              maxMembers={group.maxMembers}
              nextPayout={group.nextPayout}
              totalContributions={group.totalContributions}
              status={group.status}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

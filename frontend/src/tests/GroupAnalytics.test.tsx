import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GroupAnalytics } from '@/components/GroupAnalytics'
import type { Group, Member } from '@/types'

const testGroup: Group = {
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

const testMembers: Member[] = [
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

describe('GroupAnalytics', () => {
  it('renders all acceptance-criteria analytics sections', () => {
    render(<GroupAnalytics group={testGroup} members={testMembers} />)

    expect(screen.getByText('Total Contributions')).toBeInTheDocument()
    expect(screen.getByText('Member Contribution Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Payout Schedule')).toBeInTheDocument()
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument()
  })

  it('renders loading state when isLoading is true', () => {
    const { container } = render(<GroupAnalytics group={testGroup} members={testMembers} isLoading />)

    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull()
  })

  it('renders empty state when there is no analytics data', () => {
    render(
      <GroupAnalytics
        group={{ ...testGroup, currentMembers: 0, totalContributions: 0 }}
        members={[]}
      />
    )

    expect(screen.getByText('No analytics data yet')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { GroupsGrid } from '@/components/GroupsGrid'
import { Group } from '@/types'

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Alpha Group',
    description: 'First group',
    creator: 'creator1',
    cycleLength: 30,
    contributionAmount: 100,
    maxMembers: 10,
    currentMembers: 5,
    totalContributions: 500,
    status: 'active',
    createdAt: '2026-01-01',
    nextPayoutDate: '2026-03-01',
  },
  {
    id: '2',
    name: 'Beta Group',
    description: 'Second group',
    creator: 'creator2',
    cycleLength: 30,
    contributionAmount: 200,
    maxMembers: 8,
    currentMembers: 8,
    totalContributions: 1600,
    status: 'completed',
    createdAt: '2026-01-15',
    nextPayoutDate: '2026-02-15',
  },
  {
    id: '3',
    name: 'Gamma Group',
    description: 'Third group',
    creator: 'creator3',
    cycleLength: 30,
    contributionAmount: 150,
    maxMembers: 6,
    currentMembers: 3,
    totalContributions: 450,
    status: 'active',
    createdAt: '2026-02-01',
    nextPayoutDate: '2026-04-01',
  },
]

// Mock GroupCard component
jest.mock('@/components/GroupCard', () => ({
  GroupCard: ({ groupName, isLoading, onClick }: any) => (
    <div data-testid="group-card" onClick={onClick}>
      {isLoading ? 'Loading...' : groupName}
    </div>
  ),
}))

describe('GroupsGrid', () => {
  const mockOnGroupClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state with skeleton cards', () => {
    render(<GroupsGrid groups={[]} isLoading={true} />)

    const cards = screen.getAllByTestId('group-card')
    expect(cards).toHaveLength(6)
    expect(screen.getAllByText('Loading...')).toHaveLength(6)
  })

  it('renders groups in grid layout', () => {
    render(<GroupsGrid groups={mockGroups} onGroupClick={mockOnGroupClick} />)

    expect(screen.getByText('Alpha Group')).toBeInTheDocument()
    expect(screen.getByText('Beta Group')).toBeInTheDocument()
    expect(screen.getByText('Gamma Group')).toBeInTheDocument()
  })

  it('renders correct number of group cards', () => {
    render(<GroupsGrid groups={mockGroups} onGroupClick={mockOnGroupClick} />)

    const cards = screen.getAllByTestId('group-card')
    expect(cards).toHaveLength(3)
  })

  it('applies grid layout classes', () => {
    const { container } = render(
      <GroupsGrid groups={mockGroups} onGroupClick={mockOnGroupClick} />
    )

    const grid = container.firstChild
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')
  })

  it('handles empty groups array', () => {
    const { container } = render(<GroupsGrid groups={[]} />)

    const grid = container.firstChild
    expect(grid?.childNodes).toHaveLength(0)
  })
})

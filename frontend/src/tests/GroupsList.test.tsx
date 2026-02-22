import { render, screen, fireEvent } from '@testing-library/react'
import { GroupsList } from '@/components/GroupsList'
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
]

describe('GroupsList', () => {
  const mockOnSort = jest.fn()
  const mockOnGroupClick = jest.fn()
  const mockOnJoinGroup = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state', () => {
    render(
      <GroupsList
        groups={[]}
        isLoading={true}
        sortField="name"
        sortDirection="asc"
        onSort={mockOnSort}
      />
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(6)
  })

  it('renders groups in table format', () => {
    render(
      <GroupsList
        groups={mockGroups}
        sortField="name"
        sortDirection="asc"
        onSort={mockOnSort}
        onGroupClick={mockOnGroupClick}
        onJoinGroup={mockOnJoinGroup}
      />
    )

    expect(screen.getByText('Alpha Group')).toBeInTheDocument()
    expect(screen.getByText('Beta Group')).toBeInTheDocument()
    expect(screen.getByText('5/10')).toBeInTheDocument()
    expect(screen.getByText('8/8')).toBeInTheDocument()
  })

  it('calls onSort when column header is clicked', () => {
    render(
      <GroupsList
        groups={mockGroups}
        sortField="name"
        sortDirection="asc"
        onSort={mockOnSort}
      />
    )

    const nameHeader = screen.getByText('Name').closest('.sort-header') || screen.getByText('Name').closest('div')
    fireEvent.click(nameHeader!)

    expect(mockOnSort).toHaveBeenCalledWith('name')
  })

  it('displays correct sort indicator', () => {
    const { rerender } = render(
      <GroupsList
        groups={mockGroups}
        sortField="name"
        sortDirection="asc"
        onSort={mockOnSort}
      />
    )

    expect(screen.getByText('↑')).toBeInTheDocument()

    rerender(
      <GroupsList
        groups={mockGroups}
        sortField="name"
        sortDirection="desc"
        onSort={mockOnSort}
      />
    )

    expect(screen.getByText('↓')).toBeInTheDocument()
  })

  it('calls onGroupClick when row is clicked', () => {
    render(
      <GroupsList
        groups={mockGroups}
        sortField="name"
        sortDirection="asc"
        onSort={mockOnSort}
        onGroupClick={mockOnGroupClick}
      />
    )

    const row = screen.getByText('Alpha Group').closest('tr')
    fireEvent.click(row!)

    expect(mockOnGroupClick).toHaveBeenCalledWith('1')
  })

  it('calls onJoinGroup when join button is clicked', () => {
    render(
      <GroupsList
        groups={mockGroups}
        sortField="name"
        sortDirection="asc"
        onSort={mockOnSort}
        onJoinGroup={mockOnJoinGroup}
      />
    )

    const joinButtons = screen.getAllByText('Join')
    fireEvent.click(joinButtons[0])

    expect(mockOnJoinGroup).toHaveBeenCalledWith('1')
    expect(mockOnGroupClick).not.toHaveBeenCalled()
  })

  it('displays status badges', () => {
    render(
      <GroupsList
        groups={mockGroups}
        sortField="name"
        sortDirection="asc"
        onSort={mockOnSort}
      />
    )

    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('formats dates correctly', () => {
    render(
      <GroupsList
        groups={mockGroups}
        sortField="name"
        sortDirection="asc"
        onSort={mockOnSort}
      />
    )

    // Dates are formatted via toLocaleDateString() which may vary by locale
    const date1 = new Date('2026-03-01').toLocaleDateString()
    const date2 = new Date('2026-02-15').toLocaleDateString()
    expect(screen.getByText(date1)).toBeInTheDocument()
    expect(screen.getByText(date2)).toBeInTheDocument()
  })

  it('formats contributions as currency', () => {
    render(
      <GroupsList
        groups={mockGroups}
        sortField="name"
        sortDirection="asc"
        onSort={mockOnSort}
      />
    )

    expect(screen.getByText('$500.00')).toBeInTheDocument()
    expect(screen.getByText('$1600.00')).toBeInTheDocument()
  })
})

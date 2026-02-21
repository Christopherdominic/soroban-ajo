import { render, screen, fireEvent } from '@testing-library/react'
import Dashboard from '@/app/dashboard/Dashboard'
import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'

// Mock dependencies
jest.mock('@/hooks/useAuth')
jest.mock('@/hooks/useDashboard')
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

const mockUseDashboard = {
  viewMode: 'grid' as const,
  setViewMode: jest.fn(),
  filterStatus: 'all' as const,
  setFilterStatus: jest.fn(),
  searchQuery: '',
  setSearchQuery: jest.fn(),
  sortField: 'name' as const,
  sortDirection: 'asc' as const,
  toggleSort: jest.fn(),
  currentPage: 1,
  setCurrentPage: jest.fn(),
  totalPages: 1,
  groups: [
    {
      id: '1',
      name: 'Test Group',
      creator: 'creator1',
      cycleLength: 30,
      contributionAmount: 100,
      maxMembers: 10,
      currentMembers: 5,
      totalContributions: 500,
      status: 'active' as const,
      createdAt: '2026-01-01',
      nextPayoutDate: '2026-03-01',
    },
  ],
  totalGroups: 1,
  isLoading: false,
}

describe('Dashboard', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      address: 'test-address',
    })
      ; (useDashboard as jest.Mock).mockReturnValue(mockUseDashboard)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders dashboard header', () => {
    render(<Dashboard />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Manage your savings groups')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<Dashboard />)

    const searchInput = screen.getByPlaceholderText('Search groups...')
    expect(searchInput).toBeInTheDocument()
  })

  it('calls setSearchQuery when typing in search', () => {
    render(<Dashboard />)

    const searchInput = screen.getByPlaceholderText('Search groups...')
    fireEvent.change(searchInput, { target: { value: 'test' } })

    expect(mockUseDashboard.setSearchQuery).toHaveBeenCalledWith('test')
  })

  it('renders view mode toggle buttons', () => {
    render(<Dashboard />)

    expect(screen.getByText('Grid')).toBeInTheDocument()
    expect(screen.getByText('List')).toBeInTheDocument()
  })

  it('toggles view mode when buttons are clicked', () => {
    render(<Dashboard />)

    const listButton = screen.getByText('List')
    fireEvent.click(listButton)

    expect(mockUseDashboard.setViewMode).toHaveBeenCalledWith('list')
  })

  it('renders filter buttons', () => {
    render(<Dashboard />)

    expect(screen.getByText('All')).toBeInTheDocument()
    // 'Active' appears in both filter button and group card badge
    expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Paused')).toBeInTheDocument()
  })

  it('applies filter when filter button is clicked', () => {
    render(<Dashboard />)

    // 'Active' appears in both filter button and card badge; find the filter one
    const activeButtons = screen.getAllByText('Active')
    const filterButton = activeButtons.find(el =>
      el.classList.contains('filter-btn-inactive') || el.classList.contains('filter-btn-active')
    ) || activeButtons[0]
    fireEvent.click(filterButton)

    expect(mockUseDashboard.setFilterStatus).toHaveBeenCalledWith('active')
  })

  it('displays results count', () => {
    render(<Dashboard />)

    expect(screen.getByText('Showing 1 of 1 groups')).toBeInTheDocument()
  })

  it('renders grid view by default', () => {
    render(<Dashboard />)

    // GroupsGrid should be rendered
    expect(screen.getByText('Test Group')).toBeInTheDocument()
  })

  it('renders list view when viewMode is list', () => {
    ; (useDashboard as jest.Mock).mockReturnValue({
      ...mockUseDashboard,
      viewMode: 'list',
    })

    render(<Dashboard />)

    // GroupsList should be rendered with table
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('shows empty state when no groups', () => {
    ; (useDashboard as jest.Mock).mockReturnValue({
      ...mockUseDashboard,
      groups: [],
      totalGroups: 0,
    })

    render(<Dashboard />)

    expect(screen.getByText('No groups found')).toBeInTheDocument()
    expect(
      screen.getByText('Get started by creating or joining a savings group')
    ).toBeInTheDocument()
  })

  it('shows create button in empty state', () => {
    ; (useDashboard as jest.Mock).mockReturnValue({
      ...mockUseDashboard,
      groups: [],
      totalGroups: 0,
    })

    render(<Dashboard />)

    expect(screen.getByText('Create Your First Group')).toBeInTheDocument()
  })

  it('shows adjusted empty state message when filters are active', () => {
    ; (useDashboard as jest.Mock).mockReturnValue({
      ...mockUseDashboard,
      groups: [],
      totalGroups: 0,
      searchQuery: 'test',
    })

    render(<Dashboard />)

    expect(
      screen.getByText('Try adjusting your filters or search query')
    ).toBeInTheDocument()
  })

  it('renders pagination when multiple pages', () => {
    ; (useDashboard as jest.Mock).mockReturnValue({
      ...mockUseDashboard,
      totalPages: 3,
      currentPage: 2,
    })

    render(<Dashboard />)

    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not render pagination for single page', () => {
    render(<Dashboard />)

    expect(screen.queryByText('Previous')).not.toBeInTheDocument()
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
  })

  it('handles pagination navigation', () => {
    ; (useDashboard as jest.Mock).mockReturnValue({
      ...mockUseDashboard,
      totalPages: 3,
      currentPage: 1,
    })

    render(<Dashboard />)

    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    expect(mockUseDashboard.setCurrentPage).toHaveBeenCalled()
  })

  it('disables previous button on first page', () => {
    ; (useDashboard as jest.Mock).mockReturnValue({
      ...mockUseDashboard,
      totalPages: 3,
      currentPage: 1,
    })

    render(<Dashboard />)

    const prevButton = screen.getByText('Previous').closest('button')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    ; (useDashboard as jest.Mock).mockReturnValue({
      ...mockUseDashboard,
      totalPages: 3,
      currentPage: 3,
    })

    render(<Dashboard />)

    const nextButton = screen.getByText('Next').closest('button')
    expect(nextButton).toBeDisabled()
  })

  it('shows loading state', () => {
    ; (useDashboard as jest.Mock).mockReturnValue({
      ...mockUseDashboard,
      isLoading: true,
      groups: [],
    })

    render(<Dashboard />)

    // Should not show results count when loading
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument()
  })

  it('highlights active view mode button', () => {
    render(<Dashboard />)

    const gridButton = screen.getByText('Grid').closest('button')
    const listButton = screen.getByText('List').closest('button')

    expect(gridButton).toHaveClass('view-toggle-btn-active')
    expect(listButton).toHaveClass('view-toggle-btn-inactive')
  })

  it('highlights active filter button', () => {
    render(<Dashboard />)

    const allButton = screen.getByText('All')
    // 'Active' appears in both filter button and card badge
    const activeButtons = screen.getAllByText('Active')
    const filterButton = activeButtons.find(el =>
      el.classList.contains('filter-btn-inactive') || el.classList.contains('filter-btn-active')
    ) || activeButtons[0]

    expect(allButton).toHaveClass('filter-btn-active')
    expect(filterButton).toHaveClass('filter-btn-inactive')
  })
})

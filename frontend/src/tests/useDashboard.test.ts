import { renderHook, act } from '@testing-library/react'
import { useDashboard } from '@/hooks/useDashboard'
import { useGroups } from '@/hooks/useContractData'
import { Group } from '@/types'

// Mock the useGroups hook
jest.mock('@/hooks/useContractData', () => ({
  useGroups: jest.fn(),
}))

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
  {
    id: '4',
    name: 'Delta Group',
    description: 'Fourth group',
    creator: 'creator4',
    cycleLength: 30,
    contributionAmount: 300,
    maxMembers: 12,
    currentMembers: 10,
    totalContributions: 3000,
    status: 'paused',
    createdAt: '2026-01-20',
    nextPayoutDate: '2026-03-20',
  },
]

describe('useDashboard', () => {
  beforeEach(() => {
    (useGroups as jest.Mock).mockReturnValue({
      data: mockGroups,
      isLoading: false,
      error: null,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Filtering', () => {
    it('should filter groups by status - active', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      act(() => {
        result.current.setFilterStatus('active')
      })

      expect(result.current.groups).toHaveLength(2)
      expect(result.current.groups.every(g => g.status === 'active')).toBe(true)
    })

    it('should filter groups by status - completed', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      act(() => {
        result.current.setFilterStatus('completed')
      })

      expect(result.current.groups).toHaveLength(1)
      expect(result.current.groups[0].status).toBe('completed')
    })

    it('should filter groups by status - paused', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      act(() => {
        result.current.setFilterStatus('paused')
      })

      expect(result.current.groups).toHaveLength(1)
      expect(result.current.groups[0].status).toBe('paused')
    })

    it('should show all groups when filter is "all"', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      act(() => {
        result.current.setFilterStatus('all')
      })

      expect(result.current.totalGroups).toBe(4)
    })
  })

  describe('Search', () => {
    it('should filter groups by search query', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      act(() => {
        result.current.setSearchQuery('alpha')
      })

      expect(result.current.groups).toHaveLength(1)
      expect(result.current.groups[0].name).toBe('Alpha Group')
    })

    it('should be case insensitive', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      act(() => {
        result.current.setSearchQuery('BETA')
      })

      expect(result.current.groups).toHaveLength(1)
      expect(result.current.groups[0].name).toBe('Beta Group')
    })

    it('should return empty array for no matches', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      act(() => {
        result.current.setSearchQuery('nonexistent')
      })

      expect(result.current.groups).toHaveLength(0)
    })
  })

  describe('Sorting', () => {
    it('should sort by name ascending', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      // Hook initializes with sortField='name' and sortDirection='asc'
      // so first toggleSort('name') flips to desc. Test the initial asc state.
      expect(result.current.sortField).toBe('name')
      expect(result.current.sortDirection).toBe('asc')
      expect(result.current.groups[0].name).toBe('Alpha Group')
    })

    it('should sort by name descending', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      // Since hook starts with name asc, one toggle flips to desc
      act(() => {
        result.current.toggleSort('name')
      })

      expect(result.current.sortDirection).toBe('desc')
      expect(result.current.groups[0].name).toBe('Gamma Group')
    })

    it('should sort by members ascending', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      act(() => {
        result.current.toggleSort('members')
      })

      expect(result.current.groups[0].currentMembers).toBe(3)
      expect(result.current.groups[result.current.groups.length - 1].currentMembers).toBe(10)
    })

    it('should sort by contributions descending', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      // Switch to contributions field (starts asc), then toggle to desc
      act(() => {
        result.current.toggleSort('contributions')
      })

      // Now on contributions asc, toggle once more for desc
      act(() => {
        result.current.toggleSort('contributions')
      })

      expect(result.current.groups[0].totalContributions).toBe(3000)
      expect(result.current.groups[result.current.groups.length - 1].totalContributions).toBe(450)
    })

    it('should sort by next payout date', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      act(() => {
        result.current.toggleSort('nextPayout')
      })

      const dates = result.current.groups.map(g => new Date(g.nextPayoutDate).getTime())
      expect(dates).toEqual([...dates].sort((a, b) => a - b))
    })
  })

  describe('Combined Filters', () => {
    it('should apply both status filter and search', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      act(() => {
        result.current.setFilterStatus('active')
        result.current.setSearchQuery('gamma')
      })

      expect(result.current.groups).toHaveLength(1)
      expect(result.current.groups[0].name).toBe('Gamma Group')
      expect(result.current.groups[0].status).toBe('active')
    })

    it('should apply filter, search, and sort together', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      act(() => {
        result.current.setFilterStatus('active')
        result.current.setSearchQuery('group')
        result.current.toggleSort('contributions')
      })

      expect(result.current.groups).toHaveLength(2)
      expect(result.current.groups[0].totalContributions).toBeLessThan(
        result.current.groups[1].totalContributions
      )
    })
  })

  describe('Pagination', () => {
    it('should paginate results correctly', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      // With 4 groups and 9 per page, should have 1 page
      expect(result.current.totalPages).toBe(1)
      expect(result.current.currentPage).toBe(1)
    })

    it('should handle page changes', () => {
      // Mock more groups to test pagination
      const manyGroups = Array.from({ length: 20 }, (_, i) => ({
        ...mockGroups[0],
        id: `group-${i}`,
        name: `Group ${i}`,
      }))

        ; (useGroups as jest.Mock).mockReturnValue({
          data: manyGroups,
          isLoading: false,
          error: null,
        })

      const { result } = renderHook(() => useDashboard('user1'))

      expect(result.current.totalPages).toBe(3) // 20 groups / 9 per page = 3 pages

      act(() => {
        result.current.setCurrentPage(2)
      })

      expect(result.current.currentPage).toBe(2)
      expect(result.current.groups).toHaveLength(9)
    })
  })

  describe('View Mode', () => {
    it('should toggle between grid and list view', () => {
      const { result } = renderHook(() => useDashboard('user1'))

      expect(result.current.viewMode).toBe('grid')

      act(() => {
        result.current.setViewMode('list')
      })

      expect(result.current.viewMode).toBe('list')

      act(() => {
        result.current.setViewMode('grid')
      })

      expect(result.current.viewMode).toBe('grid')
    })
  })

  describe('Loading State', () => {
    it('should handle loading state', () => {
      ; (useGroups as jest.Mock).mockReturnValue({
        data: [],
        isLoading: true,
        error: null,
      })

      const { result } = renderHook(() => useDashboard('user1'))

      expect(result.current.isLoading).toBe(true)
      expect(result.current.groups).toHaveLength(0)
    })
  })

  describe('Error State', () => {
    it('should handle error state', () => {
      const mockError = new Error('Failed to fetch groups')
        ; (useGroups as jest.Mock).mockReturnValue({
          data: [],
          isLoading: false,
          error: mockError,
        })

      const { result } = renderHook(() => useDashboard('user1'))

      expect(result.current.error).toBe(mockError)
    })
  })
})

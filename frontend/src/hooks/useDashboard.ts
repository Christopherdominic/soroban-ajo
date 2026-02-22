import { useState, useMemo } from 'react'
import { useGroups } from './useContractData'

export type ViewMode = 'grid' | 'list'
export type FilterStatus = 'all' | 'active' | 'completed' | 'paused'
export type SortField = 'name' | 'members' | 'contributions' | 'nextPayout'
export type SortDirection = 'asc' | 'desc'

const ITEMS_PER_PAGE = 9

export const useDashboard = (userId?: string) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: groups = [], isLoading, error } = useGroups(userId)

  const filteredAndSortedGroups = useMemo(() => {
    let result = [...groups]

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(g => g.status === filterStatus)
    }

    // Search by name
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(g => g.name.toLowerCase().includes(query))
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'members':
          comparison = a.currentMembers - b.currentMembers
          break
        case 'contributions':
          comparison = a.totalContributions - b.totalContributions
          break
        case 'nextPayout':
          comparison = new Date(a.nextPayoutDate).getTime() - new Date(b.nextPayoutDate).getTime()
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [groups, filterStatus, searchQuery, sortField, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedGroups.length / ITEMS_PER_PAGE)
  const paginatedGroups = filteredAndSortedGroups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return {
    viewMode,
    setViewMode,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    toggleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    groups: paginatedGroups,
    totalGroups: filteredAndSortedGroups.length,
    isLoading,
    error,
  }
}

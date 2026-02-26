// Issue #213: Implement User Groups Dashboard
// Added: createdGroups, joinedGroups, userAddress forwarding, dashboard stats

import { useState, useMemo, useCallback } from 'react'
import { useGroups } from './useContractData'
export type ViewMode = 'grid' | 'list'
export type FilterStatus = 'all' | 'active' | 'completed' | 'paused'
export type SortField = 'name' | 'members' | 'contributions' | 'nextPayout'
export type SortDirection = 'asc' | 'desc'

const ITEMS_PER_PAGE = 9

// ── Dashboard stats type ──────────────────────────────────────────────────────

export interface DashboardStats {
  totalSavingsXLM: number
  activeGroupsCount: number
  pendingContributionsCount: number
  upcomingPayouts: Array<{
    groupName: string
    daysUntil: number
    amountXLM: number
  }>
  createdGroupsCount: number
  joinedGroupsCount: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeDashboardStats(
  groups: Group[],
  userAddress: string
): DashboardStats {
  const createdGroups = groups.filter(g => g.creator === userAddress)
  const joinedGroups = groups.filter(g => g.creator !== userAddress)

  const totalSavingsXLM = groups.reduce((sum, g) => sum + g.totalContributions, 0)
  const activeGroups = groups.filter(g => g.status === 'active')

  const upcomingPayouts = activeGroups
    .filter(g => g.nextPayoutDate)
    .map(g => {
      const daysUntil = Math.max(
        0,
        Math.ceil(
          (new Date(g.nextPayoutDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
      return {
        groupName: g.name,
        daysUntil,
        amountXLM: g.contributionAmount * g.currentMembers,
      }
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 3)

  return {
    totalSavingsXLM,
    activeGroupsCount: activeGroups.length,
    pendingContributionsCount: activeGroups.length,
    upcomingPayouts,
    createdGroupsCount: createdGroups.length,
    joinedGroupsCount: joinedGroups.length,
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useDashboard = (userId?: string) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: groups = [], isLoading, error } = useGroups(userId)

  // ── Split into created vs joined ──────────────────────────────────────────
  const createdGroups = useMemo(
    () => (userId ? groups.filter(g => g.creator === userId) : []),
    [groups, userId]
  )

  const joinedGroups = useMemo(
    () => (userId ? groups.filter(g => g.creator !== userId) : groups),
    [groups, userId]
  )

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo<DashboardStats>(
    () =>
      userId
        ? computeDashboardStats(groups, userId)
        : {
            totalSavingsXLM: 0,
            activeGroupsCount: 0,
            pendingContributionsCount: 0,
            upcomingPayouts: [],
            createdGroupsCount: 0,
            joinedGroupsCount: 0,
          },
    [groups, userId]
  )

  // ── Filter + sort + paginate (existing logic, unchanged) ──────────────────
  const filteredAndSortedGroups = useMemo(() => {
    let result = [...groups]

    if (filterStatus !== 'all') {
      result = result.filter(g => g.status === filterStatus)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(g => g.name.toLowerCase().includes(query))
    }

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
          comparison =
            new Date(a.nextPayoutDate).getTime() -
            new Date(b.nextPayoutDate).getTime()
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [groups, filterStatus, searchQuery, sortField, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedGroups.length / ITEMS_PER_PAGE)

  const paginatedGroups = useMemo(
    () =>
      filteredAndSortedGroups.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredAndSortedGroups, currentPage]
  )

  const toggleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDirection(s => (s === 'asc' ? 'desc' : 'asc'))
        return prev
      }
      setSortDirection('asc')
      return field
    })
  }, [])

  return useMemo(
    () => ({
      // ── Existing returns (unchanged — Dashboard.tsx already uses these) ──
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
      // ── New returns for issue #213 ─────────────────────────────────────
      /** Groups the current user created */
      createdGroups,
      /** Groups the current user joined (not created) */
      joinedGroups,
      /** Aggregated dashboard stats */
      stats,
      /** The userId passed in — forwarded so Dashboard.tsx can pass to UserGroupsDashboard */
      userAddress: userId ?? '',
    }),
    [
      viewMode,
      filterStatus,
      searchQuery,
      sortField,
      sortDirection,
      toggleSort,
      currentPage,
      totalPages,
      paginatedGroups,
      filteredAndSortedGroups.length,
      isLoading,
      error,
      createdGroups,
      joinedGroups,
      stats,
      userId,
    ]
  )
}

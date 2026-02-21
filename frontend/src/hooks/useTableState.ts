// Custom hook for managing table state
// Features: Pagination, sorting, filtering, selection, density

import { useState, useMemo, useCallback } from 'react'
import { DensityOption, SortDirection } from '../components/DataTable'

export interface TableFilters {
  [key: string]: any
}

export interface UseTableStateOptions<T> {
  data: T[]
  initialPageSize?: number
  initialDensity?: DensityOption
  filterFn?: (row: T, filters: TableFilters) => boolean
}

export interface UseTableStateReturn<T> {
  // Pagination
  currentPage: number
  pageSize: number
  totalPages: number
  paginatedData: T[]
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  goToFirstPage: () => void
  goToLastPage: () => void
  goToNextPage: () => void
  goToPreviousPage: () => void

  // Filtering
  filters: TableFilters
  setFilters: (filters: TableFilters) => void
  updateFilter: (key: string, value: any) => void
  clearFilters: () => void
  filteredData: T[]

  // Selection
  selectedRows: Set<string>
  setSelectedRows: (rows: Set<string>) => void
  selectRow: (id: string) => void
  deselectRow: (id: string) => void
  toggleRow: (id: string) => void
  selectAll: () => void
  deselectAll: () => void
  isRowSelected: (id: string) => boolean

  // Density
  density: DensityOption
  setDensity: (density: DensityOption) => void

  // Sorting
  sortColumn: string | null
  sortDirection: SortDirection
  setSorting: (column: string | null, direction: SortDirection) => void

  // Computed
  totalItems: number
  hasFilters: boolean
  hasSelection: boolean
}

export function useTableState<T extends Record<string, any>>({
  data,
  initialPageSize = 10,
  initialDensity = 'comfortable',
  filterFn,
}: UseTableStateOptions<T>): UseTableStateReturn<T> {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // Filtering state
  const [filters, setFilters] = useState<TableFilters>({})

  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  // Density state
  const [density, setDensity] = useState<DensityOption>(initialDensity)

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Filter data
  const filteredData = useMemo(() => {
    if (!filterFn) return data

    return data.filter((row) => filterFn(row, filters))
  }, [data, filters, filterFn])

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredData.slice(startIndex, startIndex + pageSize)
  }, [filteredData, currentPage, pageSize])

  // Pagination actions
  const goToFirstPage = useCallback(() => setCurrentPage(1), [])
  const goToLastPage = useCallback(() => setCurrentPage(totalPages), [totalPages])
  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }, [totalPages])
  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }, [])

  // Filter actions
  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)
  }, [])

  // Selection actions
  const selectRow = useCallback((id: string) => {
    setSelectedRows((prev) => new Set(prev).add(id))
  }, [])

  const deselectRow = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }, [])

  const toggleRow = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedRows(new Set(filteredData.map((row) => row.id)))
  }, [filteredData])

  const deselectAll = useCallback(() => {
    setSelectedRows(new Set())
  }, [])

  const isRowSelected = useCallback(
    (id: string) => selectedRows.has(id),
    [selectedRows]
  )

  // Sorting actions
  const setSorting = useCallback((column: string | null, direction: SortDirection) => {
    setSortColumn(column)
    setSortDirection(direction)
  }, [])

  // Computed values
  const hasFilters = Object.keys(filters).some((key) => {
    const value = filters[key]
    return value !== undefined && value !== null && value !== '' && value !== 'all'
  })

  const hasSelection = selectedRows.size > 0

  // Reset page when page size changes
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }, [])

  return {
    // Pagination
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    setCurrentPage,
    setPageSize: handlePageSizeChange,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,

    // Filtering
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    filteredData,

    // Selection
    selectedRows,
    setSelectedRows,
    selectRow,
    deselectRow,
    toggleRow,
    selectAll,
    deselectAll,
    isRowSelected,

    // Density
    density,
    setDensity,

    // Sorting
    sortColumn,
    sortDirection,
    setSorting,

    // Computed
    totalItems: filteredData.length,
    hasFilters,
    hasSelection,
  }
}

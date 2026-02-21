// Polished DataTable component with sorting, filtering, and density options
// Features: Sortable columns, row selection, responsive design, loading/empty states

import React, { useState, useMemo, useCallback } from 'react'

export type DensityOption = 'compact' | 'comfortable' | 'spacious'
export type SortDirection = 'asc' | 'desc' | null

export interface Column<T> {
  id: string
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  density?: DensityOption
  onDensityChange?: (density: DensityOption) => void
  selectable?: boolean
  selectedRows?: Set<string>
  onSelectionChange?: (selectedIds: Set<string>) => void
  getRowId?: (row: T) => string
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  stickyHeader?: boolean
  maxHeight?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  density = 'comfortable',
  onDensityChange,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (row) => row.id,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  stickyHeader = false,
  maxHeight,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Density styles
  const densityStyles = {
    compact: {
      cell: 'px-3 py-1.5 text-sm',
      header: 'px-3 py-2 text-xs',
    },
    comfortable: {
      cell: 'px-4 py-3 text-sm',
      header: 'px-4 py-3 text-sm',
    },
    spacious: {
      cell: 'px-6 py-4 text-base',
      header: 'px-6 py-4 text-base',
    },
  }

  const currentDensity = densityStyles[density]

  // Handle sorting
  const handleSort = useCallback((columnId: string) => {
    const column = columns.find((col) => col.id === columnId)
    if (!column?.sortable) return

    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortDirection(null)
        setSortColumn(null)
      }
    } else {
      setSortColumn(columnId)
      setSortDirection('asc')
    }
  }, [sortColumn, sortDirection, columns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data

    const column = columns.find((col) => col.id === sortColumn)
    if (!column) return data

    return [...data].sort((a, b) => {
      let aValue: any
      let bValue: any

      if (typeof column.accessor === 'function') {
        aValue = column.accessor(a)
        bValue = column.accessor(b)
      } else {
        aValue = a[column.accessor]
        bValue = b[column.accessor]
      }

      // Handle different types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      // Default comparison
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [data, sortColumn, sortDirection, columns])

  // Handle row selection
  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === data.length) {
      onSelectionChange?.(new Set())
    } else {
      onSelectionChange?.(new Set(data.map(getRowId)))
    }
  }, [data, selectedRows, onSelectionChange, getRowId])

  const handleSelectRow = useCallback((rowId: string) => {
    const newSelection = new Set(selectedRows)
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId)
    } else {
      newSelection.add(rowId)
    }
    onSelectionChange?.(newSelection)
  }, [selectedRows, onSelectionChange])

  // Get cell value
  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row)
    }
    return row[column.accessor]
  }

  // Render sort icon
  const SortIcon = ({ columnId }: { columnId: string }) => {
    if (sortColumn !== columnId) {
      return <span className="text-gray-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↕</span>
    }
    return (
      <span className="ml-1 text-blue-600">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  const containerClass = maxHeight
    ? `overflow-auto ${maxHeight}`
    : 'overflow-x-auto'

  return (
    <div className={containerClass}>
      <table className="w-full border-collapse">
        <thead className={`bg-gray-50 border-b-2 border-gray-200 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
          <tr>
            {selectable && (
              <th className={`${currentDensity.header} text-left`}>
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                className={`${currentDensity.header} text-${column.align || 'left'} font-semibold text-gray-700 ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100 group select-none' : ''
                }`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.id)}
              >
                <div className="flex items-center justify-between">
                  <span>{column.header}</span>
                  {column.sortable && <SortIcon columnId={column.id} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-4 py-12 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-500">Loading data...</span>
                </div>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-4 py-12 text-center text-gray-500"
              >
                <div className="flex flex-col items-center space-y-2">
                  <svg
                    className="w-12 h-12 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((row) => {
              const rowId = getRowId(row)
              const isSelected = selectedRows.has(rowId)

              return (
                <tr
                  key={rowId}
                  className={`border-b border-gray-200 transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-blue-50' : 'hover:bg-gray-50'
                  } ${isSelected ? 'bg-blue-50' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className={currentDensity.cell}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleSelectRow(rowId)
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        aria-label={`Select row ${rowId}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const value = getCellValue(row, column)
                    const displayValue = column.render ? column.render(value, row) : value

                    return (
                      <td
                        key={column.id}
                        className={`${currentDensity.cell} text-${column.align || 'left'} text-gray-900`}
                      >
                        {displayValue}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

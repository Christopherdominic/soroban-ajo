// Responsive DataTable that adapts to mobile screens
// Features: Card view on mobile, table view on desktop, touch-friendly controls

import React from 'react'
import { DataTable, DataTableProps, DensityOption } from './DataTable'

export interface ResponsiveDataTableProps<T> extends DataTableProps<T> {
  mobileBreakpoint?: number
  cardRenderer?: (row: T, isSelected: boolean, onSelect: () => void) => React.ReactNode
}

export function ResponsiveDataTable<T extends Record<string, any>>({
  mobileBreakpoint = 768,
  cardRenderer,
  ...tableProps
}: ResponsiveDataTableProps<T>) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  // Mobile card view
  if (isMobile && cardRenderer) {
    const { data, selectedRows = new Set(), onSelectionChange, getRowId = (row) => row.id } = tableProps

    return (
      <div className="space-y-3 p-4">
        {data.map((row) => {
          const rowId = getRowId(row)
          const isSelected = selectedRows.has(rowId)

          const handleSelect = () => {
            const newSelection = new Set(selectedRows)
            if (isSelected) {
              newSelection.delete(rowId)
            } else {
              newSelection.add(rowId)
            }
            onSelectionChange?.(newSelection)
          }

          return (
            <div key={rowId} className="bg-white rounded-lg shadow border border-gray-200">
              {cardRenderer(row, isSelected, handleSelect)}
            </div>
          )
        })}
      </div>
    )
  }

  // Desktop table view
  return <DataTable {...tableProps} />
}

// Default mobile card renderer
export const DefaultMobileCard = <T extends Record<string, any>>({
  row,
  columns,
  isSelected,
  onSelect,
  selectable,
}: {
  row: T
  columns: any[]
  isSelected: boolean
  onSelect: () => void
  selectable?: boolean
}) => {
  return (
    <div className="p-4">
      {selectable && (
        <div className="mb-3 pb-3 border-b border-gray-200">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Select</span>
          </label>
        </div>
      )}

      <div className="space-y-3">
        {columns.map((column) => {
          const value =
            typeof column.accessor === 'function'
              ? column.accessor(row)
              : row[column.accessor]
          const displayValue = column.render ? column.render(value, row) : value

          return (
            <div key={column.id} className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">{column.header}:</span>
              <span className="text-sm text-gray-900 text-right ml-2">{displayValue}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

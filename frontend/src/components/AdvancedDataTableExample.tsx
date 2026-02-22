// Advanced DataTable example using useTableState hook
// Features: Complete table management with export, bulk actions, and advanced filtering

import React from 'react'
import { DataTable, Column } from './DataTable'
import { TablePagination } from './TablePagination'
import { TableDensitySelector } from './TableDensitySelector'
import { useTableState } from '../hooks/useTableState'

interface Member {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
  contributions: number
  lastActive: string
}

const sampleMembers: Member[] = Array.from({ length: 50 }, (_, i) => ({
  id: `member-${i + 1}`,
  name: `Member ${i + 1}`,
  email: `member${i + 1}@example.com`,
  role: ['Admin', 'Moderator', 'Member'][i % 3],
  status: (['active', 'inactive', 'pending'] as const)[i % 3],
  joinDate: new Date(2026, 0, (i % 28) + 1).toISOString().split('T')[0],
  contributions: Math.floor(Math.random() * 10000),
  lastActive: new Date(2026, 1, (i % 20) + 1).toISOString().split('T')[0],
}))

export const AdvancedDataTableExample: React.FC = () => {
  // Custom filter function
  const filterFn = (row: Member, filters: any) => {
    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      const matchesSearch =
        row.name.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.status && filters.status !== 'all' && row.status !== filters.status) {
      return false
    }

    // Role filter
    if (filters.role && filters.role !== 'all' && row.role !== filters.role) {
      return false
    }

    // Contribution range filter
    if (filters.minContributions && row.contributions < filters.minContributions) {
      return false
    }

    return true
  }

  // Use table state hook
  const table = useTableState({
    data: sampleMembers,
    initialPageSize: 10,
    initialDensity: 'comfortable',
    filterFn,
  })

  // Define columns
  const columns: Column<Member>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
            {value.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      accessor: 'role',
      sortable: true,
      render: (value) => {
        const roleColors: Record<string, string> = {
          Admin: 'bg-red-100 text-red-800 border-red-200',
          Moderator: 'bg-purple-100 text-purple-800 border-purple-200',
          Member: 'bg-blue-100 text-blue-800 border-blue-200',
        }
        return (
          <span className={`px-2 py-1 rounded border text-xs font-semibold ${roleColors[value]}`}>
            {value}
          </span>
        )
      },
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          active: { color: 'bg-green-100 text-green-800', icon: '●' },
          inactive: { color: 'bg-gray-100 text-gray-800', icon: '○' },
          pending: { color: 'bg-yellow-100 text-yellow-800', icon: '◐' },
        }
        const config = statusConfig[value]
        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${config.color}`}>
            {config.icon} {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        )
      },
    },
    {
      id: 'contributions',
      header: 'Contributions',
      accessor: 'contributions',
      sortable: true,
      align: 'right',
      render: (value) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900">${value.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      ),
    },
    {
      id: 'joinDate',
      header: 'Join Date',
      accessor: 'joinDate',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      id: 'lastActive',
      header: 'Last Active',
      accessor: 'lastActive',
      sortable: true,
      render: (value) => {
        const daysSince = Math.floor(
          (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24)
        )
        return (
          <span className="text-gray-600">
            {daysSince === 0 ? 'Today' : `${daysSince}d ago`}
          </span>
        )
      },
    },
  ]

  // Export functionality
  const handleExport = (format: 'csv' | 'json') => {
    const dataToExport = table.hasSelection
      ? sampleMembers.filter((m) => table.selectedRows.has(m.id))
      : table.filteredData

    if (format === 'csv') {
      const headers = columns.map((col) => col.header).join(',')
      const rows = dataToExport.map((row) =>
        columns
          .map((col) => {
            const value = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]
            return `"${value}"`
          })
          .join(',')
      )
      const csv = [headers, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `members-export-${Date.now()}.csv`
      a.click()
    } else {
      const json = JSON.stringify(dataToExport, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `members-export-${Date.now()}.json`
      a.click()
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Member Directory</h2>
              <p className="text-sm text-gray-600 mt-1">
                {table.totalItems} members • {table.selectedRows.size} selected
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Export JSON
              </button>
              <TableDensitySelector
                density={table.density}
                onDensityChange={table.setDensity}
                showLabels={false}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search members..."
                value={table.filters.search || ''}
                onChange={(e) => table.updateFilter('search', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={table.filters.status || 'all'}
              onChange={(e) => table.updateFilter('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={table.filters.role || 'all'}
              onChange={(e) => table.updateFilter('role', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
              <option value="Member">Member</option>
            </select>
          </div>

          {table.hasFilters && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {table.totalItems} results
              </span>
              <button
                onClick={table.clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {table.hasSelection && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {table.selectedRows.size} selected
              </span>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded">
                  Send Email
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded">
                  Change Role
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 rounded">
                  Remove
                </button>
                <button
                  onClick={table.deselectAll}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <DataTable
          data={table.paginatedData}
          columns={columns}
          density={table.density}
          selectable
          selectedRows={table.selectedRows}
          onSelectionChange={table.setSelectedRows}
          getRowId={(row) => row.id}
          emptyMessage="No members found"
          stickyHeader
          maxHeight="max-h-[600px]"
        />

        {/* Pagination */}
        <TablePagination
          currentPage={table.currentPage}
          totalPages={table.totalPages}
          pageSize={table.pageSize}
          totalItems={table.totalItems}
          onPageChange={table.setCurrentPage}
          onPageSizeChange={table.setPageSize}
        />
      </div>
    </div>
  )
}

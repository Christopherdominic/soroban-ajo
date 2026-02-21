// Example implementation of DataTable with all features
// Demonstrates: sorting, filtering, pagination, density controls, row selection

import React, { useState, useMemo } from 'react'
import { DataTable, Column, DensityOption } from './DataTable'
import { TablePagination } from './TablePagination'
import { TableDensitySelector, TableDensityIconButton } from './TableDensitySelector'

interface ExampleData {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
  contributions: number
}

export const DataTableExample: React.FC = () => {
  // Sample data
  const sampleData: ExampleData[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'Admin',
      status: 'active',
      joinDate: '2026-01-15',
      contributions: 5000,
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'Member',
      status: 'active',
      joinDate: '2026-01-20',
      contributions: 3500,
    },
    {
      id: '3',
      name: 'Carol White',
      email: 'carol@example.com',
      role: 'Member',
      status: 'pending',
      joinDate: '2026-02-01',
      contributions: 0,
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david@example.com',
      role: 'Member',
      status: 'inactive',
      joinDate: '2025-12-10',
      contributions: 2000,
    },
    {
      id: '5',
      name: 'Eve Davis',
      email: 'eve@example.com',
      role: 'Moderator',
      status: 'active',
      joinDate: '2026-01-25',
      contributions: 4200,
    },
  ]

  // State
  const [data] = useState<ExampleData[]>(sampleData)
  const [density, setDensity] = useState<DensityOption>('comfortable')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          row.name.toLowerCase().includes(query) ||
          row.email.toLowerCase().includes(query) ||
          row.role.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== 'all' && row.status !== statusFilter) {
        return false
      }

      // Role filter
      if (roleFilter !== 'all' && row.role !== roleFilter) {
        return false
      }

      return true
    })
  }, [data, searchQuery, statusFilter, roleFilter])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredData.slice(startIndex, startIndex + pageSize)
  }, [filteredData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, roleFilter, pageSize])

  // Define columns
  const columns: Column<ExampleData>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {value.charAt(0)}
          </div>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      id: 'role',
      header: 'Role',
      accessor: 'role',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
          {value}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-gray-100 text-gray-800',
          pending: 'bg-yellow-100 text-yellow-800',
        }
        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[value]}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        )
      },
    },
    {
      id: 'joinDate',
      header: 'Join Date',
      accessor: 'joinDate',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      id: 'contributions',
      header: 'Contributions',
      accessor: 'contributions',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-semibold text-blue-600">${value.toLocaleString()}</span>
      ),
    },
  ]

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setRoleFilter('all')
  }

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || roleFilter !== 'all'

  return (
    <div className="p-6 space-y-4">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Members</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage and view all group members
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <TableDensitySelector
                density={density}
                onDensityChange={setDensity}
                showLabels={false}
              />
              <TableDensityIconButton
                density={density}
                onDensityChange={setDensity}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="Member">Member</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing {filteredData.length} of {data.length} members
              </span>
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Selection Actions */}
        {selectedRows.size > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedRows.size} {selectedRows.size === 1 ? 'row' : 'rows'} selected
              </span>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                  Export Selected
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700">
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedRows(new Set())}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <DataTable
          data={paginatedData}
          columns={columns}
          density={density}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          getRowId={(row) => row.id}
          emptyMessage="No members found matching your filters"
          onRowClick={(row) => console.log('Row clicked:', row)}
        />

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </div>
    </div>
  )
}

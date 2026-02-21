// Issue #29: Add transaction history display
// Complexity: Medium (150 pts)
// Status: Implemented with filtering and sorting

import React, { useState, useMemo } from 'react'
import { TransactionFilters, TransactionSort, TransactionSortField } from '../types'

interface Transaction {
  id: string
  type: 'contribution' | 'payout' | 'refund'
  amount: number
  date: string
  member: string
  status: 'completed' | 'pending' | 'failed'
}

interface TransactionHistoryProps {
  groupId: string
  transactions: Transaction[]
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  groupId,
  transactions,
}) => {
  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
    member: '',
    status: 'all',
  })
  
  const [sort, setSort] = useState<TransactionSort>({
    field: 'date',
    direction: 'desc',
  })

  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  })

  // TODO: Fetch real transaction history from contract
  // TODO: Add pagination

  const mockTransactions: Transaction[] = [
    {
      id: 'tx-1',
      type: 'contribution',
      amount: 500,
      date: '2026-02-10',
      member: 'GAAAA...AAAA',
      status: 'completed',
    },
    {
      id: 'tx-2',
      type: 'contribution',
      amount: 500,
      date: '2026-02-11',
      member: 'GBBBB...BBBB',
      status: 'completed',
    },
    {
      id: 'tx-3',
      type: 'payout',
      amount: 4000,
      date: '2026-02-12',
      member: 'GCCCC...CCCC',
      status: 'completed',
    },
  ]

  const allTransactions = transactions.length > 0 ? transactions : mockTransactions

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      // Date range filter
      if (dateRange.start && tx.date < dateRange.start) return false
      if (dateRange.end && tx.date > dateRange.end) return false

      // Type filter
      if (filters.type && filters.type !== 'all' && tx.type !== filters.type) return false

      // Member filter
      if (filters.member && !tx.member.toLowerCase().includes(filters.member.toLowerCase())) {
        return false
      }

      // Status filter
      if (filters.status && filters.status !== 'all' && tx.status !== filters.status) {
        return false
      }

      return true
    })
  }, [allTransactions, filters, dateRange])

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions]
    
    sorted.sort((a, b) => {
      let comparison = 0

      switch (sort.field) {
        case 'date':
          comparison = a.date.localeCompare(b.date)
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'member':
          comparison = a.member.localeCompare(b.member)
          break
        case 'type':
          comparison = a.type.localeCompare(b.type)
          break
      }

      return sort.direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [filteredTransactions, sort])

  const handleSort = (field: TransactionSortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleResetFilters = () => {
    setFilters({ type: 'all', member: '', status: 'all' })
    setDateRange({ start: '', end: '' })
  }

  const SortIcon = ({ field }: { field: TransactionSortField }) => {
    if (sort.field !== field) {
      return <span className="text-gray-400 ml-1">↕</span>
    }
    return <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Transaction History</h3>
        <button className="text-blue-600 hover:text-blue-700 font-semibold">
          Export
        </button>
      </div>

      {/* Filters Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Transaction Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.type || 'all'}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="contribution">Contribution</option>
              <option value="payout">Payout</option>
              <option value="refund">Refund</option>
            </select>
          </div>

          {/* Member Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member
            </label>
            <input
              type="text"
              placeholder="Search member..."
              value={filters.member || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, member: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing {sortedTransactions.length} of {allTransactions.length} transactions
          </span>
          <button
            onClick={handleResetFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th
                className="px-4 py-2 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('type')}
              >
                Type <SortIcon field="type" />
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                Amount <SortIcon field="amount" />
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                Date <SortIcon field="date" />
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('member')}
              >
                Member <SortIcon field="member" />
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No transactions found matching your filters
                </td>
              </tr>
            ) : (
              sortedTransactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm capitalize">{tx.type}</td>
                  <td className="px-4 py-3 text-sm font-semibold">${tx.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{tx.date}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">
                    {tx.member}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        tx.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : tx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Group ID: {groupId} • {allTransactions.length} total transactions
      </p>
    </div>
  )
}

// Issue #29: Add transaction history display
// Complexity: Medium (150 pts)
// Status: Implemented with filtering and sorting

import React, { useState, useMemo } from 'react'
import { TransactionFilters, TransactionSort, TransactionSortField } from '../types'
import { useTheme } from '@/hooks/useTheme'

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
  const { resolvedTheme } = useTheme()
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
      return <span style={{ color: 'var(--color-text-muted)' }} className="ml-1">↕</span>
    }
    return <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="theme-surface p-6" data-theme={resolvedTheme}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Transaction History
        </h3>
        <button className="font-semibold" style={{ color: 'var(--color-primary)' }}>
          Export
        </button>
      </div>

      {/* Filters Section */}
      <div
        className="mb-6 p-4 rounded-lg"
        style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-border)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
              Type
            </label>
            <select
              value={filters.type || 'all'}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="contribution">Contribution</option>
              <option value="payout">Payout</option>
              <option value="refund">Refund</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
              Member
            </label>
            <input
              type="text"
              placeholder="Search member..."
              value={filters.member || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, member: e.target.value }))}
              className="w-full px-3 py-2 rounded-md"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Showing {sortedTransactions.length} of {allTransactions.length} transactions
          </span>
          <button onClick={handleResetFilters} className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            Reset Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ background: 'var(--color-surface-muted)' }} className="border-b">
            <tr>
              {(['type', 'amount', 'date', 'member'] as TransactionSortField[]).map((field) => (
                <th
                  key={field}
                  className="px-4 py-2 text-left text-sm font-semibold cursor-pointer"
                  onClick={() => handleSort(field)}
                  style={{ color: 'var(--color-text)' }}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)} <SortIcon field={field} />
                </th>
              ))}
              <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
                  No transactions found matching your filters
                </td>
              </tr>
            ) : (
              sortedTransactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="px-4 py-3 text-sm capitalize" style={{ color: 'var(--color-text)' }}>
                    {tx.type}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    ${tx.amount}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {tx.date}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--color-text-muted)' }}>
                    {tx.member}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        background:
                          tx.status === 'completed'
                            ? 'var(--color-success)'
                            : tx.status === 'pending'
                            ? 'var(--color-warning)'
                            : 'var(--color-danger)',
                        color: 'var(--color-primary-contrast)',
                      }}
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

      <p className="text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>
        Group ID: {groupId} • {allTransactions.length} total transactions
      </p>
    </div>
  )
}

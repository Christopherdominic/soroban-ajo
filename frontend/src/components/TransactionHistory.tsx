'use client'

import React, { useState, useMemo } from 'react'
import { TransactionDetailModal } from './TransactionDetailModal'

const TablePagination: React.FC<any> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => null
import { TransactionFilters, TransactionSort, TransactionSortField } from '../types'
import { useTransactions } from '../hooks/useContractData'
import { useTheme } from '@/context/ThemeContext'

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
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ groupId }) => {
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Since we don't have a real cursor API yet, we use page numbers for the mock
  // In a real implementation this would manage cursor strings
  const cursor = currentPage > 1 ? `page-${currentPage}` : undefined

  // Fetch data
  const { data, isLoading, isError } = useTransactions(groupId, cursor, pageSize) as any

  const transactions: any[] = data?.transactions || []
  const hasNextPage = data?.hasNextPage || false
  const hasPreviousPage = !!cursor

  // Modal state
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx: any) => {
      const txDateStr = typeof tx.date === 'string' ? tx.date : new Date(tx.timestamp || tx.date).toISOString().split('T')[0]

      // Date range filter
      if (dateRange.start && txDateStr < dateRange.start) return false
      if (dateRange.end && txDateStr > dateRange.end) return false

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
  }, [transactions, filters, dateRange])

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions]

    sorted.sort((a, b) => {
      let comparison = 0

      switch (sort.field) {
        case 'date': {
          const dateA = a.date || a.timestamp
          const dateB = b.date || b.timestamp
          comparison = new Date(dateA).getTime() - new Date(dateB).getTime()
          break
        }
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

  const handleRowClick = (tx: Transaction) => {
    setSelectedTx(tx)
    setIsModalOpen(true)
  }

  const SortIcon = ({ field }: { field: TransactionSortField }) => {
    if (sort.field !== field) {
      return (
        <span style={{ color: 'var(--color-text-muted)' }} className="ml-1">
          ↕
        </span>
      )
    }
    return <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="theme-surface p-6 rounded-xl border border-[var(--color-border)] shadow" data-theme={resolvedTheme}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Transaction History
        </h3>
        <button className="px-4 py-2 rounded font-semibold bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity">
          Export CSV
        </button>
      </div>

      {/* Filters Section */}
      <div
        className="mb-6 p-4 rounded-lg"
        style={{
          background: 'var(--color-surface-muted)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Type
            </label>
            <select
              value={filters.type || 'all'}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as TransactionFilters['type'] }))}
              className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="contribution">Contribution</option>
              <option value="payout">Payout</option>
              <option value="refund">Refund</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text)' }}
            >
              Member
            </label>
            <input
              type="text"
              placeholder="Search address..."
              value={filters.member || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, member: e.target.value }))}
              className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
            Showing {sortedTransactions.length} results
          </span>
          <button
            onClick={handleResetFilters}
            className="text-sm font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[var(--color-surface-muted)] text-[var(--color-text)] border-b border-[var(--color-border)]">
            <tr>
              {(['type', 'amount', 'date', 'member'] as TransactionSortField[]).map((field) => (
                <th
                  key={field}
                  className="px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-[var(--color-border)] transition-colors select-none group"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center gap-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <SortIcon field={field} />
                    </span>
                  </div>
                </th>
              ))}
              <th
                className="px-4 py-2 text-left text-sm font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--color-surface)]">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  No transactions found matching your filters
                </td>
              </tr>
            ) : (
              sortedTransactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td
                    className="px-4 py-3 text-sm capitalize"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {tx.type}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-semibold"
                    style={{ color: 'var(--color-text)' }}
                  >
                    ${tx.amount}
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">
                    {typeof tx.date === 'string' ? tx.date.split('T')[0] : new Date(tx.timestamp || tx.date).toISOString().split('T')[0]}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-mono"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {tx.member}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold leading-none capitalize"
                      style={{
                        background:
                          tx.status === 'completed' || tx.status === 'confirmed'
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

      {transactions.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={hasNextPage ? currentPage + 1 : currentPage} // Simple next-page logic for cursor-based
          pageSize={pageSize}
          totalItems={transactions.length} // This is inaccurate for cursor, ideally backend returns total
          onPageChange={setCurrentPage}
          onPageSizeChange={(size: any) => {
            setPageSize(size)
            setCurrentPage(1) // Reset to first page
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          showItemCount={false}
        />
      )}

      <TransactionDetailModal
        transaction={selectedTx as any}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

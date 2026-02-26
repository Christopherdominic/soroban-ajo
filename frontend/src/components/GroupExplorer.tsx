import React, { useState } from 'react'
import { useExplore, ALL_TAGS, ExploreGroup, ExploreSortField } from '@/hooks/useExplore'
import { GroupPreviewModal } from '@/components/GroupPreviewModal'

const tagColors: Record<string, string> = {
  savings: 'bg-blue-100 text-blue-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  housing: 'bg-orange-100 text-orange-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  education: 'bg-purple-100 text-purple-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  emergency: 'bg-red-100 text-red-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  business: 'bg-green-100 text-green-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  vacation: 'bg-cyan-100 text-cyan-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  family: 'bg-pink-100 text-pink-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
  community: 'bg-indigo-100 text-indigo-700 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]',
}

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-success)] dark:border-[var(--color-border)]',
  completed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-primary)] dark:border-[var(--color-border)]',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-warning)] dark:border-[var(--color-border)]',
}

const sortLabels: Record<ExploreSortField, string> = {
  popularity: 'Popularity',
  createdAt: 'Newest',
  members: 'Most Members',
  amount: 'Amount',
  totalRaised: 'Total Raised',
}

function ExploreCard({ group, onClick }: { group: ExploreGroup; onClick: () => void }) {
  const fillPercent = (group.currentMembers / group.maxMembers) * 100
  const isFull = group.currentMembers >= group.maxMembers

  return (
    <div
      className="card-interactive flex flex-col gap-3 h-full dark:bg-[var(--color-surface)] dark:border dark:border-[var(--color-border)] dark:text-[var(--color-text)]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`View details for ${group.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 dark:text-[var(--color-text)]">{group.name}</h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${statusColors[group.status]}`}>
          {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1 dark:text-[var(--color-text-muted)]">
        {group.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {group.tags.map(tag => (
          <span key={tag} className={`px-2 py-0.5 rounded text-xs font-medium ${tagColors[tag] ?? 'bg-gray-100 text-gray-600 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)]'}`}>
            {tag}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-50 rounded-lg px-3 py-2 dark:bg-[var(--color-surface-muted)]">
          <p className="text-xs text-gray-400 font-medium dark:text-[var(--color-text-muted)]">Contribution</p>
          <p className="font-bold text-gray-900 dark:text-[var(--color-text)]">${group.contributionAmount}<span className="text-xs text-gray-400 font-normal dark:text-[var(--color-text-muted)]">/{group.frequency === 'weekly' ? 'wk' : 'mo'}</span></p>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2 dark:bg-[var(--color-surface-muted)]">
          <p className="text-xs text-gray-400 font-medium dark:text-[var(--color-text-muted)]">Total Raised</p>
          <p className="font-bold text-gray-900 dark:text-[var(--color-text)]">${group.totalRaised.toLocaleString()}</p>
        </div>
      </div>

      {/* Members progress */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 dark:text-[var(--color-text-muted)]">Members</span>
          <span className={`text-xs font-semibold ${isFull ? 'text-red-600 dark:text-[var(--color-danger)]' : 'text-gray-700 dark:text-[var(--color-text)]'}`}>
            {group.currentMembers}/{group.maxMembers}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden dark:bg-[var(--color-border)]">
          <div
            className={`h-1.5 rounded-full transition-all ${isFull ? 'bg-red-400' : fillPercent >= 80 ? 'bg-orange-400' : 'bg-blue-600'}`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-[var(--color-border)]">
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs text-gray-500 dark:text-[var(--color-text-muted)]">{group.creatorReputation.toFixed(1)} creator</span>
        </div>
        {group.isJoined ? (
          <span className="text-xs font-semibold text-green-600 dark:text-[var(--color-success)] flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Joined
          </span>
        ) : (
          <span className="text-xs font-semibold text-blue-600 dark:text-[var(--color-primary)]">View Details →</span>
        )}
      </div>
    </div>
  )
}

function FilterPanel({
  filters,
  updateFilters,
  resetFilters,
  onClose,
}: {
  filters: ReturnType<typeof useExplore>['filters']
  updateFilters: ReturnType<typeof useExplore>['updateFilters']
  resetFilters: () => void
  onClose?: () => void
}) {
  const hasActiveFilters =
    filters.minAmount !== '' ||
    filters.maxAmount !== '' ||
    filters.minMembers !== '' ||
    filters.maxMembers !== '' ||
    filters.minDuration !== '' ||
    filters.maxDuration !== '' ||
    filters.status !== 'all' ||
    filters.frequency !== 'all' ||
    filters.tags.length > 0

  const toggleTag = (tag: string) => {
    const current = filters.tags
    updateFilters({ tags: current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag] })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-[var(--color-text)]">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-[var(--color-primary)] font-medium transition-colors"
          >
            Clear all
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:text-[var(--color-text-muted)] transition-colors" aria-label="Close filters" title="Close filters">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-[var(--color-text-muted)]">Status</label>
        <div className="flex flex-wrap gap-2">
          {(['all', 'active', 'paused', 'completed'] as const).map(s => (
            <button
              key={s}
              onClick={() => updateFilters({ status: s })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filters.status === s
                  ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)] dark:hover:bg-[var(--color-surface)]'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-[var(--color-text-muted)]">Frequency</label>
        <div className="flex gap-2">
          {(['all', 'weekly', 'monthly'] as const).map(f => (
            <button
              key={f}
              onClick={() => updateFilters({ frequency: f })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-1 ${
                filters.frequency === f
                  ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)] dark:hover:bg-[var(--color-surface)]'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Amount Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-[var(--color-text-muted)]">Contribution Amount ($)</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={filters.minAmount}
            onChange={e => updateFilters({ minAmount: e.target.value === '' ? '' : Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:placeholder-[var(--color-text-muted)]"
          />
          <span className="text-gray-400 text-sm flex-shrink-0 dark:text-[var(--color-text-muted)]">–</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={filters.maxAmount}
            onChange={e => updateFilters({ maxAmount: e.target.value === '' ? '' : Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:placeholder-[var(--color-text-muted)]"
          />
        </div>
      </div>

      {/* Members Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-[var(--color-text-muted)]">Max Members</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            min={1}
            value={filters.minMembers}
            onChange={e => updateFilters({ minMembers: e.target.value === '' ? '' : Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:placeholder-[var(--color-text-muted)]"
          />
          <span className="text-gray-400 text-sm flex-shrink-0 dark:text-[var(--color-text-muted)]">–</span>
          <input
            type="number"
            placeholder="Max"
            min={1}
            value={filters.maxMembers}
            onChange={e => updateFilters({ maxMembers: e.target.value === '' ? '' : Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:placeholder-[var(--color-text-muted)]"
          />
        </div>
      </div>

      {/* Duration Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-[var(--color-text-muted)]">Duration (cycles)</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            min={1}
            value={filters.minDuration}
            onChange={e => updateFilters({ minDuration: e.target.value === '' ? '' : Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:placeholder-[var(--color-text-muted)]"
          />
          <span className="text-gray-400 text-sm flex-shrink-0 dark:text-[var(--color-text-muted)]">–</span>
          <input
            type="number"
            placeholder="Max"
            min={1}
            value={filters.maxDuration}
            onChange={e => updateFilters({ maxDuration: e.target.value === '' ? '' : Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:placeholder-[var(--color-text-muted)]"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-[var(--color-text-muted)]">Categories</label>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                filters.tags.includes(tag)
                  ? `${tagColors[tag] ?? 'bg-gray-100 text-gray-700'} border-current`
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-[var(--color-surface)] dark:text-[var(--color-text)] dark:border-[var(--color-border)]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export const GroupExplorer: React.FC = () => {
  const {
    paginatedGroups,
    filters,
    updateFilters,
    resetFilters,
    sort,
    setSort,
    page,
    setPage,
    totalPages,
    totalCount,
    joinGroup,
  } = useExplore()

  const [selectedGroup, setSelectedGroup] = useState<ExploreGroup | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const handleSortField = (field: ExploreSortField) => {
    if (sort.field === field) {
      setSort({ field, direction: sort.direction === 'desc' ? 'asc' : 'desc' })
    } else {
      setSort({ field, direction: 'desc' })
    }
  }

  return (
    <div className="space-y-6 dark:text-[var(--color-text)]">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400 dark:text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by group name or creator address..."
          value={filters.search}
          onChange={e => updateFilters({ search: e.target.value })}
          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:placeholder-[var(--color-text-muted)]"
        />
        {filters.search && (
          <button
            onClick={() => updateFilters({ search: '' })}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:text-[var(--color-text-muted)]"
            aria-label="Clear search"
            title="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar - desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24 dark:bg-[var(--color-surface)] dark:border-[var(--color-border)]">
            <FilterPanel filters={filters} updateFilters={updateFilters} resetFilters={resetFilters} />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 dark:bg-[var(--color-surface)] dark:border-[var(--color-border)]">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:hover:bg-[var(--color-surface-muted)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>

            <p className="text-sm text-gray-500 dark:text-[var(--color-text-muted)]">
              <span className="font-semibold text-gray-800 dark:text-[var(--color-text)]">{totalCount}</span> group{totalCount !== 1 ? 's' : ''} found
            </p>

            <div className="flex-1" />

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline font-medium dark:text-[var(--color-text-muted)]">Sort:</span>
              <div className="flex gap-1 flex-wrap">
                {(Object.keys(sortLabels) as ExploreSortField[]).map(field => (
                  <button
                    key={field}
                    onClick={() => handleSortField(field)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                      sort.field === field
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[var(--color-surface-muted)] dark:text-[var(--color-text)] dark:hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    {sortLabels[field]}
                    {sort.field === field && (
                      <span>{sort.direction === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Group Grid */}
          {paginatedGroups.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-[var(--color-surface)] dark:border-[var(--color-border)]">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3 dark:text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 font-medium dark:text-[var(--color-text-muted)]">No groups match your filters</p>
              <button
                onClick={resetFilters}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 dark:text-[var(--color-primary)] font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedGroups.map(group => (
                <ExploreCard
                  key={group.id}
                  group={group}
                  onClick={() => setSelectedGroup(group)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:hover:bg-[var(--color-surface-muted)]"
                aria-label="Previous page"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                const isEllipsis = totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages
                const showEllipsis =
                  totalPages > 7 &&
                  ((p === 2 && page > 4) || (p === totalPages - 1 && page < totalPages - 3))

                if (isEllipsis && !showEllipsis) return null
                if (showEllipsis) {
                  return <span key={p} className="px-1 text-gray-400 dark:text-[var(--color-text-muted)]">…</span>
                }

                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                      page === p
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:hover:bg-[var(--color-surface-muted)]'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:text-[var(--color-text)] dark:hover:bg-[var(--color-surface-muted)]"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto p-5 dark:bg-[var(--color-surface)] dark:text-[var(--color-text)]">
            <FilterPanel
              filters={filters}
              updateFilters={updateFilters}
              resetFilters={resetFilters}
              onClose={() => setFiltersOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedGroup && (
        <GroupPreviewModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onJoin={id => { joinGroup(id); setSelectedGroup(null) }}
        />
      )}
    </div>
  )
}

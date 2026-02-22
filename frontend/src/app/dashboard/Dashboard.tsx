'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useDashboard } from '@/hooks/useDashboard'
import { GroupsGrid } from '@/components/GroupsGrid'
import { GroupsList } from '@/components/GroupsList'
import { useAuth } from '@/hooks/useAuth'

export default function Dashboard() {
  const router = useRouter()
  const { address } = useAuth()
  const {
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
    groups,
    totalGroups,
    isLoading,
  } = useDashboard(address || undefined)

  const handleGroupClick = (groupId: string) => {
    router.push(`/groups/${groupId}`)
  }

  const handleJoinGroup = (groupId: string) => {
    // TODO: Implement join group logic
    console.log('Join group:', groupId)
  }

  const EmptyState = () => (
    <div className="animate-fade-in-up text-center py-20 px-6 bg-white rounded-2xl border border-surface-200/80">
      <div className="empty-state-icon mb-6 animate-float">
        <svg className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-surface-900 mb-2">No groups found</h3>
      <p className="text-sm text-surface-500 max-w-sm mx-auto leading-relaxed">
        {searchQuery || filterStatus !== 'all'
          ? 'Try adjusting your filters or search query'
          : 'Get started by creating or joining a savings group'}
      </p>
      {!searchQuery && filterStatus === 'all' && (
        <button
          onClick={() => router.push('/groups/create')}
          className="btn-primary mt-8 px-6 py-3 text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Your First Group
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
                  Dashboard
                </h1>
                <p className="mt-2 text-surface-500 text-sm sm:text-base">
                  Manage your savings groups
                </p>
              </div>
              {!isLoading && (
                <div className="stat-pill animate-fade-in">
                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {totalGroups} {totalGroups === 1 ? 'group' : 'groups'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Controls Bar */}
        <div className="mb-6 space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Search + View Toggle Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-search"
              />
            </div>

            {/* View Toggle */}
            <div className="view-toggle-group">
              <button
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'view-toggle-btn-active' : 'view-toggle-btn-inactive'}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid
                </span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'view-toggle-btn-active' : 'view-toggle-btn-inactive'}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List
                </span>
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'completed', 'paused'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status ? 'filter-btn-active' : 'filter-btn-inactive'}
              >
                {status === 'active' && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                )}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {!isLoading && (
            <div className="text-xs font-medium text-surface-400 tracking-wide uppercase">
              Showing {groups.length} of {totalGroups} groups
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {!isLoading && groups.length === 0 ? (
            <EmptyState />
          ) : viewMode === 'grid' ? (
            <GroupsGrid
              groups={groups}
              isLoading={isLoading}
              onGroupClick={handleGroupClick}
            />
          ) : (
            <GroupsList
              groups={groups}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={toggleSort}
              onGroupClick={handleGroupClick}
              onJoinGroup={handleJoinGroup}
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2 animate-fade-in">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-btn px-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? 'pagination-btn-active' : 'pagination-btn'}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn px-4"
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

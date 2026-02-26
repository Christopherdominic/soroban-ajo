'use client'

import { GroupsList } from '@/components/GroupsList'
import { GroupCreationForm } from '@/components/GroupCreationForm'
import { useDashboard } from '@/hooks/useDashboard'
import { useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { FilterPanel } from '@/components/FilterPanel'
import { useGroupFilters } from '@/hooks/useGroupFilters'

export default function GroupsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { groups: rawGroups, isLoading } = useDashboard()

  const { filters, updateFilter, clearFilters, filteredAndSortedGroups } = useGroupFilters(rawGroups);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Savings Groups</h1>
            <p className="text-gray-600 mt-1">Create and manage your Ajo savings groups</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm flex items-center gap-2"
          >
            {showCreateForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                View Groups
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Group
              </>
            )}
          </button>
        </div>

        {showCreateForm ? (
          <GroupCreationForm onSuccess={() => setShowCreateForm(false)} />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 mb-4">
              <SearchBar
                value={filters.searchQuery}
                onChange={(val) => updateFilter('searchQuery', val)}
              />
              <FilterPanel
                filters={filters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
              />
            </div>
            {filteredAndSortedGroups.length === 0 && !isLoading ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500">No groups found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <GroupsList
                groups={filteredAndSortedGroups}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

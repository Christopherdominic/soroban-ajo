'use client'

import { GroupsList } from '@/components/GroupsList'
import { GroupCreationForm } from '@/components/GroupCreationForm'
import { useDashboard } from '@/hooks/useDashboard'
import { useState } from 'react'

export default function GroupsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { 
    groups, 
    isLoading, 
    sortField, 
    sortDirection, 
    toggleSort 
  } = useDashboard()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Savings Groups</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showCreateForm ? 'View Groups' : 'Create Group'}
          </button>
        </div>

        {showCreateForm ? (
          <div className="max-w-2xl mx-auto">
            <GroupCreationForm onSuccess={() => setShowCreateForm(false)} />
          </div>
        ) : (
          <GroupsList 
            groups={groups}
            isLoading={isLoading}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={toggleSort}
          />
        )}
      </div>
    </div>
  )
}

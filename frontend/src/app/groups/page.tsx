'use client'

import dynamic from 'next/dynamic'
import { useState, Suspense } from 'react'
import { useDashboard } from '@/hooks/useDashboard'

const GroupsList = dynamic(() => import('@/components/GroupsList').then(mod => mod.GroupsList), {
  loading: () => <div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 h-24 rounded-lg" />)}</div>,
  ssr: true
})

const GroupCreationForm = dynamic(() => import('@/components/GroupCreationForm').then(mod => mod.GroupCreationForm), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg w-full" />,
  ssr: true
})

export default function GroupsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { groups, isLoading, sortField, sortDirection, toggleSort } = useDashboard()

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

        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg w-full" />}>
          {showCreateForm ? (
            <div className="max-w-2xl mx-auto">
              <GroupCreationForm onSuccess={() => setShowCreateForm(false)} />
            </div>
          ) : (
            <GroupsList groups={groups} isLoading={isLoading} sortField={sortField} sortDirection={sortDirection} onSort={toggleSort} />
          )}
        </Suspense>
      </div>
    </div>
  )
}

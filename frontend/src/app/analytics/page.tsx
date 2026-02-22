'use client'

import { GroupAnalytics } from '@/components/GroupAnalytics'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Analytics</h1>
        <GroupAnalytics />
      </div>
    </div>
  )
}

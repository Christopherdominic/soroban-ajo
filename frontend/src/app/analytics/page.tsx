'use client'

import dynamic from 'next/dynamic'

const GroupAnalytics = dynamic(() => import('@/components/GroupAnalytics').then(mod => mod.GroupAnalytics), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg w-full" />,
  ssr: false
})

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

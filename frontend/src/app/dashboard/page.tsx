'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const DashboardLayout = dynamic(() => import('@/components/DashboardLayout').then(mod => mod.DashboardLayout), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  ),
  ssr: true,
})

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <DashboardLayout />
    </Suspense>
  )
}

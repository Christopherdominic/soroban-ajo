'use client'

import { useParams } from 'next/navigation'
import { GroupDetailPage } from '@/components/GroupDetailPage'

export default function GroupPage() {
  const params = useParams()
  const groupId = params?.id as string

  if (!groupId) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <GroupDetailPage groupId={groupId} />
      </div>
    </div>
  )
}

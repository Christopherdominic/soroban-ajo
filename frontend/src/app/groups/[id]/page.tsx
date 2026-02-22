'use client'

import { useParams } from 'next/navigation'
import { GroupDetailPage } from '@/components/GroupDetailPage'

export default function GroupPage() {
  const params = useParams()
  const groupId = params.id as string

  return <GroupDetailPage groupId={groupId} />
}

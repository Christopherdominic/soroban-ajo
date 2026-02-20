// Issue #26: React Query queries for contract state
import { useQuery } from '@tanstack/react-query'
import { initializeSoroban } from '../services/soroban'
import type { Group, Member } from '../types'

const soroban = initializeSoroban()

export const useGroups = () => {
  return useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      // TODO: Implement actual contract call
      return []
    },
  })
}

export const useGroup = (groupId: string) => {
  return useQuery<Group | null>({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const status = await soroban.getGroupStatus(groupId)
      return status as unknown as Group
    },
    enabled: !!groupId,
  })
}

export const useGroupMembers = (groupId: string) => {
  return useQuery<Member[]>({
    queryKey: ['groupMembers', groupId],
    queryFn: async () => {
      const members = await soroban.getGroupMembers(groupId)
      return members as unknown as Member[]
    },
    enabled: !!groupId,
  })
}

// Issue #26: React Query mutations for contract actions
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { initializeSoroban } from '../services/soroban'
import { showNotification } from '../utils/notifications'
import type { Group } from '../types'

const soroban = initializeSoroban()

interface CreateGroupParams {
  groupName: string
  cycleLength: number
  contributionAmount: number
  maxMembers: number
}

export const useCreateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateGroupParams) => {
      const groupId = await soroban.createGroup(params)
      return { groupId }
    },
    onMutate: async (newGroup) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] })
      const previous = queryClient.getQueryData(['groups'])
      
      queryClient.setQueryData<Group[]>(['groups'], (old = []) => [
        ...old,
        { id: 'temp', name: newGroup.groupName, status: 'active' } as Group,
      ])
      
      return { previous }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['groups'], context?.previous)
      showNotification.error('Failed to create group')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      showNotification.success('Group created successfully!')
    },
  })
}

export const useJoinGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (groupId: string) => {
      await soroban.joinGroup(groupId)
    },
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groupMembers', groupId] })
      showNotification.success('Joined group successfully!')
    },
    onError: () => {
      showNotification.error('Failed to join group')
    },
  })
}

export const useContributeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ groupId, amount }: { groupId: string; amount: number }) => {
      await soroban.contribute(groupId, amount)
      return { transactionHash: `0x${Math.random().toString(16).slice(2)}` }
    },
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

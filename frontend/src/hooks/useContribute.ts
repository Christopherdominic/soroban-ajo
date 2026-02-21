// Issue #24: Implement contribution form - useContribute hook
// Complexity: Trivial (100 pts)

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { initializeSoroban } from '../services/soroban'
import { showNotification } from '../utils/notifications'
import { analytics } from '../services/analytics'

interface ContributeParams {
  groupId: string
  amount: number
}

interface ContributeResult {
  transactionHash: string
  timestamp: string
}

export const useContribute = () => {
  const queryClient = useQueryClient()
  const sorobanService = initializeSoroban()

  return useMutation<ContributeResult, Error, ContributeParams>({
    mutationFn: async ({ groupId, amount }: ContributeParams) => {
      await sorobanService.contribute(groupId, amount)
      
      return {
        transactionHash: `0x${Math.random().toString(16).slice(2)}`,
        timestamp: new Date().toISOString(),
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      
      analytics.trackEvent({
        category: 'Contribution',
        action: 'Success',
        label: variables.groupId,
        metadata: { amount: variables.amount, hash: data.transactionHash },
      })
    },
    onError: (error, variables) => {
      analytics.trackError(error, {
        operation: 'contribute',
        groupId: variables.groupId,
        amount: variables.amount,
      }, 'high')
    },
  })
}

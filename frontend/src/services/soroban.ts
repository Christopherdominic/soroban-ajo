// Issue #25: Integrate Stellar SDK for contract interaction
// Complexity: Medium (150 pts)
// Status: Enhanced with retry mechanisms and error handling

import { Keypair, SorobanRpc, Contract } from 'stellar-sdk'
import { analytics, trackUserAction } from './analytics'
import { showNotification } from '../utils/notifications'

const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL
const CONTRACT_ID = import.meta.env.VITE_SOROBAN_CONTRACT_ID

// Retry configuration
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000
const RETRY_BACKOFF_MULTIPLIER = 2

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  backoffMultiplier?: number
  shouldRetry?: (error: any) => boolean
}

// Retry wrapper with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = MAX_RETRIES,
    initialDelay = INITIAL_RETRY_DELAY,
    backoffMultiplier = RETRY_BACKOFF_MULTIPLIER,
    shouldRetry = isRetryableError,
  } = options

  let lastError: any
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      // Log the error
      analytics.trackError(
        error as Error,
        {
          operation: operationName,
          attempt: attempt + 1,
          maxRetries: maxRetries + 1,
        },
        attempt === maxRetries ? 'high' : 'medium'
      )

      // Check if we should retry
      if (attempt < maxRetries && shouldRetry(error)) {
        console.warn(
          `[Retry] ${operationName} failed (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delay}ms...`,
          error
        )

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay))
        
        // Exponential backoff
        delay *= backoffMultiplier
      } else {
        break
      }
    }
  }

  // All retries exhausted
  throw lastError
}

// Determine if an error is retryable
function isRetryableError(error: any): boolean {
  // Network errors
  if (error.name === 'NetworkError' || error.message?.includes('network')) {
    return true
  }

  // Timeout errors
  if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
    return true
  }

  // Rate limiting (429)
  if (error.status === 429 || error.code === 'RATE_LIMIT_EXCEEDED') {
    return true
  }

  // Temporary server errors (5xx)
  if (error.status >= 500 && error.status < 600) {
    return true
  }

  // Soroban-specific retryable errors
  if (error.code === 'TRANSACTION_PENDING' || error.code === 'TRY_AGAIN_LATER') {
    return true
  }

  return false
}

// Error classification for better user messaging
function classifyError(error: any): { message: string; severity: 'low' | 'medium' | 'high' | 'critical' } {
  // User errors (non-retryable)
  if (error.code === 'INSUFFICIENT_BALANCE') {
    return { message: 'Insufficient balance to complete transaction', severity: 'medium' }
  }
  if (error.code === 'INVALID_PARAMETERS') {
    return { message: 'Invalid parameters provided', severity: 'medium' }
  }
  if (error.code === 'UNAUTHORIZED') {
    return { message: 'Wallet authorization required', severity: 'medium' }
  }

  // Network errors
  if (error.name === 'NetworkError' || error.message?.includes('network')) {
    return { message: 'Network connection error. Please check your connection.', severity: 'high' }
  }

  // Contract errors
  if (error.code === 'CONTRACT_ERROR') {
    return { message: 'Smart contract execution failed', severity: 'high' }
  }

  // Default
  return { message: 'An unexpected error occurred', severity: 'critical' }
}

export interface CreateGroupParams {
  groupName: string
  cycleLength: number
  contributionAmount: number
  maxMembers: number
}

export interface SorobanService {
  // TODO: Implement contract interaction methods
  createGroup: (params: CreateGroupParams) => Promise<string>
  joinGroup: (groupId: string) => Promise<void>
  contribute: (groupId: string, amount: number) => Promise<void>
  getGroupStatus: (groupId: string) => Promise<any>
  getGroupMembers: (groupId: string) => Promise<any[]>
}

export const initializeSoroban = (): SorobanService => {
  // TODO: Initialize Soroban client and contract instance
  // Steps:
  // 1. Create SorobanRpc client with RPC_URL
  // 2. Load contract using CONTRACT_ID
  // 3. Setup user's keypair from Freighter
  // 4. Return service object with contract methods

  return {
    createGroup: async (params: CreateGroupParams) => {
      return analytics.measureAsync('create_group', async () => {
        try {
          // Wrap in retry logic
          const groupId = await withRetry(
            async () => {
              console.log('TODO: Implement createGroup', params)
              // Placeholder - would call contract.invoke()
              return 'group_id_placeholder'
            },
            'createGroup',
            {
              shouldRetry: (error) => {
                // Don't retry validation errors
                if (error.code === 'INVALID_PARAMETERS') return false
                return isRetryableError(error)
              },
            }
          )
          
          trackUserAction.groupCreated(groupId, params)
          showNotification.success('Group created successfully!')
          
          return groupId
        } catch (error) {
          const { message, severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'createGroup', params }, severity)
          showNotification.error(message)
          throw error
        }
      })
    },

    joinGroup: async (groupId: string) => {
      return analytics.measureAsync('join_group', async () => {
        try {
          await withRetry(
            async () => {
              console.log('TODO: Implement joinGroup', groupId)
              // Placeholder
            },
            'joinGroup'
          )
          
          trackUserAction.groupJoined(groupId)
          showNotification.success('Successfully joined group!')
        } catch (error) {
          const { message, severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'joinGroup', groupId }, severity)
          showNotification.error(message)
          throw error
        }
      })
    },

    contribute: async (groupId: string, amount: number) => {
      return analytics.measureAsync('contribute', async () => {
        try {
          await withRetry(
            async () => {
              console.log('TODO: Implement contribute', groupId, amount)
              // Placeholder
            },
            'contribute',
            {
              shouldRetry: (error) => {
                // Don't retry insufficient balance errors
                if (error.code === 'INSUFFICIENT_BALANCE') return false
                return isRetryableError(error)
              },
            }
          )
          
          trackUserAction.contributionMade(groupId, amount)
          showNotification.success(`Contribution of ${amount} XLM successful!`)
        } catch (error) {
          const { message, severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'contribute', groupId, amount }, severity)
          showNotification.error(message)
          throw error
        }
      })
    },

    getGroupStatus: async (groupId: string) => {
      return analytics.measureAsync('get_group_status', async () => {
        try {
          return await withRetry(
            async () => {
              console.log('TODO: Implement getGroupStatus', groupId)
              return {}
            },
            'getGroupStatus'
          )
        } catch (error) {
          const { message, severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'getGroupStatus', groupId }, severity)
          // Don't show notification for read operations
          throw error
        }
      })
    },

    getGroupMembers: async (groupId: string) => {
      return analytics.measureAsync('get_group_members', async () => {
        try {
          return await withRetry(
            async () => {
              console.log('TODO: Implement getGroupMembers', groupId)
              return []
            },
            'getGroupMembers'
          )
        } catch (error) {
          const { message, severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'getGroupMembers', groupId }, severity)
          // Don't show notification for read operations
          throw error
        }
      })
    },
  }
}

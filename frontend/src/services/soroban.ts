// Issue #25: Integrate Stellar SDK for contract interaction
// Complexity: Medium (150 pts)
// Status: Enhanced with retry mechanisms, error handling, and intelligent caching

import { analytics, trackUserAction } from './analytics'
import { showNotification } from '../utils/notifications'
import { cacheService, CacheKeys, CacheTags } from './cache'

// Cache TTL configurations (in milliseconds)
const CACHE_TTL = {
  GROUP_STATUS: 30 * 1000, // 30 seconds - frequently changing
  GROUP_MEMBERS: 60 * 1000, // 1 minute - changes less often
  GROUP_LIST: 45 * 1000, // 45 seconds - moderate changes
  TRANSACTIONS: 2 * 60 * 1000, // 2 minutes - historical data
} as const

// Retry configuration
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000
const RETRY_BACKOFF_MULTIPLIER = 2

// Circuit breaker configuration
const CIRCUIT_BREAKER_THRESHOLD = 5 // failures before opening circuit
const CIRCUIT_BREAKER_TIMEOUT = 60000 // 1 minute before trying again

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  backoffMultiplier?: number
  shouldRetry?: (error: any) => boolean
}

// Circuit breaker state
class CircuitBreaker {
  private failures: number = 0
  private lastFailureTime: number = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'

  isOpen(): boolean {
    if (this.state === 'open') {
      // Check if timeout has passed
      if (Date.now() - this.lastFailureTime > CIRCUIT_BREAKER_TIMEOUT) {
        this.state = 'half-open'
        return false
      }
      return true
    }
    return false
  }

  recordSuccess(): void {
    this.failures = 0
    this.state = 'closed'
  }

  recordFailure(): void {
    this.failures++
    this.lastFailureTime = Date.now()
    
    if (this.failures >= CIRCUIT_BREAKER_THRESHOLD) {
      this.state = 'open'
      console.warn('[Circuit Breaker] Circuit opened due to repeated failures')
    }
  }

  reset(): void {
    this.failures = 0
    this.state = 'closed'
  }
}

const circuitBreaker = new CircuitBreaker()

// Retry wrapper with exponential backoff and circuit breaker
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

  // Check circuit breaker
  if (circuitBreaker.isOpen()) {
    throw new Error(`Circuit breaker is open for ${operationName}. Service temporarily unavailable.`)
  }

  let lastError: any
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation()
      
      // Record success in circuit breaker
      circuitBreaker.recordSuccess()
      
      return result
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

  // Record failure in circuit breaker
  circuitBreaker.recordFailure()

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
  getGroupStatus: (groupId: string, useCache?: boolean) => Promise<any>
  getGroupMembers: (groupId: string, useCache?: boolean) => Promise<any[]>
  getUserGroups: (userId: string, useCache?: boolean) => Promise<any[]>
  invalidateGroupCache: (groupId: string) => void
  invalidateUserCache: (userId: string) => void
  clearCache: () => void
}

/**
 * Cached fetch wrapper with stale-while-revalidate
 */
async function cachedFetch<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number
    tags?: string[]
    forceRefresh?: boolean
    version?: string
  } = {}
): Promise<T> {
  const { ttl, tags, forceRefresh = false, version } = options

  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = cacheService.get<T>(cacheKey)
    if (cached !== null) {
      return cached
    }
  }

  // Fetch fresh data
  const data = await fetcher()

  // Store in cache
  cacheService.set(cacheKey, data, { ttl, tags, version })

  return data
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
          
          // Invalidate groups list cache
          cacheService.invalidateByTag(CacheTags.groups)
          
          return groupId
        } catch (error) {
          const { message: _message, severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'createGroup', params }, severity)
          showNotification.error(_message)
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
          
          // Invalidate group-specific and groups list cache
          cacheService.invalidateByTag(CacheTags.group(groupId))
          cacheService.invalidateByTag(CacheTags.groups)
        } catch (error) {
          const { message: _message, severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'joinGroup', groupId }, severity)
          showNotification.error(_message)
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
          
          // Invalidate group status and transaction caches
          cacheService.invalidateByTag(CacheTags.group(groupId))
          cacheService.invalidateByTag(CacheTags.transactions)
        } catch (error) {
          const { message: _message, severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'contribute', groupId, amount }, severity)
          showNotification.error(_message)
          throw error
        }
      })
    },

    getGroupStatus: async (groupId: string, useCache: boolean = true) => {
      return analytics.measureAsync('get_group_status', async () => {
        try {
          const cacheKey = CacheKeys.groupStatus(groupId)
          
          return await cachedFetch(
            cacheKey,
            async () => {
              return await withRetry(
                async () => {
                  console.log('TODO: Implement getGroupStatus', groupId)
                  return {
                    groupId,
                    status: 'active',
                    currentCycle: 1,
                    totalContributions: 0,
                    // ... other status fields
                  }
                },
                'getGroupStatus'
              )
            },
            {
              ttl: CACHE_TTL.GROUP_STATUS,
              tags: [CacheTags.groups, CacheTags.group(groupId)],
              forceRefresh: !useCache,
            }
          )
        } catch (error) {
          const { severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'getGroupStatus', groupId }, severity)
          throw error
        }
      })
    },

    getGroupMembers: async (groupId: string, useCache: boolean = true) => {
      return analytics.measureAsync('get_group_members', async () => {
        try {
          const cacheKey = CacheKeys.groupMembers(groupId)
          
          return await cachedFetch(
            cacheKey,
            async () => {
              return await withRetry(
                async () => {
                  console.log('TODO: Implement getGroupMembers', groupId)
                  return []
                },
                'getGroupMembers'
              )
            },
            {
              ttl: CACHE_TTL.GROUP_MEMBERS,
              tags: [CacheTags.groups, CacheTags.group(groupId)],
              forceRefresh: !useCache,
            }
          )
        } catch (error) {
          const { severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'getGroupMembers', groupId }, severity)
          throw error
        }
      })
    },

    getUserGroups: async (userId: string, useCache: boolean = true) => {
      return analytics.measureAsync('get_user_groups', async () => {
        try {
          const cacheKey = CacheKeys.userGroups(userId)
          
          return await cachedFetch(
            cacheKey,
            async () => {
              return await withRetry(
                async () => {
                  console.log('TODO: Implement getUserGroups', userId)
                  return []
                },
                'getUserGroups'
              )
            },
            {
              ttl: CACHE_TTL.GROUP_LIST,
              tags: [CacheTags.groups, CacheTags.user(userId)],
              forceRefresh: !useCache,
            }
          )
        } catch (error) {
          const { severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'getUserGroups', userId }, severity)
          throw error
        }
      })
    },

    invalidateGroupCache: (groupId: string) => {
      cacheService.invalidateByTag(CacheTags.group(groupId))
      analytics.trackEvent({
        category: 'Cache',
        action: 'Invalidation',
        label: 'group',
        metadata: { groupId },
      })
    },

    invalidateUserCache: (userId: string) => {
      cacheService.invalidateByTag(CacheTags.user(userId))
      analytics.trackEvent({
        category: 'Cache',
        action: 'Invalidation',
        label: 'user',
        metadata: { userId },
      })
    },

    clearCache: () => {
      cacheService.clear()
      analytics.trackEvent({
        category: 'Cache',
        action: 'Invalidation',
        label: 'full_clear',
      })
    },
  }
}

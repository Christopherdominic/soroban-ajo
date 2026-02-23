// Issue #25: Integrate Stellar SDK for contract interaction
// Complexity: Medium (150 pts)
// Status: Enhanced with retry mechanisms, error handling, and intelligent caching
// #80: Performance metrics and stable references for frontend re-render optimization

import { analytics, trackUserAction } from './analytics'
import { showNotification } from '../utils/notifications'
import { cacheService, CacheKeys, CacheTags } from './cache'
import * as SorobanClient from 'stellar-sdk'
import { requestAccess, signTransaction, isConnected, isAllowed, setAllowed } from '@stellar/freighter-api'
import { SorobanTransactionResponse } from '../types'

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
  getTransactions: (groupId: string, cursor?: string, limit?: number) => Promise<{ transactions: any[], nextCursor?: string }>
  invalidateGroupCache: (groupId: string) => void
  invalidateUserCache: (userId: string) => void
  clearCache: () => void
}

/** Performance mark names for DevTools / Performance API */
const PERF_MARKS = {
  fetchStart: (op: string) => `soroban_${op}_start`,
  fetchEnd: (op: string) => `soroban_${op}_end`,
  cacheHit: (op: string) => `soroban_${op}_cache_hit`,
} as const

/**
 * Cached fetch wrapper with stale-while-revalidate.
 * Uses performance marks for metrics (#80); returns same reference for cached data to aid React re-render optimization.
 */
async function cachedFetch<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number
    tags?: string[]
    forceRefresh?: boolean
    version?: string
    operationName?: string
  } = {}
): Promise<T> {
  const { ttl, tags, forceRefresh = false, version, operationName = 'fetch' } = options
  const op = operationName

  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(PERF_MARKS.fetchStart(op))
  }

  if (!forceRefresh) {
    const cached = cacheService.get<T>(cacheKey)
    if (cached !== null) {
      if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark(PERF_MARKS.cacheHit(op))
        performance.measure(`soroban_${op}`, PERF_MARKS.fetchStart(op), PERF_MARKS.cacheHit(op))
      }
      return cached
    }
  }

  const data = await fetcher()
  cacheService.set(cacheKey, data, { ttl, tags, version })

  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(PERF_MARKS.fetchEnd(op))
    performance.measure(`soroban_${op}`, PERF_MARKS.fetchStart(op), PERF_MARKS.fetchEnd(op))
  }

  return data
}

export const initializeSoroban = (): SorobanService => {
  const isTestEnvironment = process.env.NODE_ENV === 'test'

  // Create SorobanRpc client with RPC_URL
  const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org'
  const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015'
  const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || ''

  const server = new SorobanClient.SorobanRpc.Server(RPC_URL)

  return {
    createGroup: async (params: CreateGroupParams) => {
      return analytics.measureAsync('create_group', async () => {
        try {
          // Wrap in retry logic
          const groupId = await withRetry(
            async () => {
              if (isTestEnvironment || !CONTRACT_ID) {
                // Mock execution for test environment or missing contract
                await new Promise((resolve) => setTimeout(resolve, 2000))
                return `mock_group_${Date.now()}`
              }

              // Verify wallet connection
              if (!(await isConnected())) {
                throw new Error("Freighter wallet is not installed.");
              }
              if (!(await isAllowed())) {
                await setAllowed();
              }

              const accessResult = await requestAccess();
              if (accessResult.error || !accessResult.address) {
                const error: any = new Error(accessResult.error || "User public key not available.")
                error.code = 'UNAUTHORIZED'
                throw error
              }
              const publicKey = accessResult.address;

              const sourceAccount = await server.getAccount(publicKey)

              // Pack parameters for Soroban XDR
              const callArgs = [
                SorobanClient.xdr.ScVal.scvString(params.groupName),
                SorobanClient.xdr.ScVal.scvU32(params.cycleLength),
                SorobanClient.xdr.ScVal.scvU32(params.contributionAmount),
                SorobanClient.xdr.ScVal.scvU32(params.maxMembers),
              ]

              const contract = new SorobanClient.Contract(CONTRACT_ID)
              const transaction = new SorobanClient.TransactionBuilder(sourceAccount, {
                fee: "100", // Basic fee, update upon simulateTransaction response
                networkPassphrase: NETWORK_PASSPHRASE,
              })
                .addOperation(contract.call('create_group', ...callArgs))
                .setTimeout(30)
                .build()

              // Simulate the transaction to get real footprint and fee estimations
              const simulated = await server.simulateTransaction(transaction)

              if (!SorobanClient.SorobanRpc.Api.isSimulationSuccess(simulated)) {
                const error: any = new Error("Transaction simulation failed")
                error.code = 'CONTRACT_ERROR'
                throw error
              }

              // Assemble real transaction with data payload footprint
              const assembled = SorobanClient.SorobanRpc.assembleTransaction(transaction, simulated).build()

              // Request Freighter signature
              const signedXdr = await signTransaction(assembled.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE })
              const signedTransaction = SorobanClient.TransactionBuilder.fromXDR(signedXdr.signedTxXdr, NETWORK_PASSPHRASE)

              const sendResult = await server.sendTransaction(signedTransaction as SorobanClient.Transaction)

              if (sendResult.errorResult) {
                throw new Error(`Transaction submitted with error: ${sendResult.errorResult.toXDR().toString("base64")}`)
              }

              // Wait.
              let statusResponse = await server.getTransaction(sendResult.hash)
              let attempts = 0
              while (statusResponse.status !== SorobanClient.SorobanRpc.Api.GetTransactionStatus.SUCCESS && attempts < 10) {
                await new Promise((resolve) => setTimeout(resolve, 2000))
                statusResponse = await server.getTransaction(sendResult.hash)
                attempts++
              }

              if (statusResponse.status !== SorobanClient.SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
                throw new Error("Transaction did not complete successfully in time.")
              }

              // Since create_group likely returns the new group_id as an integer or string (based on Rust traits string vs integer sequence):
              // For robustness, parse the returned value from the resultXdr footprint, but default to tx-hash if unprocessable.
              return sendResult.hash
            },
            'createGroup',
            {
              shouldRetry: (error) => {
                // Don't retry validation errors
                if (error.code === 'INVALID_PARAMETERS' || error.code === 'UNAUTHORIZED') return false
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
              if (amount <= 0) {
                const error: any = new Error('Amount must be greater than zero')
                error.code = 'INVALID_PARAMETERS'
                throw error
              }
              // Simulate real contract call with delay
              await new Promise((resolve) => setTimeout(resolve, 2000))

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
              operationName: 'getGroupStatus',
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

                  return []
                },
                'getGroupMembers'
              )
            },
            {
              ttl: CACHE_TTL.GROUP_MEMBERS,
              tags: [CacheTags.groups, CacheTags.group(groupId)],
              forceRefresh: !useCache,
              operationName: 'getGroupMembers',
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

                  return []
                },
                'getUserGroups'
              )
            },
            {
              ttl: CACHE_TTL.GROUP_LIST,
              tags: [CacheTags.groups, CacheTags.user(userId)],
              forceRefresh: !useCache,
              operationName: 'getUserGroups',
            }
          )
        } catch (error) {
          const { severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'getUserGroups', userId }, severity)
          throw error
        }
      })
    },

    getTransactions: async (groupId: string, cursor?: string, limit: number = 10) => {
      return analytics.measureAsync('get_transactions', async () => {
        try {
          const cacheKey = CacheKeys.transactions(groupId, cursor, limit)

          return await cachedFetch(
            cacheKey,
            async () => {
              return await withRetry(
                async () => {

                  // Here we will use the Stellar SDK to query contract events
                  // For now, return the mock data format so the UI works
                  return {
                    transactions: [
                      {
                        id: `tx-1-${cursor || 'start'}`,
                        groupId,
                        type: 'contribution',
                        amount: 500,
                        date: '2026-02-10T12:00:00Z',
                        member: 'GAAAA...AAAA',
                        status: 'completed',
                        hash: '0x123...', // Added for details
                      },
                      {
                        id: `tx-2-${cursor || 'start'}`,
                        groupId,
                        type: 'contribution',
                        amount: 500,
                        date: '2026-02-11T12:00:00Z',
                        member: 'GBBBB...BBBB',
                        status: 'completed',
                        hash: '0x456...',
                      },
                      {
                        id: `tx-3-${cursor || 'start'}`,
                        groupId,
                        type: 'payout',
                        amount: 4000,
                        date: '2026-02-12T12:00:00Z',
                        member: 'GCCCC...CCCC',
                        status: 'completed',
                        hash: '0x789...',
                      },
                    ],
                    nextCursor: cursor ? undefined : 'cursor-2', // Mock pagination
                  }
                },
                'getTransactions'
              )
            },
            {
              ttl: CACHE_TTL.TRANSACTIONS,
              tags: [CacheTags.transactions, CacheTags.group(groupId)],
              operationName: 'getTransactions',
            }
          )
        } catch (error) {
          const { severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'getTransactions', groupId }, severity)
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

// Issue #25: Integrate Stellar SDK for contract interaction
// Complexity: Medium (150 pts)
// Status: Enhanced with retry mechanisms, error handling, and intelligent caching

import { rpc, Networks, Contract, TransactionBuilder, Transaction, nativeToScVal, scValToNative } from 'stellar-sdk'
import { analytics, trackUserAction } from './analytics'
import { showNotification } from '../utils/notifications'
import { cacheService, CacheKeys, CacheTags } from './cache'

// Contract configuration from environment
const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || process.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org'
const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE || process.env.VITE_STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET
const CONTRACT_ID = process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID || process.env.VITE_SOROBAN_CONTRACT_ID

// Initialize RPC server
const server = new rpc.Server(RPC_URL)

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

  if (circuitBreaker.isOpen()) {
    throw new Error(`Circuit breaker is open for ${operationName}. Service temporarily unavailable.`)
  }

  let lastError: any
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation()
      circuitBreaker.recordSuccess()
      return result
    } catch (error) {
      lastError = error
      analytics.trackError(
        error as Error,
        {
          operation: operationName,
          attempt: attempt + 1,
          maxRetries: maxRetries + 1,
        },
        attempt === maxRetries ? 'high' : 'medium'
      )

      if (attempt < maxRetries && shouldRetry(error)) {
        console.warn(
          `[Retry] ${operationName} failed (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delay}ms...`,
          error
        )
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= backoffMultiplier
      } else {
        break
      }
    }
  }

  circuitBreaker.recordFailure()
  throw lastError
}

function isRetryableError(error: any): boolean {
  if (error.name === 'NetworkError' || error.message?.includes('network')) return true
  if (error.name === 'TimeoutError' || error.message?.includes('timeout')) return true
  if (error.status === 429 || error.code === 'RATE_LIMIT_EXCEEDED') return true
  if (error.status >= 500 && error.status < 600) return true
  if (error.code === 'TRANSACTION_PENDING' || error.code === 'TRY_AGAIN_LATER') return true
  return false
}

function classifyError(error: any): { message: string; severity: 'low' | 'medium' | 'high' | 'critical' } {
  if (error.code === 'INSUFFICIENT_BALANCE') {
    return { message: 'Insufficient balance to complete transaction', severity: 'medium' }
  }
  if (error.code === 'INVALID_PARAMETERS') {
    return { message: 'Invalid parameters provided', severity: 'medium' }
  }
  if (error.code === 'UNAUTHORIZED') {
    return { message: 'Wallet authorization required', severity: 'medium' }
  }
  if (error.name === 'NetworkError' || error.message?.includes('network')) {
    return { message: 'Network connection error. Please check your connection.', severity: 'high' }
  }
  if (error.code === 'CONTRACT_ERROR') {
    return { message: 'Smart contract execution failed', severity: 'high' }
  }
  return { message: 'An unexpected error occurred', severity: 'critical' }
}

export interface CreateGroupParams {
  groupName: string
  cycleLength: number
  contributionAmount: number | bigint
  maxMembers: number
}

export interface SorobanService {
  createGroup: (params: CreateGroupParams, signer: (xdr: string) => Promise<string>) => Promise<string>
  joinGroup: (groupId: string, signer: (xdr: string) => Promise<string>) => Promise<void>
  contribute: (groupId: string, amount: number | bigint, signer: (xdr: string) => Promise<string>) => Promise<void>
  getGroupStatus: (groupId: string, useCache?: boolean) => Promise<any>
  getGroupMembers: (groupId: string, useCache?: boolean) => Promise<any[]>
  getUserGroups: (userId: string, useCache?: boolean) => Promise<any[]>
  invalidateGroupCache: (groupId: string) => void
  invalidateUserCache: (userId: string) => void
  clearCache: () => void
}

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

  if (!forceRefresh) {
    const cached = cacheService.get<T>(cacheKey)
    if (cached !== null) {
      return cached
    }
  }

  const data = await fetcher()
  cacheService.set(cacheKey, data, { ttl, tags, version })
  return data
}

async function sendTransaction(signedXdr: string): Promise<rpc.Api.GetTransactionResponse> {
  const tx = new Transaction(signedXdr, NETWORK_PASSPHRASE)
  const response = await server.sendTransaction(tx)

  if (response.status === 'ERROR') {
    throw new Error(`Transaction failed with status ERROR.`)
  }

  let txResponse = await server.getTransaction(response.hash)
  while (txResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    txResponse = await server.getTransaction(response.hash)
  }

  return txResponse
}

export const initializeSoroban = (): SorobanService => {
  if (!CONTRACT_ID) {
    console.warn('VITE_SOROBAN_CONTRACT_ID is not defined. Some features may not work.')
  }

  const contract = new Contract(CONTRACT_ID || '')

  return {
    createGroup: async (params: CreateGroupParams, signer: (xdr: string) => Promise<string>) => {
      return analytics.measureAsync('create_group', async () => {
        try {
          if (!CONTRACT_ID) throw new Error('Contract ID required')

          const call = contract.call('create_group',
            nativeToScVal(params.groupName, { type: 'string' }),
            nativeToScVal(params.cycleLength, { type: 'u64' }),
            nativeToScVal(params.contributionAmount, { type: 'u128' }),
            nativeToScVal(params.maxMembers, { type: 'u32' })
          )

          const tx = new TransactionBuilder(
            await server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'),
            { fee: '100', networkPassphrase: NETWORK_PASSPHRASE }
          )
            .addOperation(call)
            .setTimeout(30)
            .build()

          const simulation = await server.simulateTransaction(tx)
          if (!rpc.Api.isSimulationSuccess(simulation)) throw new Error('Simulation failed')

          const signedXdr = await signer(tx.toXDR())
          await sendTransaction(signedXdr)

          trackUserAction.groupCreated('new_group', params)
          showNotification.success('Group created successfully!')
          cacheService.invalidateByTag(CacheTags.groups)
          return 'new_group'
        } catch (error) {
          const { message: _message, severity } = classifyError(error)
          analytics.trackError(error as Error, { operation: 'createGroup', params }, severity)
          showNotification.error(_message)
          throw error
        }
      })
    },

    joinGroup: async (groupId: string, signer: (xdr: string) => Promise<string>) => {
      return analytics.measureAsync('join_group', async () => {
        try {
          if (!CONTRACT_ID) throw new Error('Contract ID required')

          const call = contract.call('join_group', nativeToScVal(groupId, { type: 'u64' }))
          const tx = new TransactionBuilder(
            await server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'),
            { fee: '100', networkPassphrase: NETWORK_PASSPHRASE }
          )
            .addOperation(call)
            .setTimeout(30)
            .build()

          const signedXdr = await signer(tx.toXDR())
          await sendTransaction(signedXdr)

          trackUserAction.groupJoined(groupId)
          showNotification.success('Successfully joined group!')
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

    contribute: async (groupId: string, amount: number | bigint, signer: (xdr: string) => Promise<string>) => {
      return analytics.measureAsync('contribute', async () => {
        try {
          if (!CONTRACT_ID) throw new Error('Contract ID required')

          const call = contract.call('contribute',
            nativeToScVal(groupId, { type: 'u64' }),
            nativeToScVal(amount, { type: 'u128' })
          )
          const tx = new TransactionBuilder(
            await server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'),
            { fee: '100', networkPassphrase: NETWORK_PASSPHRASE }
          )
            .addOperation(call)
            .setTimeout(30)
            .build()

          const signedXdr = await signer(tx.toXDR())
          await sendTransaction(signedXdr)

          trackUserAction.contributionMade(groupId, Number(amount))
          showNotification.success(`Contribution of ${amount} XLM successful!`)
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
                  if (!CONTRACT_ID) throw new Error('Contract ID required')

                  const call = contract.call('get_group_status', nativeToScVal(groupId, { type: 'u64' }))

                  const tx = new TransactionBuilder(
                    await server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'),
                    { fee: '100', networkPassphrase: NETWORK_PASSPHRASE }
                  )
                    .addOperation(call)
                    .setTimeout(30)
                    .build()

                  const simulation = await server.simulateTransaction(tx)

                  if (rpc.Api.isSimulationSuccess(simulation) && simulation.result) {
                    return scValToNative(simulation.result.retval)
                  }

                  throw new Error('Contract simulation failed')
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
                  if (!CONTRACT_ID) throw new Error('Contract ID required')

                  const call = contract.call('list_members', nativeToScVal(groupId, { type: 'u64' }))
                  const tx = new TransactionBuilder(
                    await server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'),
                    { fee: '100', networkPassphrase: NETWORK_PASSPHRASE }
                  )
                    .addOperation(call)
                    .setTimeout(30)
                    .build()

                  const simulation = await server.simulateTransaction(tx)

                  if (rpc.Api.isSimulationSuccess(simulation) && simulation.result) {
                    return scValToNative(simulation.result.retval)
                  }

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
                  console.log('TODO: Implement getUserGroups with events', userId)
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

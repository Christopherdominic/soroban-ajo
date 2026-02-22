/**
 * Contract Data Management with Intelligent Caching
 * 
 * Features:
 * - React Query integration for server state
 * - Multi-layer caching (React Query + custom cache service)
 * - Automatic cache invalidation on mutations
 * - Stale-while-revalidate for better UX
 * - Optimistic updates
 * - Background refetching
 * - Cache busting strategies
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { initializeSoroban } from '../services/soroban'
import { cacheService, CacheKeys, CacheTags } from '../services/cache'
import { analytics } from '../services/analytics'
import { Group } from '@/types'

// Initialize Soroban service
const sorobanService = initializeSoroban()

// React Query default options with caching strategy
const DEFAULT_QUERY_OPTIONS = {
  staleTime: 30 * 1000, // Consider data fresh for 30 seconds
  cacheTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  refetchOnWindowFocus: true, // Refetch when user returns to tab
  refetchOnReconnect: true, // Refetch when network reconnects
  retry: 2, // Retry failed requests twice
}

interface CacheOptions {
  useCache?: boolean
  bustCache?: boolean
}

/**
 * Fetch user's groups with intelligent caching
 */
export const useGroups = (userId?: string, options: CacheOptions = {}): { data: Group[], isLoading: boolean, error: Error | null } => {
  const { useCache = true, bustCache = false } = options

  return useQuery({
    queryKey: ['groups', userId],
    queryFn: async (): Promise<Group[]> => {
      // Bust cache if requested
      if (bustCache && userId) {
        cacheService.invalidate(CacheKeys.userGroups(userId))
      }

      // Fetch with caching
      if (userId) {
        return await sorobanService.getUserGroups(userId, useCache)
      }

      console.log('TODO: Fetch all groups from contract')
      return []
    },
    ...DEFAULT_QUERY_OPTIONS,
    enabled: !!userId, // Only run if userId is provided
  }) as any
}

/**
 * Fetch single group detail with caching
 */
export const useGroupDetail = (groupId: string, options: CacheOptions = {}) => {
  const { useCache = true, bustCache = false } = options

  return useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      // Bust cache if requested
      if (bustCache) {
        cacheService.invalidate(CacheKeys.group(groupId))
      }

      return await sorobanService.getGroupStatus(groupId, useCache)
    },
    ...DEFAULT_QUERY_OPTIONS,
    enabled: !!groupId,
    onError: (error: Error) => {
      analytics.trackError(error, { operation: 'useGroupDetail', groupId }, 'medium')
    },
  })
}

/**
 * Fetch group members with caching
 */
export const useGroupMembers = (groupId: string, options: CacheOptions = {}) => {
  const { useCache = true, bustCache = false } = options

  return useQuery({
    queryKey: ['groupMembers', groupId],
    queryFn: async () => {
      // Bust cache if requested
      if (bustCache) {
        cacheService.invalidate(CacheKeys.groupMembers(groupId))
      }

      return await sorobanService.getGroupMembers(groupId, useCache)
    },
    ...DEFAULT_QUERY_OPTIONS,
    staleTime: 60 * 1000, // Members change less frequently
    enabled: !!groupId,
    onError: (error: Error) => {
      analytics.trackError(error, { operation: 'useGroupMembers', groupId }, 'medium')
    },
  })
}

interface CreateGroupParams {
  groupName: string
  cycleLength: number
  contributionAmount: number
  maxMembers: number
}

interface CreateGroupResult {
  groupId: string
}

interface CreateGroupContext {
  previousGroups?: unknown
}

/**
 * Create group mutation with cache invalidation
 */
export const useCreateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateGroupResult, Error, CreateGroupParams, CreateGroupContext>({
    mutationFn: async (params: CreateGroupParams) => {
      const groupId = await sorobanService.createGroup(params)
      return { groupId }
    },
    onMutate: async (params: CreateGroupParams) => {
      // Optimistic update: Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['groups'] })

      // Snapshot previous value
      const previousGroups = queryClient.getQueryData(['groups'])

      // Optimistically update to the new value
      queryClient.setQueryData(['groups'], (old: any) => {
        return [...(old || []), { ...params, id: 'temp_id', status: 'creating' }]
      })

      return { previousGroups }
    },
    onSuccess: (_data: CreateGroupResult) => {
      // Invalidate and refetch groups
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      
      // Invalidate custom cache
      cacheService.invalidateByTag(CacheTags.groups)
      
      analytics.trackEvent({
        category: 'Cache',
        action: 'Group Created',
      })
    },
    onError: (error: Error, _variables: CreateGroupParams, context?: CreateGroupContext) => {
      // Rollback optimistic update
      if (context?.previousGroups) {
        queryClient.setQueryData(['groups'], context.previousGroups)
      }
      
      analytics.trackError(error, { operation: 'createGroup' }, 'high')
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

interface JoinGroupResult {
  groupId: string
}

/**
 * Join group mutation with cache invalidation
 */
export const useJoinGroup = () => {
  const queryClient = useQueryClient()

  return useMutation<JoinGroupResult, Error, string>({
    mutationFn: async (groupId: string) => {
      await sorobanService.joinGroup(groupId)
      return { groupId }
    },
    onSuccess: (_data: JoinGroupResult) => {
      // Invalidate group-specific queries
      queryClient.invalidateQueries({ queryKey: ['group', _data.groupId] })
      queryClient.invalidateQueries({ queryKey: ['groupMembers', _data.groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      
      // Invalidate custom cache
      sorobanService.invalidateGroupCache(_data.groupId)
      
      analytics.trackEvent({
        category: 'Cache',
        action: 'Group Joined',
      })
    },
    onError: (error: Error) => {
      analytics.trackError(error, { operation: 'joinGroup' }, 'high')
    },
  })
}

interface ContributeParams {
  groupId: string
  amount: number
}

interface ContributeContext {
  previousGroup?: unknown
}

/**
 * Contribute mutation with cache invalidation
 */
export const useContribute = () => {
  const queryClient = useQueryClient()

  return useMutation<ContributeParams, Error, ContributeParams, ContributeContext>({
    mutationFn: async (params: ContributeParams) => {
      await sorobanService.contribute(params.groupId, params.amount)
      return params
    },
    onMutate: async (params: ContributeParams) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['group', params.groupId] })

      // Snapshot previous value
      const previousGroup = queryClient.getQueryData(['group', params.groupId])

      // Optimistically update
      queryClient.setQueryData(['group', params.groupId], (old: any) => {
        if (!old) return old
        return {
          ...old,
          totalContributions: (old.totalContributions || 0) + params.amount,
        }
      })

      return { previousGroup }
    },
    onSuccess: (data: ContributeParams) => {
      // Invalidate group and contributions
      queryClient.invalidateQueries({ queryKey: ['group', data.groupId] })
      queryClient.invalidateQueries({ queryKey: ['groupMembers', data.groupId] })
      queryClient.invalidateQueries({ queryKey: ['transactions', data.groupId] })
      
      // Invalidate custom cache
      sorobanService.invalidateGroupCache(data.groupId)
      
      analytics.trackEvent({
        category: 'Cache',
        action: 'Contribution Made',
        label: data.groupId,
        value: data.amount,
      })
    },
    onError: (error: Error, variables: ContributeParams, context?: ContributeContext) => {
      // Rollback optimistic update
      if (context?.previousGroup) {
        queryClient.setQueryData(['group', variables.groupId], context.previousGroup)
      }
      
      analytics.trackError(error, { operation: 'contribute' }, 'high')
    },
  })
}

/**
 * Manual cache invalidation hook
 */
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient()

  return {
    invalidateGroup: (groupId: string) => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groupMembers', groupId] })
      sorobanService.invalidateGroupCache(groupId)
    },
    invalidateGroups: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      cacheService.invalidateByTag(CacheTags.groups)
    },
    invalidateUser: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: ['groups', userId] })
      sorobanService.invalidateUserCache(userId)
    },
    bustAllCache: () => {
      queryClient.clear()
      sorobanService.clearCache()
    },
  }
}

/**
 * Cache metrics hook for monitoring
 */
export const useCacheMetrics = () => {
  return useQuery({
    queryKey: ['cacheMetrics'],
    queryFn: () => {
      const metrics = cacheService.getMetrics()
      const hitRate = cacheService.getHitRate()
      const state = cacheService.exportState()
      
      return {
        ...metrics,
        hitRate,
        hitRatePercentage: (hitRate * 100).toFixed(2),
        state,
      }
    },
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000,
  })
}

/**
 * Prefetch data for better UX
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient()

  return {
    prefetchGroup: (groupId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['group', groupId],
        queryFn: () => sorobanService.getGroupStatus(groupId),
        staleTime: 30 * 1000,
      })
    },
    prefetchGroupMembers: (groupId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['groupMembers', groupId],
        queryFn: () => sorobanService.getGroupMembers(groupId),
        staleTime: 60 * 1000,
      })
    },
  }
}

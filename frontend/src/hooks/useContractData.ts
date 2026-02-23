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
 * - Memoization and stable selectors to reduce re-renders (#80)
 * - Performance metrics integration
 */

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { initializeSoroban } from '../services/soroban'
import { cacheService, CacheKeys, CacheTags } from '../services/cache'
import { analytics } from '../services/analytics'
import { showNotification } from '../utils/notifications'
import { Group } from '@/types'

// Initialize Soroban service (singleton, stable reference)
const sorobanService = initializeSoroban()

// --- Constants & Keys ---
export const QUERY_KEYS = {
  GROUPS: ['groups'] as const,
  USER_GROUPS: (userId: string) => ['groups', userId] as const,
  GROUP_DETAIL: (groupId: string) => ['group', groupId] as const,
  GROUP_MEMBERS: (groupId: string) => ['groupMembers', groupId] as const,
  USER_CONTRIBUTIONS: ['user_contributions'] as const,
} as const

// React Query default options - frozen for referential stability and to avoid accidental mutation
const DEFAULT_QUERY_OPTIONS = Object.freeze({
  staleTime: 30 * 1000, // Consider data fresh for 30 seconds
  gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes (formerly cacheTime in RQ v5)
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  retry: 2,
})

// --- Selectors: stable functions so React Query only triggers re-renders when selected value changes ---
// Stable empty references to avoid re-renders when data is loading/undefined

const EMPTY_GROUPS: Group[] = []

export const selectGroupsData = (data: Group[] | undefined): Group[] =>
  data && data.length > 0 ? data : EMPTY_GROUPS
export const selectGroupDetailData = <T>(data: T | undefined): T | undefined => data
export const selectGroupMembersData = <T>(data: T[] | undefined): T[] => data ?? ([] as T[])

interface CacheOptions {
  useCache?: boolean
  bustCache?: boolean
}

/**
 * Fetch user's groups with intelligent caching.
 * Uses stable selector so consumers only re-render when groups array reference changes.
 */
export const useGroups = (
  userId?: string,
  options: CacheOptions = {}
): { data: Group[]; isLoading: boolean; error: Error | null } => {
  const { useCache = true, bustCache = false } = options

  const queryKey = useMemo(
    () => (userId ? QUERY_KEYS.USER_GROUPS(userId) : QUERY_KEYS.GROUPS),
    [userId]
  )

  return useQuery({
    queryKey,
    queryFn: async (): Promise<Group[]> => {
      return analytics.measureAsync('query_groups', async () => {
        if (bustCache && userId) {
          cacheService.invalidate(CacheKeys.userGroups(userId))
        }
        if (userId) {
          return await sorobanService.getUserGroups(userId, useCache)
        }
        return []
      })
    },
    ...DEFAULT_QUERY_OPTIONS,
    enabled: !!userId,
    select: selectGroupsData,
  }) as ReturnType<typeof useQuery<Group[], Error>> & { data: Group[] }
}

/**
 * Fetch single group detail with caching.
 * Stable queryKey and memoized onError to avoid unnecessary re-runs.
 */
export const useGroupDetail = (groupId: string, options: CacheOptions = {}) => {
  const { useCache = true, bustCache = false } = options
  const queryKey = useMemo(() => QUERY_KEYS.GROUP_DETAIL(groupId), [groupId])

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (bustCache) {
        cacheService.invalidate(CacheKeys.group(groupId))
      }
      try {
        return await analytics.measureAsync('query_group_detail', () =>
          sorobanService.getGroupStatus(groupId, useCache)
        )
      } catch (error) {
        analytics.trackError(error as Error, { operation: 'useGroupDetail', groupId }, 'medium')
        throw error
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
    enabled: !!groupId,
    select: selectGroupDetailData,
  })
}

/**
 * Fetch group members with caching.
 * Stable queryKey and memoized onError to reduce re-renders.
 */
export const useGroupMembers = (groupId: string, options: CacheOptions = {}) => {
  const { useCache = true, bustCache = false } = options
  const queryKey = useMemo(() => QUERY_KEYS.GROUP_MEMBERS(groupId), [groupId])

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (bustCache) {
        cacheService.invalidate(CacheKeys.groupMembers(groupId))
      }
      try {
        return await analytics.measureAsync('query_group_members', () =>
          sorobanService.getGroupMembers(groupId, useCache)
        )
      } catch (error) {
        analytics.trackError(error as Error, { operation: 'useGroupMembers', groupId }, 'medium')
        throw error
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
    staleTime: 60 * 1000,
    enabled: !!groupId,
    select: selectGroupMembersData,
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
      showNotification.info(`Creating group: ${params.groupName}...`)
      // Optimistic update: Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.GROUPS })

      // Snapshot previous value
      const previousGroups = queryClient.getQueryData(QUERY_KEYS.GROUPS)

      // Optimistically update to the new value
      queryClient.setQueryData(QUERY_KEYS.GROUPS, (old: any) => {
        return [...(old || []), { ...params, id: 'temp_id', status: 'creating' }]
      })

      return { previousGroups }
    },
    onSuccess: (_data: CreateGroupResult) => {
      showNotification.success('Savings group created successfully!')
      // Invalidate and refetch groups
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS })

      // Invalidate custom cache
      cacheService.invalidateByTag(CacheTags.groups)

      analytics.trackEvent({
        category: 'Cache',
        action: 'Group Created',
      })
    },
    onError: (error: Error, _variables: CreateGroupParams, context?: CreateGroupContext) => {
      showNotification.error(`Failed to create group: ${error.message}`)
      // Rollback optimistic update
      if (context?.previousGroups) {
        queryClient.setQueryData(QUERY_KEYS.GROUPS, context.previousGroups)
      }

      analytics.trackError(error, { operation: 'createGroup' }, 'high')
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS })
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
    onMutate: () => {
      showNotification.info('Joining group...')
    },
    onSuccess: (_data: JoinGroupResult) => {
      showNotification.success('Joined group successfully!')
      // Invalidate group-specific queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_DETAIL(_data.groupId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_MEMBERS(_data.groupId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS })

      // Invalidate custom cache
      sorobanService.invalidateGroupCache(_data.groupId)

      analytics.trackEvent({
        category: 'Cache',
        action: 'Group Joined',
      })
    },
    onError: (error: Error) => {
      showNotification.error(`Failed to join group: ${error.message}`)
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
      showNotification.info(`Processing contribution of $${params.amount}...`)
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.GROUP_DETAIL(params.groupId) })

      // Snapshot previous value
      const previousGroup = queryClient.getQueryData(QUERY_KEYS.GROUP_DETAIL(params.groupId))

      // Optimistically update
      queryClient.setQueryData(QUERY_KEYS.GROUP_DETAIL(params.groupId), (old: any) => {
        if (!old) return old
        return {
          ...old,
          totalContributions: (old.totalContributions || 0) + params.amount,
        }
      })

      return { previousGroup }
    },
    onSuccess: (data: ContributeParams) => {
      showNotification.success(`Successfully contributed $${data.amount}!`)
      // Invalidate group and contributions
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_DETAIL(data.groupId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_MEMBERS(data.groupId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_CONTRIBUTIONS })

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
      showNotification.error(`Contribution failed: ${error.message}`)
      // Rollback optimistic update
      if (context?.previousGroup) {
        queryClient.setQueryData(QUERY_KEYS.GROUP_DETAIL(variables.groupId), context.previousGroup)
      }

      analytics.trackError(error, { operation: 'contribute' }, 'high')
    },
  })
}

/**
 * Manual cache invalidation hook.
 * Returns a stable object with stable function refs to avoid downstream re-renders.
 */
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient()

  const invalidateGroup = useCallback(
    (groupId: string) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_DETAIL(groupId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_MEMBERS(groupId) })
      sorobanService.invalidateGroupCache(groupId)
    },
    [queryClient]
  )

  const invalidateGroups = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS })
    cacheService.invalidateByTag(CacheTags.groups)
  }, [queryClient])

  const invalidateUser = useCallback(
    (userId: string) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_GROUPS(userId) })
      sorobanService.invalidateUserCache(userId)
    },
    [queryClient]
  )

  const bustAllCache = useCallback(() => {
    queryClient.clear()
    sorobanService.clearCache()
  }, [queryClient])

  return useMemo(
    () => ({
      invalidateGroup,
      invalidateGroups,
      invalidateUser,
      bustAllCache,
    }),
    [invalidateGroup, invalidateGroups, invalidateUser, bustAllCache]
  )
}

/**
 * Cache metrics hook for monitoring.
 * Stable queryKey to avoid unnecessary refetches.
 */
const CACHE_METRICS_QUERY_KEY = ['cacheMetrics'] as const

export const useCacheMetrics = () => {
  return useQuery({
    queryKey: CACHE_METRICS_QUERY_KEY,
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
    refetchInterval: 10000,
    staleTime: 5000,
  })
}

/**
 * Prefetch data for better UX.
 * Stable return value to avoid triggering re-renders in consumers.
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient()

  const prefetchGroup = useCallback(
    (groupId: string) => {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.GROUP_DETAIL(groupId),
        queryFn: () => sorobanService.getGroupStatus(groupId),
        staleTime: 30 * 1000,
      })
    },
    [queryClient]
  )

  const prefetchGroupMembers = useCallback(
    (groupId: string) => {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.GROUP_MEMBERS(groupId),
        queryFn: () => sorobanService.getGroupMembers(groupId),
        staleTime: 60 * 1000,
      })
    },
    [queryClient]
  )

  return useMemo(
    () => ({ prefetchGroup, prefetchGroupMembers }),
    [prefetchGroup, prefetchGroupMembers]
  )
}

/**
 * Tracks re-renders and exposes performance metrics for the calling component.
 * Use to identify re-render bottlenecks and to report metrics to analytics.
 * When reportRenderCount is true, reports total render count on unmount.
 */
export const usePerformanceMetrics = (options: PerformanceMetricsOptions = {}) => {
  const { reportRenderCount = false, label = 'unknown' } = options
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  useEffect(() => {
    if (!reportRenderCount) return
    return () => {
      analytics.trackMetric(`render_count_${label}`, renderCountRef.current, {
        label,
        renderCount: renderCountRef.current,
      })
    }
  }, [reportRenderCount, label])

  return useMemo(
    () => ({
      get renderCount() {
        return renderCountRef.current
      },
      getRecentMetrics: (limit = 50) => analytics.getMetrics(limit),
      getStats: () => analytics.getStats(),
    }),
    []
  )
}

export interface PerformanceMetricsOptions {
  /** Report render count to analytics (e.g. for debugging re-render bottlenecks). Default: false in prod. */
  reportRenderCount?: boolean
  /** Component/hook name for analytics label. */
  label?: string
}

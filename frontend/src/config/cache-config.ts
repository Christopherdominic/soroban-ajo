export interface CacheHealthParams {
    hits: number
    misses: number
    size: number
    maxSize: number
    evictions: number
    invalidations: number
}

export interface CacheHealthResult {
    healthy: boolean
    issues: string[]
    warnings: string[]
}

export const checkCacheHealth = (params: CacheHealthParams): CacheHealthResult => {
    const issues: string[] = []
    const warnings: string[] = []

    // Check hit rate
    const total = params.hits + params.misses
    const hitRate = total === 0 ? 0 : params.hits / total

    if (total > 10 && hitRate < 0.1) {
        issues.push(`Critical: Very low hit rate (${(hitRate * 100).toFixed(1)}%)`)
    } else if (total > 5 && hitRate < 0.3) {
        warnings.push(`Low hit rate (${(hitRate * 100).toFixed(1)}%)`)
    }

    // Check size
    if (params.size >= params.maxSize) {
        warnings.push(`Cache is full (${params.size}/${params.maxSize})`)
    }

    // Check evictions
    if (params.evictions > 100) {
        warnings.push(`High eviction rate: ${params.evictions} evictions`)
    }

    return {
        healthy: issues.length === 0,
        issues,
        warnings,
    }
}

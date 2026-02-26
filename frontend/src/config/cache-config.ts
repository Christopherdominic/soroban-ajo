export interface CacheHealthMetrics {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
  evictions: number;
  invalidations: number;
}

export interface CacheHealth {
  healthy: boolean;
  issues: string[];
  warnings: string[];
}

export const checkCacheHealth = (metrics: CacheHealthMetrics): CacheHealth => {
  const issues: string[] = [];
  const warnings: string[] = [];

  const totalRequests = metrics.hits + metrics.misses;
  const hitRate = totalRequests > 0 ? (metrics.hits / totalRequests) : 1;

  if (metrics.size >= metrics.maxSize) {
    issues.push(`Cache is full (${metrics.size}/${metrics.maxSize} entries)`);
  } else if (metrics.size >= metrics.maxSize * 0.9) {
    warnings.push(`Cache is almost full (${metrics.size}/${metrics.maxSize} entries)`);
  }

  if (totalRequests > 100 && hitRate < 0.2) {
    warnings.push(`Low cache hit rate: ${(hitRate * 100).toFixed(1)}%`);
  }

  if (metrics.evictions > metrics.size * 0.1) {
    warnings.push(`High eviction rate detected (${metrics.evictions} evictions)`);
  }

  return {
    healthy: issues.length === 0,
    issues,
    warnings,
  };
};

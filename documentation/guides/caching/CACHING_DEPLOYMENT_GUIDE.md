# Intelligent Caching - Deployment Guide

## 🚀 Pre-Deployment Checklist

Before deploying the caching implementation, ensure all prerequisites are met.

### 1. Install Dependencies

```bash
cd soroban-ajo/frontend

# Install with legacy peer deps to resolve conflicts
npm install --legacy-peer-deps

# Or force install
npm install --force
```

### 2. Verify Installation

```bash
# Check if React Query is installed
npm list @tanstack/react-query

# Should show: @tanstack/react-query@5.28.0
```

### 3. Run Tests

```bash
# Run cache tests
npm run test -- cache.test.ts --run

# Run with coverage
npm run test:coverage -- cache.test.ts

# All tests should pass
```

### 4. Type Check

```bash
# Verify TypeScript compilation
npm run type-check

# Should complete without errors (except missing stellar-sdk which is expected)
```

### 5. Lint Check

```bash
# Run linter
npm run lint

# Fix any issues
npm run lint -- --fix
```

## 🔧 Configuration

### Environment Variables

Ensure these are set in your `.env` files:

#### `.env.development`
```env
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_SOROBAN_CONTRACT_ID=your_contract_id_here
VITE_CACHE_ENABLED=true
VITE_CACHE_DEFAULT_TTL=10000
```

#### `.env.staging`
```env
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_SOROBAN_CONTRACT_ID=your_contract_id_here
VITE_CACHE_ENABLED=true
VITE_CACHE_DEFAULT_TTL=30000
```

#### `.env.production`
```env
VITE_SOROBAN_RPC_URL=https://soroban-mainnet.stellar.org
VITE_SOROBAN_CONTRACT_ID=your_contract_id_here
VITE_CACHE_ENABLED=true
VITE_CACHE_DEFAULT_TTL=300000
```

### Cache Configuration

Review and adjust cache settings in `src/config/cache-config.ts`:

```typescript
// Adjust TTLs based on your needs
const configs: Record<Environment, EnvironmentCacheConfig> = {
  production: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 200,
    staleWhileRevalidate: true,
    enableMetrics: true,
    ttls: {
      groupStatus: 30 * 1000,      // Adjust as needed
      groupMembers: 60 * 1000,     // Adjust as needed
      groupList: 45 * 1000,        // Adjust as needed
      transactions: 2 * 60 * 1000, // Adjust as needed
    },
  },
}
```

## 📦 Build Process

### Development Build

```bash
npm run build:dev
```

### Staging Build

```bash
npm run build:staging
```

### Production Build

```bash
npm run build:production
```

### Verify Build

```bash
# Preview production build
npm run preview:production

# Check build size
ls -lh dist/

# Ensure bundle size is reasonable
```

## 🧪 Pre-Deployment Testing

### 1. Manual Testing

```bash
# Start development server
npm run dev

# Test in browser:
# 1. Load page - verify data loads
# 2. Reload page - verify cache works (instant load)
# 3. Create group - verify cache invalidates
# 4. Check metrics - verify tracking works
```

### 2. Performance Testing

```bash
# Open browser DevTools
# Network tab -> Disable cache
# Measure first load time

# Enable cache
# Measure subsequent load times
# Should be < 100ms for cached data
```

### 3. Security Testing

```bash
# Test input validation
# Try to cache sensitive data
# Verify sanitization works
# Check size limits
```

## 🚀 Deployment Steps

### Step 1: Backup Current State

```bash
# Backup current deployment
git tag -a pre-caching-deployment -m "Before caching implementation"
git push origin pre-caching-deployment
```

### Step 2: Deploy to Staging

```bash
# Build for staging
npm run build:staging

# Deploy to staging environment
# (Use your deployment method: Vercel, Netlify, AWS, etc.)

# Example for Vercel:
vercel --prod --env staging
```

### Step 3: Verify Staging

```bash
# Test staging deployment
# 1. Load application
# 2. Verify caching works
# 3. Check metrics dashboard
# 4. Monitor for errors
# 5. Test all features
```

### Step 4: Monitor Staging

```bash
# Monitor for 24-48 hours
# Check metrics:
# - Cache hit rate > 70%
# - No errors in logs
# - Performance improved
# - User experience good
```

### Step 5: Deploy to Production

```bash
# Build for production
npm run build:production

# Deploy to production
# Example for Vercel:
vercel --prod

# Or your deployment method
```

### Step 6: Post-Deployment Verification

```bash
# Verify production deployment
# 1. Load application
# 2. Verify caching works
# 3. Check metrics
# 4. Monitor error rates
# 5. Check performance
```

## 📊 Monitoring Setup

### 1. Enable Metrics Collection

The caching system automatically tracks metrics. Ensure analytics is configured:

```typescript
// In your app initialization
import { analytics } from '@/services/analytics'

analytics.setUserId(currentUser.id)
```

### 2. Setup Monitoring Dashboard

Access cache metrics in your application:

```typescript
import { useCacheMetrics } from '@/hooks/useContractData'

function MonitoringDashboard() {
  const { data: metrics } = useCacheMetrics()
  
  return (
    <div>
      <h2>Cache Metrics</h2>
      <p>Hit Rate: {metrics.hitRatePercentage}%</p>
      <p>Cache Size: {metrics.size}</p>
      <p>Hits: {metrics.hits}</p>
      <p>Misses: {metrics.misses}</p>
    </div>
  )
}
```

### 3. Setup Alerts

Configure alerts for critical thresholds:

```typescript
import { checkCacheHealth } from '@/config/cache-config'

// Run periodically (e.g., every 5 minutes)
setInterval(() => {
  const metrics = cacheService.getMetrics()
  const health = checkCacheHealth(metrics)
  
  if (!health.healthy) {
    // Send alert
    console.error('Cache health issues:', health.issues)
    // Integrate with your alerting system
  }
}, 5 * 60 * 1000)
```

## 🔍 Post-Deployment Monitoring

### Key Metrics to Monitor

1. **Cache Hit Rate**
   - Target: > 70%
   - Alert if: < 60%
   - Check: Every hour

2. **Response Time**
   - Target: < 100ms (cached)
   - Alert if: > 200ms
   - Check: Continuously

3. **Cache Size**
   - Target: < 90% of max
   - Alert if: > 95%
   - Check: Every 15 minutes

4. **Error Rate**
   - Target: < 1%
   - Alert if: > 5%
   - Check: Continuously

5. **Eviction Rate**
   - Target: < 10/min
   - Alert if: > 20/min
   - Check: Every 5 minutes

### Monitoring Commands

```bash
# View cache state
console.log(cacheService.exportState())

# View metrics
console.log(cacheService.getMetrics())

# Check health
import { checkCacheHealth } from '@/config/cache-config'
console.log(checkCacheHealth(metrics))
```

## 🐛 Troubleshooting

### Issue: Low Cache Hit Rate

**Symptoms**: Hit rate < 60%

**Solutions**:
1. Check TTL settings - may be too short
2. Verify cache invalidation isn't too aggressive
3. Check if data is being cached correctly
4. Review cache size limits

```typescript
// Adjust TTLs
const config = getCacheConfig()
config.ttls.groupStatus = 60 * 1000 // Increase to 60s
```

### Issue: High Memory Usage

**Symptoms**: Cache size > 95% of max

**Solutions**:
1. Increase max cache size
2. Reduce TTLs
3. Implement more aggressive eviction
4. Check for memory leaks

```typescript
// Increase max size
const cache = new CacheService({
  maxSize: 300, // Increase from 200
})
```

### Issue: Stale Data Shown

**Symptoms**: Users see outdated information

**Solutions**:
1. Reduce TTLs
2. Improve cache invalidation
3. Add manual refresh option
4. Check mutation hooks

```typescript
// Force refresh
const { data } = useGroups(userId, { bustCache: true })
```

### Issue: Cache Not Working

**Symptoms**: No performance improvement

**Solutions**:
1. Verify cache is enabled
2. Check environment configuration
3. Review browser console for errors
4. Verify React Query setup

```typescript
// Check if cache is enabled
console.log(cacheService.getMetrics())
```

## 🔄 Rollback Plan

If issues occur, follow this rollback procedure:

### Step 1: Identify Issue

```bash
# Check error logs
# Review metrics
# Identify root cause
```

### Step 2: Quick Fix Attempt

```bash
# Try disabling cache temporarily
VITE_CACHE_ENABLED=false

# Or reduce cache size
# Or increase TTLs
```

### Step 3: Full Rollback

```bash
# Revert to previous deployment
git revert HEAD
git push origin main

# Redeploy previous version
npm run build:production
# Deploy using your method
```

### Step 4: Post-Rollback

```bash
# Verify application works
# Investigate issue
# Fix and redeploy
```

## 📈 Performance Optimization

### After Deployment

1. **Monitor for 1 week**
   - Collect metrics
   - Identify patterns
   - Adjust configurations

2. **Optimize TTLs**
   - Increase for stable data
   - Decrease for frequently changing data
   - Balance freshness vs performance

3. **Tune Cache Size**
   - Increase if eviction rate is high
   - Decrease if memory usage is high
   - Monitor and adjust

4. **Review Invalidation**
   - Ensure not too aggressive
   - Ensure not too lenient
   - Balance consistency vs performance

## ✅ Deployment Checklist

- [ ] Dependencies installed
- [ ] Tests passing
- [ ] Type check passing
- [ ] Lint check passing
- [ ] Environment variables configured
- [ ] Cache configuration reviewed
- [ ] Build successful
- [ ] Staging deployment verified
- [ ] Monitoring setup complete
- [ ] Alerts configured
- [ ] Documentation reviewed
- [ ] Team trained
- [ ] Rollback plan ready
- [ ] Production deployment
- [ ] Post-deployment verification
- [ ] Metrics monitoring active

## 📞 Support

### Getting Help

1. **Documentation**: Review all CACHING_*.md files
2. **Tests**: Check test examples in cache.test.ts
3. **Debugging**: Use `cacheService.exportState()`
4. **Metrics**: Use `useCacheMetrics()` hook
5. **Health**: Use `checkCacheHealth()` function

### Contact

- Technical Lead: [Your Name]
- DevOps Team: [Team Contact]
- On-Call: [On-Call Contact]

## 🎉 Success Criteria

Deployment is successful when:

- ✅ Cache hit rate > 70%
- ✅ Response time < 100ms (cached)
- ✅ No critical errors
- ✅ User experience improved
- ✅ Metrics tracking working
- ✅ Health checks passing
- ✅ Team comfortable with system

## 📚 Additional Resources

- [CACHING_IMPLEMENTATION_COMPLETE.md](./CACHING_IMPLEMENTATION_COMPLETE.md)
- [CACHING_QUICK_REFERENCE.md](./CACHING_QUICK_REFERENCE.md)
- [CACHING_VERIFICATION_CHECKLIST.md](./CACHING_VERIFICATION_CHECKLIST.md)
- [CACHING_FINAL_REPORT.md](./CACHING_FINAL_REPORT.md)

---

**Deployment Guide Version**: 1.0  
**Last Updated**: February 20, 2026  
**Status**: Ready for Deployment

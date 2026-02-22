# Monitoring & Analytics Quick Start

## Setup

The monitoring system is automatically initialized. No configuration needed!

## Track Events

```typescript
import { trackUserAction } from '@/services/analytics'

// Pre-defined actions
trackUserAction.groupCreated(groupId, params)
trackUserAction.contributionMade(groupId, amount)
trackUserAction.walletConnected('Freighter')

// Custom events
import { analytics } from '@/services/analytics'
analytics.trackEvent({
  category: 'Feature',
  action: 'Used',
  label: 'feature_name',
  value: 123,
})
```

## Track Performance

```typescript
import { analytics } from '@/services/analytics'

// Async
const result = await analytics.measureAsync('operation_name', async () => {
  return await someAsyncOperation()
})

// Sync
const result = analytics.measureSync('operation_name', () => {
  return someOperation()
})
```

## Track Errors

```typescript
import { analytics } from '@/services/analytics'

try {
  await riskyOperation()
} catch (error) {
  analytics.trackError(error as Error, { context: 'value' }, 'high')
}
```

## Use Hooks

```typescript
import { usePageView, useAnalytics } from '@/hooks/useAnalytics'

function MyComponent() {
  usePageView('my_page')
  const { trackEvent } = useAnalytics()
  
  // Use trackEvent...
}
```

## View Dashboard

Access the monitoring dashboard component:

```typescript
import { MonitoringDashboard } from '@/components/MonitoringDashboard'

// Render in your app
<MonitoringDashboard />
```

## Error Severity

- **low**: Minor issues
- **medium**: Some functionality affected (default)
- **high**: Core functionality broken
- **critical**: App crash, data loss

## Performance Thresholds

- 🟢 < 100ms: Excellent
- 🟡 100-500ms: Good
- 🟠 500-1000ms: Needs attention
- 🔴 > 1000ms: Critical

## Full Documentation

See [docs/monitoring.md](./monitoring.md) for complete documentation.

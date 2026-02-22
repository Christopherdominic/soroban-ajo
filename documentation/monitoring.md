# Monitoring and Analytics System

## Overview

The Soroban Ajo frontend includes a comprehensive monitoring and analytics system to track performance, user actions, and errors. This system helps identify issues, optimize performance, and understand user behavior.

## Components

### 1. Analytics Service (`services/analytics.ts`)

Core service that tracks:
- **User Events**: Actions like group creation, contributions, wallet connections
- **Performance Metrics**: Function execution times, page load times, API calls
- **Errors**: Application errors with context and severity levels

#### Key Features

- Session tracking with unique session IDs
- User identification
- Automatic performance monitoring
- Error severity classification (low, medium, high, critical)
- Local storage with automatic cleanup
- Backend integration ready

### 2. Monitoring Dashboard (`components/MonitoringDashboard.tsx`)

Real-time dashboard displaying:
- Total events, metrics, and errors
- Error breakdown by severity
- Recent events with timestamps
- Performance metrics with color-coded durations
- Recent errors with stack traces
- Session information

### 3. Analytics Hooks (`hooks/useAnalytics.ts`)

React hooks for easy integration:
- `useAnalytics()` - Access all analytics functions
- `usePageView(pageName)` - Automatic page view tracking
- `usePerformanceTracking(componentName)` - Track component mount times
- `useErrorTracking()` - Simplified error tracking

### 4. Enhanced Services

#### Soroban Service (`services/soroban.ts`)
- Automatic performance tracking for all contract calls
- Error tracking with context
- Success/failure notifications

#### Notification System (`utils/notifications.ts`)
- Tracks all notifications shown to users
- Measures notification promise durations
- Includes metadata for context

#### Error Boundary (`components/ErrorBoundary.tsx`)
- Catches React errors
- Tracks critical errors with component stack
- User-friendly error display

## Usage Examples

### Track User Actions

```typescript
import { trackUserAction } from '../services/analytics'

// Track group creation
trackUserAction.groupCreated('group_123', {
  contributionAmount: 100,
  maxMembers: 10,
})

// Track contribution
trackUserAction.contributionMade('group_123', 100)

// Track wallet connection
trackUserAction.walletConnected('Freighter')
```

### Track Custom Events

```typescript
import { analytics } from '../services/analytics'

analytics.trackEvent({
  category: 'Filter',
  action: 'Applied',
  label: 'contribution_amount',
  value: 100,
  metadata: { min: 50, max: 200 },
})
```

### Track Performance

```typescript
import { analytics } from '../services/analytics'

// Async function
const result = await analytics.measureAsync('fetch_groups', async () => {
  return await fetchGroups()
})

// Sync function
const data = analytics.measureSync('process_data', () => {
  return processData(input)
})
```

### Track Errors

```typescript
import { analytics } from '../services/analytics'

try {
  await riskyOperation()
} catch (error) {
  analytics.trackError(error as Error, {
    operation: 'riskyOperation',
    userId: user.id,
  }, 'high')
}
```

### Use Hooks in Components

```typescript
import { usePageView, useAnalytics } from '../hooks/useAnalytics'

function GroupDetailPage() {
  usePageView('group_detail')
  const { trackEvent } = useAnalytics()

  const handleJoin = () => {
    trackEvent({
      category: 'Group',
      action: 'Join Clicked',
      label: groupId,
    })
  }

  return <div>...</div>
}
```

## Performance Metrics

### Tracked Metrics

- **Page Load**: Total page load time with breakdown (DNS, TCP, TTFB, download, DOM)
- **Component Mount**: Time taken for components to mount
- **Contract Calls**: Duration of all Soroban contract interactions
- **API Calls**: Response times for backend requests
- **Notification Promises**: Time for async operations with notifications

### Performance Thresholds

Color coding in dashboard:
- **Green** (< 100ms): Excellent
- **Yellow** (100-500ms): Good
- **Orange** (500-1000ms): Needs attention
- **Red** (> 1000ms): Critical

## Error Tracking

### Error Severity Levels

- **Low**: Minor issues, doesn't affect functionality
- **Medium**: Affects some functionality, has workaround
- **High**: Affects core functionality, no workaround
- **Critical**: Application crash, data loss risk

### Error Context

All errors include:
- Error message and stack trace
- Session ID and user ID
- Current URL and user agent
- Custom context (operation, parameters, etc.)
- Timestamp

### Error Sources

1. **ErrorBoundary**: React component errors
2. **Service Layer**: Contract call failures, API errors
3. **Manual Tracking**: Caught exceptions in try-catch blocks

## Analytics Events

### Tracked Events

#### Group Events
- `Group.Created` - New group created
- `Group.Joined` - User joined a group
- `Group.Left` - User left a group

#### Contribution Events
- `Contribution.Made` - User made a contribution
- `Contribution.Failed` - Contribution failed

#### Payout Events
- `Payout.Received` - User received a payout
- `Payout.Claimed` - User claimed a payout

#### Wallet Events
- `Wallet.Connected` - Wallet connected
- `Wallet.Disconnected` - Wallet disconnected

#### Navigation Events
- `Navigation.Page View` - Page viewed
- `Navigation.Tab Changed` - Tab switched

#### Search/Filter Events
- `Search.Performed` - Search executed
- `Filter.Applied` - Filter applied

#### Notification Events
- `Notification.Success` - Success notification shown
- `Notification.Error` - Error notification shown
- `Notification.Warning` - Warning notification shown
- `Notification.Info` - Info notification shown

## Dashboard Access

The monitoring dashboard can be accessed at `/monitoring` (when implemented in routing).

Features:
- Real-time updates every 2 seconds
- Last 10 events, metrics, and errors
- Aggregated statistics
- Color-coded severity and performance indicators

## Backend Integration

### Current State
- Events, metrics, and errors are logged to console
- Data stored in memory (cleared on page refresh)
- Automatic cleanup keeps last 1000 entries

### Integration Options

#### Option 1: Custom Backend
```typescript
// In analytics.ts sendToBackend method
fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type, data }),
})
```

#### Option 2: Google Analytics
```typescript
// Add gtag.js
gtag('event', event.action, {
  event_category: event.category,
  event_label: event.label,
  value: event.value,
})
```

#### Option 3: Mixpanel
```typescript
// Add Mixpanel SDK
mixpanel.track(event.action, {
  category: event.category,
  label: event.label,
  value: event.value,
})
```

#### Option 4: PostHog
```typescript
// Add PostHog SDK
posthog.capture(event.action, {
  category: event.category,
  label: event.label,
  value: event.value,
})
```

#### Option 5: Sentry (for errors)
```typescript
// Add Sentry SDK
Sentry.captureException(error, {
  contexts: { custom: context },
  level: severity,
})
```

## Best Practices

### 1. Track Meaningful Events
Only track events that provide actionable insights:
```typescript
// Good
trackUserAction.groupCreated(groupId, params)

// Avoid
trackEvent({ category: 'Button', action: 'Hovered' })
```

### 2. Include Context
Always provide context for errors and important events:
```typescript
analytics.trackError(error, {
  operation: 'createGroup',
  groupId,
  userId,
  params,
}, 'high')
```

### 3. Use Appropriate Severity
Choose error severity based on impact:
- **Critical**: Data loss, security issues, app crashes
- **High**: Core features broken
- **Medium**: Some features affected
- **Low**: Minor issues, cosmetic problems

### 4. Measure Performance
Wrap expensive operations:
```typescript
const result = await analytics.measureAsync('expensive_operation', async () => {
  return await expensiveOperation()
}, { additionalContext: 'value' })
```

### 5. Clean Up
The system automatically cleans up old data, but you can manually trigger:
```typescript
analytics.cleanup()
```

## Privacy Considerations

- No personally identifiable information (PII) is tracked by default
- User IDs are optional and should be anonymized
- Wallet addresses are truncated in logs
- Implement proper consent mechanisms before tracking
- Follow GDPR/CCPA requirements for your jurisdiction

## Testing

### Manual Testing
1. Open browser console
2. Perform actions (create group, contribute, etc.)
3. Check console for `[Analytics]`, `[Performance]`, `[Error]` logs
4. Visit monitoring dashboard to see aggregated data

### Automated Testing
```typescript
import { analytics } from '../services/analytics'

test('tracks group creation', () => {
  analytics.trackEvent({
    category: 'Group',
    action: 'Created',
    label: 'test_group',
  })

  const events = analytics.getEvents()
  expect(events).toHaveLength(1)
  expect(events[0].category).toBe('Group')
})
```

## Future Enhancements

- [ ] Backend integration with analytics service
- [ ] User session replay
- [ ] Heatmaps and click tracking
- [ ] A/B testing framework
- [ ] Funnel analysis
- [ ] Cohort analysis
- [ ] Custom dashboards
- [ ] Alert system for critical errors
- [ ] Performance budgets and alerts
- [ ] Export analytics data

## Troubleshooting

### Events Not Showing
- Check browser console for errors
- Verify analytics service is imported
- Ensure component is wrapped in ErrorBoundary

### Performance Metrics Inaccurate
- Check if browser supports Performance API
- Verify timing calls are properly placed
- Consider network latency in measurements

### Dashboard Not Updating
- Check if interval is running (every 2 seconds)
- Verify component is mounted
- Check for React rendering issues

## Support

For issues or questions about the monitoring system:
1. Check this documentation
2. Review console logs
3. Check monitoring dashboard
4. Open an issue on GitHub

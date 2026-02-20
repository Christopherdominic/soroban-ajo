# Design Document: UI Error and Empty States

## Overview

This design establishes a comprehensive system for handling error states, empty states, and edge cases across the Soroban Ajo application. The design builds upon the existing ErrorBoundary component and notification system (react-hot-toast) to create consistent, accessible, and user-friendly feedback patterns.

The system addresses three primary categories:
1. **Error States**: Network errors, transaction failures, validation errors, permission issues
2. **Empty States**: No data scenarios with actionable guidance
3. **Edge Cases**: Loading states, timeouts, disabled states, confirmations

The design leverages the existing TailwindCSS design system with defined color tokens (primary, secondary, success, error, warning, info) and integrates with the analytics service for error tracking and monitoring.

## Architecture

### Component Hierarchy

```
App
├── ErrorBoundary (Global)
│   └── Router
│       ├── Page-Level ErrorBoundary
│       │   └── Page Components
│       │       ├── Feature-Level ErrorBoundary
│       │       │   └── Feature Components
│       │       └── UI Components
│       └── Toast Container (react-hot-toast)
```

### Error Handling Layers

1. **Global Error Boundary**: Catches unhandled JavaScript errors at the application root
2. **Page-Level Error Boundaries**: Isolate errors to specific pages/routes
3. **Feature-Level Error Boundaries**: Isolate errors to specific features (e.g., group creation, contributions)
4. **Component-Level Error Handling**: Try-catch blocks for async operations
5. **Toast Notifications**: Transient feedback for user actions

### State Management

Error and empty states will be managed through:
- **React Component State**: For component-specific error states
- **Zustand Store** (existing): For global error state and retry mechanisms
- **React Query** (existing): For data fetching error states
- **Toast State** (react-hot-toast): For notification queue management

## Components and Interfaces

### 1. Enhanced ErrorBoundary Component

The existing ErrorBoundary component will be extended with additional features:

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode)
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  level?: 'global' | 'page' | 'feature'
  resetKeys?: any[]
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  retryCount: number
  isRecovering: boolean
  errorId: string
}
```

**Key Methods**:
- `getDerivedStateFromError()`: Capture error state
- `componentDidCatch()`: Log and handle errors
- `attemptRecovery()`: Automatic retry with exponential backoff
- `isRecoverableError()`: Classify error types
- `getErrorMessage()`: User-friendly error messages
- `getRecoveryActions()`: Context-specific recovery options

### 2. ErrorState Component

A reusable component for displaying error states:

```typescript
interface ErrorStateProps {
  title: string
  message: string
  error?: Error
  errorId?: string
  icon?: 'error' | 'warning' | 'network' | 'permission'
  actions?: Array<{
    label: string
    onClick: () => void
    variant: 'primary' | 'secondary' | 'destructive'
    disabled?: boolean
  }>
  showTechnicalDetails?: boolean
  size?: 'sm' | 'md' | 'lg'
}
```

**Visual Design**:
- Icon (SVG) at top center
- Title (text-2xl, font-bold)
- Message (text-gray-600)
- Technical details (collapsible, dev mode only)
- Action buttons (horizontal layout)
- Error ID (small text, bottom)

### 3. EmptyState Component

A reusable component for empty data scenarios:

```typescript
interface EmptyStateProps {
  title: string
  description: string
  illustration?: React.ReactNode | 'groups' | 'activity' | 'search' | 'notifications'
  actions?: Array<{
    label: string
    onClick: () => void
    variant: 'primary' | 'secondary'
    icon?: React.ReactNode
  }>
  size?: 'sm' | 'md' | 'lg'
}
```

**Visual Design**:
- Illustration/icon (SVG, 120x120px for md size)
- Title (text-xl, font-semibold)
- Description (text-gray-600, max-w-md)
- Action buttons (vertical or horizontal layout)
- Subtle background pattern (optional)

### 4. LoadingState Component

A component for loading and skeleton states:

```typescript
interface LoadingStateProps {
  type: 'spinner' | 'skeleton' | 'progress'
  message?: string
  progress?: number
  size?: 'sm' | 'md' | 'lg'
  layout?: 'card' | 'list' | 'table' | 'form'
}
```

**Skeleton Layouts**:
- **Card**: Rectangular blocks with rounded corners
- **List**: Repeated rows with avatar + text lines
- **Table**: Header + rows with columns
- **Form**: Label + input field patterns

### 5. ConfirmationDialog Component

A modal for confirming destructive or important actions:

```typescript
interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'warning' | 'danger' | 'info'
  requiresExplicitConfirmation?: boolean
  confirmationText?: string
  isLoading?: boolean
}
```

**Visual Design**:
- Modal overlay (backdrop-blur)
- Dialog box (max-w-md, centered)
- Icon based on variant
- Title and message
- Optional confirmation input field
- Action buttons (cancel + confirm)

### 6. Toast Notification Enhancements

Extend the existing notification system:

```typescript
interface ToastOptions {
  duration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
}

interface NotificationSystem {
  success(message: string, options?: ToastOptions): string
  error(message: string, options?: ToastOptions): string
  warning(message: string, options?: ToastOptions): string
  info(message: string, options?: ToastOptions): string
  loading(message: string, options?: ToastOptions): string
  promise<T>(promise: Promise<T>, messages: PromiseMessages, options?: ToastOptions): Promise<T>
  update(id: string, message: string, type: 'success' | 'error' | 'loading'): void
  dismiss(id?: string): void
}
```

### 7. Error Classification System

```typescript
enum ErrorType {
  NETWORK = 'network',
  TRANSACTION = 'transaction',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  TIMEOUT = 'timeout',
  CONTRACT = 'contract',
  WALLET = 'wallet',
  UNKNOWN = 'unknown',
}

enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

interface ClassifiedError {
  type: ErrorType
  severity: ErrorSeverity
  message: string
  userMessage: string
  isRetryable: boolean
  suggestedActions: string[]
  technicalDetails?: any
}

function classifyError(error: Error): ClassifiedError
```

### 8. Retry Mechanism

```typescript
interface RetryConfig {
  maxAttempts: number
  initialDelay: number
  backoffMultiplier: number
  retryableErrors: ErrorType[]
}

interface RetryState {
  attempt: number
  lastError?: Error
  isRetrying: boolean
  nextRetryIn?: number
}

async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig,
  onRetry?: (state: RetryState) => void
): Promise<T>
```

## Data Models

### Error State Model

```typescript
interface ErrorState {
  id: string
  timestamp: number
  error: Error
  errorType: ErrorType
  severity: ErrorSeverity
  context: {
    component?: string
    action?: string
    userId?: string
    sessionId: string
    url: string
    userAgent: string
  }
  retryState?: RetryState
  resolved: boolean
  resolvedAt?: number
}
```

### Empty State Configuration

```typescript
interface EmptyStateConfig {
  id: string
  title: string
  description: string
  illustration: string
  actions: Array<{
    label: string
    action: string
    variant: 'primary' | 'secondary'
  }>
  conditions: {
    path?: string
    dataKey?: string
    customCheck?: () => boolean
  }
}

const emptyStateConfigs: Record<string, EmptyStateConfig> = {
  'no-groups': {
    id: 'no-groups',
    title: "You Haven't Joined Any Groups Yet",
    description: 'Ajo groups help you save with your community. Join an existing group or create your own.',
    illustration: 'groups',
    actions: [
      { label: 'Explore Groups', action: 'navigate:/explore', variant: 'primary' },
      { label: 'Create Group', action: 'navigate:/create', variant: 'secondary' },
    ],
    conditions: { dataKey: 'groups', customCheck: () => true },
  },
  // ... more configs
}
```

### Validation Error Model

```typescript
interface ValidationError {
  field: string
  message: string
  code: string
  severity: 'error' | 'warning'
}

interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Error Message Completeness

*For any* error that occurs in the system, the displayed error message should contain all contextually relevant information needed for the user to understand and resolve the issue (e.g., required vs current balance for insufficient funds, operation name for timeouts, specific rule for business rule violations).

**Validates: Requirements 1.2, 2.1, 2.2, 2.4, 3.4**

### Property 2: Network Error Recovery

*For any* transient network error, when connectivity is restored, the system should automatically retry the failed operation without user intervention.

**Validates: Requirements 1.4**

### Property 3: Error Deduplication

*For any* sequence of identical or similar errors occurring within a short time window, the system should display a single persistent error state rather than multiple toast notifications.

**Validates: Requirements 1.5**

### Property 4: Transaction Error Feedback

*For any* transaction that succeeds after one or more retries, the system should display a success notification and update all relevant UI state to reflect the successful transaction.

**Validates: Requirements 2.5**

### Property 5: Validation Error Lifecycle

*For any* form field with validation rules, when invalid data is entered, an inline error should appear below the field; when the data is corrected, the error should disappear immediately; and when submission is attempted with errors, all invalid fields should be highlighted and submission should be prevented.

**Validates: Requirements 3.1, 3.2, 3.3, 3.5**

### Property 6: Loading Indicator Timing

*For any* operation, a loading indicator should appear if the operation takes longer than 500ms, and should disappear within 200ms of the operation completing.

**Validates: Requirements 4.1, 4.5**

### Property 7: Skeleton Loader Structure

*For any* page or component that displays skeleton loaders during data loading, the skeleton structure should match the layout and structure of the actual content that will be displayed.

**Validates: Requirements 4.4**

### Property 8: Transaction Status Information

*For any* pending blockchain transaction, the displayed status should include both the current transaction state and an estimated completion time.

**Validates: Requirements 4.2**

### Property 9: Error Boundary Isolation

*For any* JavaScript error that occurs within a component tree wrapped by an ErrorBoundary, the error should be caught, logged to the monitoring service with full context, and a fallback UI with recovery actions should be displayed without crashing the entire application.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

### Property 10: Success Notification Content

*For any* successful user action (group creation, contribution, payout, joining group, completing multi-step process), the success notification should include specific details about what was accomplished (e.g., group details, transaction confirmation, payout amount, next steps).

**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

### Property 11: Warning Notification Content

*For any* warning condition (due date approaching, low balance, group closing, degraded network), the warning notification should include specific information about the condition and its implications.

**Validates: Requirements 9.1, 9.3, 9.4, 9.5**

### Property 12: Destructive Action Warnings

*For any* destructive or irreversible action, a warning alert or confirmation dialog should be displayed before the action is executed.

**Validates: Requirements 9.2**

### Property 13: Confirmation Dialog Behavior

*For any* confirmation dialog, when the user confirms, the action should proceed (with secondary confirmation for critical operations); when the user dismisses or cancels, the action should be cancelled and the previous state should be restored.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

### Property 14: Disabled Element Styling

*For any* disabled UI element (button, form field, feature), the element should have reduced opacity, appropriate cursor indication, and when hovered, should display contextual information explaining why it is disabled.

**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

### Property 15: Disabled State Transitions

*For any* UI element that transitions from disabled to enabled state, the styling should update within 200ms of the state change.

**Validates: Requirements 11.5**

### Property 16: Automatic Retry with Exponential Backoff

*For any* transient error, the system should automatically retry the operation with exponential backoff (increasing delay between attempts), and if all automatic retries are exhausted, should display a manual retry option.

**Validates: Requirements 12.1, 12.2, 12.3**

### Property 17: Retry Counter Management

*For any* operation with retry capability, when a user manually retries, the retry counter should be reset to zero, and during automatic retries, the current attempt number and progress should be displayed.

**Validates: Requirements 12.4, 12.5**

### Property 18: Environment-Specific Error Display

*For any* error, in development mode the system should display technical details including stack traces, while in production mode the system should display only user-friendly messages without technical details.

**Validates: Requirements 13.1, 13.2**

### Property 19: Error Logging Completeness

*For any* error that is logged, the log entry should include the component name, user action that triggered the error, error context (URL, user agent, session ID), and in development mode, should also log to the browser console.

**Validates: Requirements 13.3, 13.5**

### Property 20: Error Tracking ID

*For any* error that occurs, the system should generate and display a unique error ID that can be used for support tracking and correlation.

**Validates: Requirements 13.4**

### Property 21: Mobile-Responsive Error States

*For any* error state, confirmation dialog, or notification displayed on mobile devices, the layout should adapt for small screens (using full-screen or bottom-sheet patterns for dialogs), notifications should stack appropriately, interaction targets should be touch-friendly (minimum 44x44px), and text should remain readable without horizontal scrolling.

**Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5**

### Property 22: Accessible Error Announcements

*For any* error that occurs, the error should be announced to screen readers using ARIA live regions, and validation errors should be associated with their form fields using aria-describedby.

**Validates: Requirements 15.1, 15.2**

### Property 23: Keyboard Navigation for Errors

*For any* error state displayed, keyboard focus should move to the error message or recovery actions, and all recovery actions should be keyboard-navigable with clear focus indicators.

**Validates: Requirements 15.3, 15.5**

### Property 24: Color-Independent Error Indicators

*For any* error state that uses color to convey meaning (red for errors, yellow for warnings, etc.), the state should also include icons or text labels to ensure the meaning is conveyed to users who cannot perceive color differences.

**Validates: Requirements 15.4**

## Error Handling

### Error Classification

All errors will be classified into types and severity levels:

**Error Types**:
- **Network**: Connection failures, timeouts, RPC unavailability
- **Transaction**: Blockchain transaction failures, signing errors, contract rejections
- **Validation**: Form validation errors, business rule violations
- **Permission**: Access denied, wallet not connected, admin-only actions
- **Timeout**: Operations exceeding time thresholds
- **Contract**: Smart contract execution errors
- **Wallet**: Wallet connection issues, signature rejections
- **Unknown**: Unclassified errors

**Severity Levels**:
- **Low**: Non-blocking issues, informational
- **Medium**: Blocking but recoverable errors
- **High**: Critical errors affecting core functionality
- **Critical**: Application-breaking errors

### Error Recovery Strategies

1. **Automatic Retry**: For transient network errors and timeouts
   - Exponential backoff: 1s, 2s, 4s
   - Maximum 3 automatic attempts
   - Silent recovery on success

2. **Manual Retry**: For errors after automatic retries exhausted
   - User-initiated retry button
   - Reset retry counter on manual retry
   - Display retry progress

3. **Component Recovery**: For component-level errors
   - Error boundary catches error
   - Display fallback UI
   - Provide "Try Again" action
   - Reload component on recovery

4. **Navigation Recovery**: For critical errors
   - Provide navigation to functional areas
   - "Go Back" button
   - "Go to Home" button

5. **Page Reload**: For severe errors
   - "Reload Page" button
   - Clear error state on reload

### Error Logging and Monitoring

All errors will be logged with:
- Error type and severity
- Component name and stack trace
- User action and context
- Session ID and user ID
- Timestamp and URL
- User agent and device info

Errors will be sent to:
- Analytics service (existing)
- External monitoring service (Sentry/LogRocket - to be configured)
- Browser console (development mode only)

### Error Message Guidelines

**User-Friendly Messages**:
- Use plain language, avoid technical jargon
- Explain what happened and why
- Provide actionable next steps
- Be specific but not overwhelming
- Maintain consistent tone (helpful, not blaming)

**Technical Details** (development mode only):
- Full error message
- Stack trace
- Component stack
- Error code
- Request/response data

## Testing Strategy

### Unit Testing

Unit tests will verify specific error scenarios and edge cases:

1. **Error Classification Tests**
   - Test each error type is correctly classified
   - Test severity level assignment
   - Test error message transformation

2. **Component Rendering Tests**
   - Test ErrorState component renders correctly
   - Test EmptyState component renders correctly
   - Test LoadingState component renders correctly
   - Test ConfirmationDialog component renders correctly

3. **Error Boundary Tests**
   - Test error catching and fallback UI
   - Test error logging
   - Test recovery actions
   - Test retry mechanism

4. **Notification Tests**
   - Test toast notifications display correctly
   - Test notification positioning
   - Test notification dismissal
   - Test notification actions

5. **Validation Tests**
   - Test inline validation errors
   - Test form submission prevention
   - Test error removal on correction
   - Test multiple error display

6. **Accessibility Tests**
   - Test ARIA live regions
   - Test aria-describedby associations
   - Test keyboard navigation
   - Test focus management
   - Test color-independent indicators

### Property-Based Testing

Property tests will verify universal behaviors across all inputs:

1. **Error Message Completeness Property**
   - Generate random errors of each type
   - Verify all required information is present in messages
   - Test with various error contexts

2. **Validation Lifecycle Property**
   - Generate random form data (valid and invalid)
   - Verify validation errors appear, disappear, and prevent submission correctly
   - Test with multiple fields and error types

3. **Loading Indicator Timing Property**
   - Generate operations with random durations
   - Verify loading indicators appear after 500ms and disappear within 200ms
   - Test with various operation types

4. **Retry Behavior Property**
   - Generate random transient errors
   - Verify exponential backoff timing
   - Verify retry counter management
   - Test manual retry resets counter

5. **Error Boundary Isolation Property**
   - Generate random component errors
   - Verify errors are caught and logged
   - Verify fallback UI is displayed
   - Verify recovery actions work

6. **Mobile Responsiveness Property**
   - Generate random viewport sizes
   - Verify layouts adapt correctly
   - Verify touch targets meet size requirements
   - Verify text wrapping prevents horizontal scroll

7. **Accessibility Property**
   - Generate random error scenarios
   - Verify ARIA announcements
   - Verify keyboard navigation
   - Verify focus management

### Integration Testing

Integration tests will verify error handling across component boundaries:

1. **End-to-End Error Flows**
   - Test network error → retry → success flow
   - Test transaction error → user correction → success flow
   - Test validation error → correction → submission flow

2. **Error Boundary Integration**
   - Test error propagation through component tree
   - Test error boundary at different levels (global, page, feature)
   - Test error recovery and state restoration

3. **Notification Integration**
   - Test notification queue management
   - Test notification with error deduplication
   - Test notification actions trigger correct behaviors

### Testing Configuration

- **Property tests**: Minimum 100 iterations per test
- **Test tagging**: Each property test tagged with feature name and property number
- **Tag format**: `Feature: ui-error-and-empty-states, Property {number}: {property_text}`
- **Coverage target**: 90% code coverage for error handling components
- **Accessibility testing**: Automated tests with jest-axe, manual testing with screen readers

### Manual Testing Checklist

1. Test all error scenarios in different browsers
2. Test error states on various screen sizes
3. Test with screen readers (NVDA, JAWS, VoiceOver)
4. Test keyboard navigation through all error states
5. Test with different network conditions (slow 3G, offline)
6. Test with different wallet providers
7. Test error recovery flows
8. Test error logging in monitoring dashboard

## Implementation Notes

### Technology Stack

- **React 18**: Component framework
- **TypeScript**: Type safety
- **TailwindCSS**: Styling with design tokens
- **react-hot-toast**: Toast notifications
- **React Query**: Data fetching and error states
- **Zustand**: Global state management
- **Vitest**: Unit and property testing
- **Testing Library**: Component testing
- **jest-axe**: Accessibility testing

### Design Tokens

Use existing TailwindCSS color tokens:
- `error`: #EF4444 (red-500)
- `warning`: #F59E0B (amber-500)
- `success`: #10B981 (emerald-500)
- `info`: #06B6D4 (cyan-500)
- `primary`: #3B82F6 (blue-500)
- `secondary`: #8B5CF6 (violet-500)

### Component Library

Build reusable components in `src/components/`:
- `ErrorState.tsx`
- `EmptyState.tsx`
- `LoadingState.tsx`
- `ConfirmationDialog.tsx`
- `Toast.tsx` (wrapper for react-hot-toast)

### Storybook Integration

Create stories for all error and empty state components:
- `ErrorState.stories.tsx`
- `EmptyState.stories.tsx`
- `LoadingState.stories.tsx`
- `ConfirmationDialog.stories.tsx`

### Accessibility Requirements

- All interactive elements must have minimum 44x44px touch targets
- All error states must be announced to screen readers
- All form errors must be associated with fields via aria-describedby
- All error states must be keyboard navigable
- All color-coded states must have text/icon alternatives
- Focus must be managed appropriately on error display

### Performance Considerations

- Debounce validation errors (300ms)
- Throttle retry attempts (exponential backoff)
- Lazy load error illustrations
- Memoize error classification logic
- Use React.memo for error state components
- Optimize skeleton loaders with CSS animations

### Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Latest version

### Future Enhancements

1. **Error Analytics Dashboard**: Visualize error patterns and trends
2. **Smart Error Recovery**: ML-based error prediction and prevention
3. **Contextual Help**: In-app help based on error context
4. **Error Replay**: Record and replay error scenarios for debugging
5. **Internationalization**: Translate error messages to multiple languages
6. **Custom Error Illustrations**: Branded illustrations for each error type
7. **Error Feedback**: Allow users to provide feedback on error messages
8. **Progressive Error Disclosure**: Show simple message first, expand for details

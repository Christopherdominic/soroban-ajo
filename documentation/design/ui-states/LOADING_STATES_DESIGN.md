# Loading & Timeout States Design System

## Overview
Loading states, skeleton screens, progress indicators, and timeout handling for optimal user experience during data fetching and processing.

---

## Design Principles

### Loading State Goals
- **Immediate Feedback**: Show loading instantly
- **Progress Indication**: Show progress when possible
- **Time Expectations**: Set realistic expectations
- **Graceful Degradation**: Handle timeouts elegantly

---

## 1. Loading States

### 1.1 Page Loading (Initial Load)

**When**: First page load or navigation

**Visual Design**:
- Full-page spinner with logo
- Background: white
- Spinner: Blue-600, 48px
- Logo: Above spinner, 64px
- Animation: Smooth fade-in

**Content**:
```
Logo: Ajo Finance logo
Spinner: Rotating circle
Text: "Loading your dashboard..."
```

**Component**:
```tsx
<PageLoader message="Loading your dashboard..." />
```

**Timeout**: 10 seconds → Show error state

---

### 1.2 Skeleton Screens

**When**: Loading list items, cards, or content blocks

**Visual Design**:
- Background: gray-200
- Shimmer: gray-300 to gray-100
- Animation: Left-to-right shimmer (1.5s loop)
- Border radius: Match actual component

**Patterns**:

**Group Card Skeleton**:
```tsx
<div className="space-y-4">
  <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
</div>
```

**Dashboard Skeleton**:
```tsx
<div className="grid grid-cols-3 gap-4">
  {[1, 2, 3].map(i => (
    <div key={i} className="space-y-3">
      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
    </div>
  ))}
</div>
```

---

### 1.3 Button Loading

**When**: Button action in progress

**Visual Design**:
- Spinner: 16px, white
- Button disabled
- Text: "Processing..." or keep original text
- Width: Fixed (prevent layout shift)

**Component**:
```tsx
<Button loading={isLoading}>
  {isLoading ? "Creating..." : "Create Group"}
</Button>
```

---

### 1.4 Inline Loading

**When**: Small section loading

**Visual Design**:
- Spinner: 20px, blue-600
- Text: Optional message
- Inline with content

**Example**:
```tsx
<div className="flex items-center gap-2">
  <Spinner size={20} />
  <span className="text-sm text-gray-600">Loading members...</span>
</div>
```

---

### 1.5 Progress Bar

**When**: Long operation with known progress

**Visual Design**:
- Height: 8px
- Background: gray-200
- Fill: blue-600
- Border radius: 4px
- Animated transition

**Component**:
```tsx
<ProgressBar
  value={progress}
  max={100}
  label={`${progress}% complete`}
/>
```

**Use Cases**:
- File upload
- Multi-step form
- Blockchain confirmation
- Data sync

---

## 2. Timeout Handling

### 2.1 Request Timeout (30s)

**Visual Design**:
- Show timeout warning at 20s
- Show timeout error at 30s
- Provide retry option

**Timeline**:
```
0s: Start loading
20s: Show "This is taking longer than expected..."
30s: Show timeout error with retry
```

**Component**:
```tsx
<ErrorState
  variant="warning"
  icon="status-warning"
  heading="Request Timed Out"
  message="This is taking longer than expected."
  primaryAction={{ label: "Try Again", onClick: retry }}
  secondaryAction={{ label: "Cancel", onClick: cancel }}
/>
```

---

### 2.2 Long-Running Operations

**When**: Operation takes >10 seconds

**Visual Design**:
- Progress indicator
- Time estimate
- Status updates
- Cancel option

**Example**:
```tsx
<LoadingState
  variant="progress"
  message="Processing transaction..."
  progress={60}
  estimate="About 30 seconds remaining"
  onCancel={handleCancel}
/>
```

---

## 3. Loading Messages

### Message Guidelines

**Short operations (<5s)**:
- "Loading..."
- "Please wait..."

**Medium operations (5-15s)**:
- "Loading your groups..."
- "Fetching transaction history..."
- "Connecting to blockchain..."

**Long operations (>15s)**:
- "Processing your transaction..."
- "This may take up to 30 seconds"
- "Confirming on blockchain..."

### Reassuring Messages

```
"Almost there..."
"Just a moment..."
"Hang tight..."
"Processing..."
"Working on it..."
```

---

## 4. Optimistic Updates

### Pattern

**Show success immediately, revert on error**:

```tsx
// Optimistic update
setGroups([...groups, newGroup])
toast.success("Group created!")

try {
  await createGroup(newGroup)
} catch (error) {
  // Revert on error
  setGroups(groups)
  toast.error("Failed to create group")
}
```

### Use Cases

- Like/favorite actions
- Simple updates
- Non-critical operations
- Instant feedback needed

---

## 5. Skeleton Screen Patterns

### Card Skeleton

```tsx
<div className="border rounded-lg p-4 space-y-3">
  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
  <div className="h-4 bg-gray-200 rounded animate-pulse" />
  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
  <div className="flex gap-2 mt-4">
    <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
    <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
  </div>
</div>
```

### List Skeleton

```tsx
<div className="space-y-4">
  {[1, 2, 3, 4, 5].map(i => (
    <div key={i} className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
      </div>
    </div>
  ))}
</div>
```

### Table Skeleton

```tsx
<table className="w-full">
  <thead>
    <tr>
      {[1, 2, 3, 4].map(i => (
        <th key={i}>
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {[1, 2, 3, 4, 5].map(row => (
      <tr key={row}>
        {[1, 2, 3, 4].map(col => (
          <td key={col}>
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

---

## 6. Accessibility

### Screen Reader Announcements

```tsx
<div
  role="status"
  aria-live="polite"
  aria-busy="true"
>
  <span className="sr-only">Loading groups, please wait</span>
  <Spinner />
</div>
```

### Loading State ARIA

```tsx
<button
  disabled
  aria-busy="true"
  aria-label="Creating group, please wait"
>
  <Spinner size={16} />
  Creating...
</button>
```

---

## 7. Best Practices

### Do's
✓ Show loading immediately (<100ms)
✓ Use skeleton screens for content
✓ Provide time estimates for long operations
✓ Allow cancellation when possible
✓ Show progress when available
✓ Use optimistic updates for instant feedback

### Don'ts
✗ Show loading for <200ms operations
✗ Block entire UI unnecessarily
✗ Use vague messages ("Loading...")
✗ Forget timeout handling
✗ Ignore accessibility
✗ Make users wait without feedback

---

**Version**: 1.0  
**Last Updated**: February 20, 2026

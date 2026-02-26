# Error & Empty States - Quick Reference Guide

## 🚀 Quick Start

Need to show an error, empty state, or loading indicator? This guide has you covered.

---

## Common Scenarios

### 1. Show an Error

```tsx
import { ErrorState } from '@/components/states/ErrorState'

<ErrorState
  variant="error"
  icon="status-error"
  heading="Connection Lost"
  message="Check your internet connection and try again."
  primaryAction={{
    label: "Retry",
    onClick: handleRetry,
  }}
/>
```

**When to use**: Network errors, server errors, failed operations

---

### 2. Show Empty State

```tsx
import { EmptyState } from '@/components/states/EmptyState'

<EmptyState
  icon="social-users"
  heading="No Groups Yet"
  message="Create your first savings group to get started."
  primaryAction={{
    label: "Create Group",
    onClick: () => navigate('/create'),
  }}
/>
```

**When to use**: No data, no search results, empty lists

---

### 3. Show Loading

```tsx
import { LoadingState } from '@/components/states/LoadingState'

<LoadingState message="Loading groups..." />
```

**When to use**: Data fetching, page loading, processing

---

### 4. Show Success Toast

```tsx
import { useToast } from '@/hooks/useToast'

const { success } = useToast()

success("Group created successfully!")
```

**When to use**: Action completed, confirmation needed

---

### 5. Show Confirmation Dialog

```tsx
import { ConfirmDialog } from '@/components/ConfirmDialog'

<ConfirmDialog
  isOpen={isOpen}
  variant="destructive"
  icon="action-delete"
  title="Delete Group?"
  message="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
  onCancel={() => setIsOpen(false)}
/>
```

**When to use**: Destructive actions, important decisions

---

## Component Cheat Sheet

### ErrorState Props

| Prop | Type | Required | Example |
|------|------|----------|---------|
| variant | 'error' \| 'warning' \| 'info' | Yes | 'error' |
| heading | string | Yes | "Connection Lost" |
| message | string | Yes | "Check your internet..." |
| icon | IconName | No | "status-error" |
| primaryAction | Action | No | { label, onClick } |

### EmptyState Props

| Prop | Type | Required | Example |
|------|------|----------|---------|
| heading | string | Yes | "No Groups Yet" |
| message | string | Yes | "Create your first..." |
| icon | IconName | No | "social-users" |
| illustration | ReactNode | No | <CustomSVG /> |
| primaryAction | Action | No | { label, onClick } |

### LoadingState Props

| Prop | Type | Required | Example |
|------|------|----------|---------|
| variant | 'spinner' \| 'skeleton' \| 'progress' | No | 'spinner' |
| message | string | No | "Loading..." |
| progress | number | No | 60 |
| fullPage | boolean | No | false |

### Toast Props

| Prop | Type | Required | Example |
|------|------|----------|---------|
| variant | 'success' \| 'error' \| 'warning' \| 'info' | Yes | 'success' |
| message | string | Yes | "Group created!" |
| duration | number | No | 4000 |

### ConfirmDialog Props

| Prop | Type | Required | Example |
|------|------|----------|---------|
| isOpen | boolean | Yes | true |
| variant | 'destructive' \| 'warning' \| 'info' | Yes | 'destructive' |
| title | string | Yes | "Delete Group?" |
| message | string | Yes | "Cannot be undone" |
| confirmLabel | string | Yes | "Delete" |
| cancelLabel | string | Yes | "Cancel" |
| onConfirm | () => void | Yes | handleDelete |

---

## Color Reference

| State | Background | Border | Icon | Text |
|-------|------------|--------|------|------|
| Error | red-50 | red-200 | red-600 | gray-900 |
| Warning | amber-50 | amber-200 | amber-600 | gray-900 |
| Success | green-50 | green-200 | green-600 | gray-900 |
| Info | blue-50 | blue-200 | blue-600 | gray-900 |
| Disabled | gray-100 | gray-300 | gray-400 | gray-500 |

---

## Icon Reference

| State | Icon Name | Size |
|-------|-----------|------|
| Error | status-error | 64px |
| Warning | status-warning | 64px |
| Success | validation-check | 64px |
| Info | status-active | 64px |
| Loading | action-refresh | 48px |
| Empty | (custom) | 120px |

---

## Common Patterns

### Loading → Success → Redirect

```tsx
const [isLoading, setIsLoading] = useState(false)
const { success, error } = useToast()

const handleSubmit = async () => {
  setIsLoading(true)
  
  try {
    await createGroup(data)
    success("Group created!")
    setTimeout(() => navigate('/dashboard'), 2000)
  } catch (err) {
    error("Failed to create group", err.message)
  } finally {
    setIsLoading(false)
  }
}
```

### Empty → Loading → Data/Error

```tsx
const { data, isLoading, error } = useQuery('groups', fetchGroups)

if (isLoading) return <LoadingState />
if (error) return <ErrorState variant="error" heading="Failed to load" />
if (!data?.length) return <EmptyState heading="No groups yet" />

return <GroupsList groups={data} />
```

### Confirmation → Loading → Success/Error

```tsx
const [showConfirm, setShowConfirm] = useState(false)
const [isDeleting, setIsDeleting] = useState(false)

const handleDelete = async () => {
  setIsDeleting(true)
  
  try {
    await deleteGroup(id)
    success("Group deleted")
    setShowConfirm(false)
  } catch (err) {
    error("Failed to delete group")
  } finally {
    setIsDeleting(false)
  }
}

return (
  <ConfirmDialog
    isOpen={showConfirm}
    variant="destructive"
    title="Delete Group?"
    onConfirm={handleDelete}
    isLoading={isDeleting}
  />
)
```

---

## Accessibility Quick Tips

### Always Include

```tsx
// Error states
<ErrorState
  heading="Error Title"
  ariaLabel="Error: Connection lost"
  role="alert"
/>

// Loading states
<LoadingState
  message="Loading..."
  aria-live="polite"
  aria-busy="true"
/>

// Dialogs
<ConfirmDialog
  title="Delete?"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
/>
```

### Screen Reader Text

```tsx
<span className="sr-only">Loading groups, please wait</span>
```

---

## Testing Quick Checks

### Visual
- [ ] Colors match design system
- [ ] Icons display correctly
- [ ] Text is readable
- [ ] Spacing looks good
- [ ] Mobile responsive

### Functional
- [ ] Buttons work
- [ ] Toasts auto-dismiss
- [ ] Dialogs close
- [ ] Loading shows/hides
- [ ] Errors display

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader announces
- [ ] Focus visible
- [ ] ARIA labels present
- [ ] Color contrast passes

---

## Need More Details?

See full documentation:
- `ERROR_STATES_DESIGN.md` - Error patterns
- `EMPTY_STATES_DESIGN.md` - Empty state patterns
- `LOADING_STATES_DESIGN.md` - Loading patterns
- `ERROR_EMPTY_STATE_COMPONENTS.md` - Component specs
- `ERROR_EMPTY_STATES_INDEX.md` - Complete index

---

**Version**: 1.0  
**Last Updated**: February 20, 2026

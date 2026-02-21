# Empty State Components - Quick Reference

## Component Hierarchy

```
EmptyState (Base Component)
├── EmptyGroupState (No groups)
└── EmptyMemberState (No members)
```

## EmptyState Props

```typescript
interface EmptyStateProps {
  icon: string                    // Icon name from icon system
  heading: string                 // Main heading text
  message: string                 // Descriptive message
  primaryAction?: {               // Optional primary CTA
    label: string
    onClick: () => void
    icon?: string
  }
  secondaryAction?: {             // Optional secondary action
    label: string
    onClick: () => void
  }
  illustrationSize?: 'sm' | 'md' | 'lg'  // Default: 'md'
}
```

## Size Reference

- `sm`: 100px × 100px
- `md`: 120px × 120px (default)
- `lg`: 160px × 160px

## Visual Layout

```
┌─────────────────────────────────┐
│                                 │
│         [Icon/Illustration]     │
│            (centered)           │
│                                 │
│      Main Heading (2xl bold)    │
│                                 │
│   Descriptive message text      │
│   (gray-600, max-w-md)          │
│                                 │
│  [Primary Button] [Secondary]   │
│                                 │
└─────────────────────────────────┘
```

## Usage Patterns

### Pattern 1: Groups List (No Groups)
```tsx
<EmptyGroupState
  onCreateGroup={() => navigate('/create')}
  onLearnMore={() => setShowTutorial(true)}
/>
```

**Renders:**
- Icon: social-users (160px)
- Heading: "Start Your First Savings Group"
- Message: Educational description
- Primary: "Create Your First Group" (with add icon)
- Secondary: "Learn How Ajo Works →"

### Pattern 2: Group Detail (No Members)
```tsx
<EmptyMemberState
  onShareLink={() => shareGroupLink()}
  onCopyLink={() => copyToClipboard()}
/>
```

**Renders:**
- Icon: action-add (120px)
- Heading: "Invite Members to Join"
- Message: Instructions about sharing
- Primary: "Share Group Link"
- Secondary: "Copy Invite Link →"

## Styling Classes

### Container
- `flex flex-col items-center justify-center`
- `py-12 px-4 text-center`

### Icon Container
- `mb-6 text-gray-300`
- Dynamic width/height based on size

### Heading
- `text-2xl font-bold text-gray-900 mb-2`

### Message
- `text-base text-gray-600 max-w-md mb-6`

### Primary Button
- `inline-flex items-center gap-2`
- `px-6 py-3`
- `bg-blue-600 hover:bg-blue-700`
- `text-white font-semibold rounded-lg`

### Secondary Button
- `inline-flex items-center gap-1`
- `px-6 py-3`
- `text-blue-600 hover:text-blue-700 font-semibold`

## Accessibility Features

- Icon has `aria-hidden="true"` (decorative)
- Semantic HTML structure
- Keyboard accessible buttons
- Clear focus states
- Responsive layout (stacks on mobile)

## Responsive Behavior

**Desktop:**
```
[Primary Button] [Secondary Link]
```

**Mobile:**
```
[Primary Button]
[Secondary Link]
```

Breakpoint: `sm` (640px)

## Integration Points

### GroupsList.tsx
```typescript
if (groups.length === 0 && onCreateGroup) {
  return <EmptyGroupState onCreateGroup={onCreateGroup} onLearnMore={onLearnMore} />
}
```

### GroupDetailPage.tsx
```typescript
{activeTab === 'members' && (
  <>
    {members.length === 0 ? (
      <EmptyMemberState onShareLink={handleShareLink} onCopyLink={handleCopyLink} />
    ) : (
      <MemberList groupId={groupId} members={members} />
    )}
  </>
)}
```

## Future Extensions

To add more empty states, create new specialized components:

```tsx
// Example: EmptyTransactionState.tsx
export const EmptyTransactionState: React.FC<Props> = ({ onMakeContribution }) => {
  return (
    <EmptyState
      icon="finance-transaction"
      illustrationSize="md"
      heading="No Transactions Yet"
      message="Your contribution and payout history will appear here."
      primaryAction={{
        label: 'Make Your First Contribution',
        onClick: onMakeContribution,
      }}
    />
  )
}
```

Then use it in the appropriate component:
```tsx
{transactions.length === 0 ? (
  <EmptyTransactionState onMakeContribution={handleContribute} />
) : (
  <TransactionHistory transactions={transactions} />
)}
```

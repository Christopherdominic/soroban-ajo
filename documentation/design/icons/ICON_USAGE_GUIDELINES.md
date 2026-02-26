# Icon Usage Guidelines

## Quick Start

### 1. Setup (One-time)

Add `IconSprite` to your app root:

```tsx
// App.tsx
import { IconSprite } from '@/components/IconSprite'

export function App() {
  return (
    <>
      <IconSprite />
      {/* Rest of your app */}
    </>
  )
}
```

### 2. Import Icon Component

```tsx
import { Icon } from '@/components/Icon'
```

### 3. Use Icons

```tsx
<Icon name="action-add" size={24} variant="default" />
```

---

## Basic Usage

### Default Icon

```tsx
<Icon name="action-add" />
```

Renders a 24px icon in default gray color.

### With Size

```tsx
<Icon name="action-add" size={16} />
<Icon name="action-add" size={20} />
<Icon name="action-add" size={24} />
<Icon name="action-add" size={32} />
<Icon name="action-add" size={48} />
```

### With Variant

```tsx
<Icon name="action-add" variant="default" />
<Icon name="action-add" variant="active" />
<Icon name="action-add" variant="disabled" />
<Icon name="action-add" variant="error" />
<Icon name="action-add" variant="success" />
<Icon name="action-add" variant="warning" />
<Icon name="action-add" variant="info" />
```

### With Custom Class

```tsx
<Icon name="action-add" className="hover:text-blue-700" />
<Icon name="action-add" className="transition-colors duration-200" />
```

---

## Common Patterns

### Icon in Button

```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  <Icon name="action-add" size={20} ariaHidden={true} />
  Create Group
</button>
```

### Icon with Text Label

```tsx
<div className="flex items-center gap-2">
  <Icon name="status-active" variant="success" size={16} ariaHidden={true} />
  <span className="text-sm font-medium">Active</span>
</div>
```

### Icon Only Button

```tsx
<button 
  className="p-2 hover:bg-gray-100 rounded-lg"
  aria-label="Close dialog"
>
  <Icon name="ui-close" size={24} ariaHidden={true} />
</button>
```

### Icon in Navigation

```tsx
<nav className="flex gap-4">
  <a href="/" className="flex items-center gap-2 hover:text-blue-600">
    <Icon name="nav-home" size={24} ariaHidden={true} />
    <span>Home</span>
  </a>
  <a href="/groups" className="flex items-center gap-2 hover:text-blue-600">
    <Icon name="social-users" size={24} ariaHidden={true} />
    <span>Groups</span>
  </a>
</nav>
```

### Status Indicator

```tsx
<div className="flex items-center gap-2">
  {isActive ? (
    <>
      <Icon name="status-active" variant="success" size={16} ariaHidden={true} />
      <span>Active</span>
    </>
  ) : (
    <>
      <Icon name="status-inactive" variant="disabled" size={16} ariaHidden={true} />
      <span>Inactive</span>
    </>
  )}
</div>
```

### Payment Display

```tsx
<div className="flex items-center gap-2 text-lg font-semibold">
  <Icon name="payment-coin" variant="info" size={24} ariaHidden={true} />
  <span>1,250 USDC</span>
</div>
```

### Form Validation

```tsx
<div className="flex items-center gap-2">
  <input type="email" className="flex-1 px-3 py-2 border rounded-lg" />
  {isValid ? (
    <Icon name="validation-check" variant="success" size={20} ariaHidden={true} />
  ) : (
    <Icon name="validation-cross" variant="error" size={20} ariaHidden={true} />
  )}
</div>
```

### Loading State

```tsx
<div className="flex items-center gap-2">
  <Icon name="action-refresh" className="animate-spin" size={20} ariaHidden={true} />
  <span>Loading...</span>
</div>
```

### Card Header

```tsx
<div className="flex items-center gap-3 mb-4 pb-4 border-b">
  <Icon name="payment-wallet" size={32} variant="info" ariaHidden={true} />
  <div>
    <h3 className="font-semibold">Wallet Balance</h3>
    <p className="text-sm text-gray-600">Connected</p>
  </div>
</div>
```

### Alert/Notification

```tsx
<div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
  <Icon name="status-error" variant="error" size={24} ariaHidden={true} />
  <div>
    <h4 className="font-semibold text-red-900">Error</h4>
    <p className="text-sm text-red-800">Transaction failed. Please try again.</p>
  </div>
</div>
```

### Empty State

```tsx
<div className="text-center py-12">
  <Icon name="social-users" size={48} variant="disabled" className="mx-auto mb-4" ariaHidden={true} />
  <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
  <p className="text-gray-600 mb-4">Create your first group to get started</p>
  <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg">
    <Icon name="action-add" size={20} ariaHidden={true} />
    Create Group
  </button>
</div>
```

---

## Accessibility

### Decorative Icons

Use `ariaHidden={true}` for icons that are purely decorative:

```tsx
<button className="flex items-center gap-2">
  <Icon name="action-add" ariaHidden={true} />
  Add Item
</button>
```

### Meaningful Icons

Use `ariaLabel` for icons that convey meaning:

```tsx
<button aria-label="Close dialog">
  <Icon name="ui-close" ariaHidden={false} ariaLabel="Close" />
</button>
```

### Icon with Title

Use `title` for tooltip text:

```tsx
<Icon 
  name="payment-wallet" 
  title="Connect your wallet to continue"
/>
```

### Best Practices

1. **Always pair with text** when possible
2. **Use `ariaHidden={true}`** for decorative icons
3. **Provide `ariaLabel`** for standalone icons
4. **Test with screen readers** (NVDA, JAWS, VoiceOver)
5. **Ensure color contrast** (WCAG AA minimum)

---

## Sizing Guidelines

### When to Use Each Size

| Size | Use Case | Example |
|------|----------|---------|
| **16px** | Inline text, badges, compact UI | Status badge, inline indicator |
| **20px** | Form labels, small buttons | Form icon, small action button |
| **24px** | Default, standard buttons, navigation | Navigation icon, standard button |
| **32px** | Large buttons, card headers | Card header icon, large button |
| **48px** | Hero sections, featured content | Empty state, featured action |

### Responsive Sizing

```tsx
// Mobile: 20px, Desktop: 24px
<Icon 
  name="action-add" 
  size={20}
  className="md:w-6 md:h-6"
/>
```

### Size in Context

```tsx
// Inline with text
<Icon name="status-active" size={16} />

// Button
<button>
  <Icon name="action-add" size={20} />
  Add
</button>

// Card header
<div className="flex items-center gap-3">
  <Icon name="payment-wallet" size={32} />
  <h3>Wallet</h3>
</div>

// Hero section
<div className="text-center">
  <Icon name="social-users" size={48} />
  <h1>Join a Group</h1>
</div>
```

---

## Variant Usage

### Default Variant

Use for normal, inactive, or neutral states:

```tsx
<Icon name="action-edit" variant="default" />
```

### Active Variant

Use for selected, focused, or highlighted states:

```tsx
<Icon name="nav-home" variant="active" />
```

### Disabled Variant

Use for unavailable, locked, or inactive features:

```tsx
<Icon name="action-delete" variant="disabled" />
```

### Error Variant

Use for errors, failures, or invalid states:

```tsx
<Icon name="status-error" variant="error" />
```

### Success Variant

Use for successful completion, valid states, or confirmations:

```tsx
<Icon name="validation-check" variant="success" />
```

### Warning Variant

Use for warnings, cautions, or attention-needed states:

```tsx
<Icon name="status-warning" variant="warning" />
```

### Info Variant

Use for informational content, tips, or help:

```tsx
<Icon name="ui-help" variant="info" />
```

---

## Icon Selection Guide

### By Category

#### Action Icons
Use for user interactions and operations:

```tsx
// Create
<Icon name="action-add" />

// Modify
<Icon name="action-edit" />

// Remove
<Icon name="action-delete" />

// Save
<Icon name="action-save" />

// Export
<Icon name="action-download" />

// Import
<Icon name="action-upload" />

// Share
<Icon name="action-share" />

// Refresh
<Icon name="action-refresh" />
```

#### Status Icons
Use for state indicators:

```tsx
// Active/Online
<Icon name="status-active" variant="success" />

// Inactive/Offline
<Icon name="status-inactive" variant="disabled" />

// Pending/Loading
<Icon name="status-pending" />

// Completed/Done
<Icon name="status-completed" variant="success" />

// Warning/Alert
<Icon name="status-warning" variant="warning" />

// Error/Failed
<Icon name="status-error" variant="error" />

// Locked/Restricted
<Icon name="status-locked" variant="disabled" />

// Verified/Confirmed
<Icon name="status-verified" variant="success" />
```

#### Payment Icons
Use for financial operations:

```tsx
// Wallet/Account
<Icon name="payment-wallet" />

// Send/Transfer
<Icon name="payment-send" />

// Receive/Incoming
<Icon name="payment-receive" />

// Currency/Amount
<Icon name="payment-coin" />

// Payment Method
<Icon name="payment-card" />

// Invoice/Receipt
<Icon name="payment-invoice" />

// History/Timeline
<Icon name="payment-history" />

// Calculate
<Icon name="payment-calculator" />
```

#### Navigation Icons
Use for navigation and menu:

```tsx
// Home/Dashboard
<Icon name="nav-home" />

// Back/Previous
<Icon name="nav-back" />

// Forward/Next
<Icon name="nav-forward" />

// Menu/Options
<Icon name="nav-menu" />
```

#### UI Icons
Use for interface elements:

```tsx
// Search/Find
<Icon name="ui-search" />

// Settings/Config
<Icon name="ui-settings" />

// Help/Support
<Icon name="ui-help" />

// Close/Dismiss
<Icon name="ui-close" />
```

#### Social Icons
Use for user/group related content:

```tsx
// User/Profile
<Icon name="social-user" />

// Users/Group
<Icon name="social-users" />
```

#### Chart Icons
Use for data visualization:

```tsx
// Bar Chart
<Icon name="chart-bar" />

// Line Chart
<Icon name="chart-line" />
```

#### Validation Icons
Use for form validation:

```tsx
// Valid/Confirmed
<Icon name="validation-check" variant="success" />

// Invalid/Failed
<Icon name="validation-cross" variant="error" />
```

---

## Component Integration

### With Buttons

```tsx
// Primary Button
<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  <Icon name="action-add" size={20} ariaHidden={true} />
  Create
</button>

// Secondary Button
<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
  <Icon name="action-edit" size={20} ariaHidden={true} />
  Edit
</button>

// Icon Button
<button className="p-2 hover:bg-gray-100 rounded-lg">
  <Icon name="ui-close" size={24} ariaHidden={true} />
</button>
```

### With Forms

```tsx
<div className="space-y-4">
  <div className="flex items-center gap-2">
    <Icon name="payment-wallet" size={20} ariaHidden={true} />
    <label className="font-medium">Wallet Address</label>
  </div>
  <input type="text" className="w-full px-3 py-2 border rounded-lg" />
</div>
```

### With Cards

```tsx
<div className="p-6 bg-white rounded-lg shadow-md">
  <div className="flex items-center gap-3 mb-4">
    <Icon name="payment-coin" size={32} variant="info" ariaHidden={true} />
    <h3 className="text-lg font-semibold">Balance</h3>
  </div>
  <p className="text-2xl font-bold">1,250 USDC</p>
</div>
```

### With Lists

```tsx
<ul className="space-y-2">
  <li className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
    <Icon name="status-active" variant="success" size={16} ariaHidden={true} />
    <span>Active Group</span>
  </li>
  <li className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
    <Icon name="status-completed" variant="success" size={16} ariaHidden={true} />
    <span>Completed Group</span>
  </li>
</ul>
```

### With Badges

```tsx
<span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
  <Icon name="validation-check" size={16} ariaHidden={true} />
  Verified
</span>
```

---

## Performance Tips

### 1. Use Appropriate Sizes

```tsx
// Good: Use appropriate size
<Icon name="action-add" size={20} />

// Avoid: Scaling large icon down
<Icon name="action-add" size={48} className="w-4 h-4" />
```

### 2. Memoize in Lists

```tsx
const MemoizedIcon = React.memo(Icon)

function IconList() {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <MemoizedIcon name={item.icon} />
        </li>
      ))}
    </ul>
  )
}
```

### 3. Lazy Load if Needed

```tsx
const IconSprite = React.lazy(() => import('@/components/IconSprite'))

export function App() {
  return (
    <>
      <React.Suspense fallback={null}>
        <IconSprite />
      </React.Suspense>
      {/* App content */}
    </>
  )
}
```

### 4. Use CSS Classes for Styling

```tsx
// Good: Use Tailwind classes
<Icon name="action-add" className="hover:text-blue-700" />

// Avoid: Inline styles
<Icon name="action-add" style={{ color: 'blue' }} />
```

---

## Troubleshooting

### Icon Not Displaying

**Problem**: Icon doesn't appear
**Solution**:
1. Ensure `IconSprite` is rendered in app root
2. Check icon name spelling
3. Verify icon exists in `iconDefinitions.ts`
4. Check browser console for errors

```tsx
// Verify icon name
import { isValidIconName } from '@/icons/iconDefinitions'

console.log(isValidIconName('action-add')) // true
console.log(isValidIconName('invalid-icon')) // false
```

### Color Not Applying

**Problem**: Icon color doesn't change
**Solution**:
1. Verify variant name is correct
2. Check Tailwind CSS is configured
3. Ensure `currentColor` is used in SVG
4. Check for CSS specificity conflicts

```tsx
// Verify variant
<Icon name="action-add" variant="success" />
```

### Icon Misaligned

**Problem**: Icon doesn't align with text
**Solution**:
1. Use `items-center` for flex containers
2. Ensure consistent line-height
3. Check icon size matches text size

```tsx
// Good alignment
<div className="flex items-center gap-2">
  <Icon name="action-add" size={20} />
  <span>Add Item</span>
</div>
```

### Accessibility Issues

**Problem**: Screen reader doesn't announce icon
**Solution**:
1. Add `ariaLabel` for meaningful icons
2. Use `ariaHidden={true}` for decorative icons
3. Test with screen readers

```tsx
// Good: Meaningful icon with label
<Icon 
  name="status-error" 
  ariaLabel="Error: Transaction failed"
/>

// Good: Decorative icon
<Icon name="action-add" ariaHidden={true} />
```

---

## Examples by Use Case

### Dashboard

```tsx
export function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="payment-wallet" size={32} variant="info" ariaHidden={true} />
          <h3 className="text-lg font-semibold">Balance</h3>
        </div>
        <p className="text-3xl font-bold">1,250 USDC</p>
      </div>
      
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="social-users" size={32} variant="active" ariaHidden={true} />
          <h3 className="text-lg font-semibold">Groups</h3>
        </div>
        <p className="text-3xl font-bold">5</p>
      </div>
      
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="payment-history" size={32} variant="default" ariaHidden={true} />
          <h3 className="text-lg font-semibold">Transactions</h3>
        </div>
        <p className="text-3xl font-bold">24</p>
      </div>
    </div>
  )
}
```

### Group List

```tsx
export function GroupList({ groups }) {
  return (
    <ul className="space-y-2">
      {groups.map(group => (
        <li key={group.id} className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md cursor-pointer">
          <Icon 
            name={group.status === 'active' ? 'status-active' : 'status-completed'} 
            variant={group.status === 'active' ? 'success' : 'default'}
            size={16}
            ariaHidden={true}
          />
          <div className="flex-1">
            <h4 className="font-semibold">{group.name}</h4>
            <p className="text-sm text-gray-600">{group.members} members</p>
          </div>
          <Icon name="nav-forward" size={20} className="text-gray-400" ariaHidden={true} />
        </li>
      ))}
    </ul>
  )
}
```

### Transaction History

```tsx
export function TransactionHistory({ transactions }) {
  return (
    <div className="space-y-2">
      {transactions.map(tx => (
        <div key={tx.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Icon 
            name={tx.type === 'send' ? 'payment-send' : 'payment-receive'} 
            size={20}
            ariaHidden={true}
          />
          <div className="flex-1">
            <p className="font-medium">{tx.description}</p>
            <p className="text-sm text-gray-600">{tx.date}</p>
          </div>
          <p className={`font-semibold ${tx.type === 'send' ? 'text-red-600' : 'text-green-600'}`}>
            {tx.type === 'send' ? '-' : '+'}{tx.amount}
          </p>
        </div>
      ))}
    </div>
  )
}
```

---

## References

- [Icon Component API](./ICON_STYLE_GUIDE.md)
- [Icon Grid Specifications](./ICON_GRID_SPECIFICATIONS.md)
- [Icon Definitions](./src/icons/iconDefinitions.ts)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-20 | Initial usage guidelines |


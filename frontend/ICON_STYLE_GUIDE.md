# Icon Style Guide

## Overview

This document defines the comprehensive icon system for the Soroban Ajo application. All icons follow a consistent design language ensuring visual harmony, accessibility, and professional appearance across the platform.

---

## Icon Grid & Sizing System

### Base Grid: 24px

All icons are designed on a 24×24px grid with 2px stroke weight. This ensures consistency and scalability across all sizes.

### Supported Sizes

| Size | Tailwind Class | Use Case |
|------|---|---|
| **16px** | `w-4 h-4` | Inline text, compact UI, badges |
| **20px** | `w-5 h-5` | Form labels, small buttons |
| **24px** | `w-6 h-6` | Default, standard buttons, navigation |
| **32px** | `w-8 h-8` | Large buttons, card headers |
| **48px** | `w-12 h-12` | Hero sections, large CTAs, featured content |

### Scaling Guidelines

- Icons scale proportionally from the 24px base
- Maintain 2px stroke weight across all sizes
- Padding/margins scale with icon size (typically 4-8px)
- Never scale below 16px for readability
- Never scale above 48px without design review

---

## Stroke Specifications

### Stroke Weight
- **Primary**: 2px (all icons)
- **Consistency**: All strokes use the same weight for visual harmony

### Stroke Style
- **Line Cap**: Round (`strokeLinecap="round"`)
- **Line Join**: Round (`strokeLinejoin="round"`)
- **Fill**: None (stroke-only design)

### Stroke Color
- Uses `currentColor` for dynamic theming
- Inherits color from parent context or variant class

---

## Icon States

### Default State
- Standard appearance
- Color: `text-gray-700`
- Opacity: 100%
- Use: Normal UI elements

### Active State
- Indicates selected or focused state
- Color: `text-blue-600`
- Opacity: 100%
- Use: Selected items, active navigation, highlighted actions

### Disabled State
- Indicates unavailable or inactive element
- Color: `text-gray-300`
- Opacity: 100%
- Use: Disabled buttons, locked features, inactive items

### Error State
- Indicates error or failure
- Color: `text-red-600`
- Opacity: 100%
- Use: Failed transactions, validation errors, alerts

### Success State
- Indicates successful completion
- Color: `text-green-600`
- Opacity: 100%
- Use: Completed actions, verified items, confirmations

### Warning State
- Indicates caution or attention needed
- Color: `text-amber-600`
- Opacity: 100%
- Use: Low balance, expiring items, warnings

### Info State
- Indicates informational content
- Color: `text-cyan-600`
- Opacity: 100%
- Use: Help text, information, tips

---

## Icon Naming Conventions

### Pattern: `{category}-{action/state}`

All icons follow a consistent naming pattern for easy discovery and organization.

### Categories

| Category | Prefix | Purpose | Examples |
|----------|--------|---------|----------|
| **Action** | `action-` | User interactions | add, delete, edit, save, download, upload, share, refresh |
| **Status** | `status-` | State indicators | active, inactive, pending, completed, warning, error, locked, verified |
| **Payment** | `payment-` | Financial operations | wallet, send, receive, coin, card, invoice, history, calculator |
| **Navigation** | `nav-` | Navigation elements | home, back, forward, menu |
| **UI** | `ui-` | Interface elements | search, settings, help, close |
| **Social** | `social-` | User/group related | user, users |
| **Chart** | `chart-` | Data visualization | bar, line |
| **Validation** | `validation-` | Form validation | check, cross |

### Naming Rules

1. Use lowercase with hyphens
2. Be descriptive but concise
3. Avoid abbreviations (use `action-delete` not `action-del`)
4. Use action verbs when appropriate (send, receive, download)
5. Use state nouns for status icons (active, pending, completed)

---

## Icon Library (30+ Icons)

### Action Icons (8)

| Icon | Name | Description | Use Cases |
|------|------|-------------|-----------|
| ➕ | `action-add` | Plus icon | Create group, add member, new transaction |
| 🗑️ | `action-delete` | Trash icon | Delete group, remove member, clear data |
| ✏️ | `action-edit` | Pencil icon | Edit group settings, modify profile |
| 💾 | `action-save` | Floppy disk | Save changes, confirm action |
| ⬇️ | `action-download` | Download arrow | Export data, download report |
| ⬆️ | `action-upload` | Upload arrow | Import data, upload file |
| 🔗 | `action-share` | Share icon | Share group, invite members |
| 🔄 | `action-refresh` | Refresh icon | Reload data, sync, retry |

### Status Icons (8)

| Icon | Name | Description | Use Cases |
|------|------|-------------|-----------|
| 🟢 | `status-active` | Active indicator | Active group, online member |
| ⚪ | `status-inactive` | Inactive indicator | Inactive group, offline member |
| ⏳ | `status-pending` | Pending indicator | Pending transaction, awaiting confirmation |
| ✅ | `status-completed` | Completed indicator | Completed group, finished transaction |
| ⚠️ | `status-warning` | Warning indicator | Low balance, expiring soon |
| ❌ | `status-error` | Error indicator | Failed transaction, error state |
| 🔒 | `status-locked` | Locked indicator | Locked group, restricted access |
| ✔️ | `status-verified` | Verified indicator | Verified member, confirmed transaction |

### Payment Icons (8)

| Icon | Name | Description | Use Cases |
|------|------|-------------|-----------|
| 👛 | `payment-wallet` | Wallet icon | Wallet connection, balance display |
| 📤 | `payment-send` | Send icon | Send payment, transfer funds |
| 📥 | `payment-receive` | Receive icon | Receive payment, incoming funds |
| 💰 | `payment-coin` | Coin icon | Currency display, amount, balance |
| 💳 | `payment-card` | Card icon | Payment method, card details |
| 📄 | `payment-invoice` | Invoice icon | Invoice, receipt, transaction history |
| 📋 | `payment-history` | History icon | Transaction history, timeline |
| 🧮 | `payment-calculator` | Calculator icon | Calculate, compute, math operations |

### Navigation Icons (4)

| Icon | Name | Description | Use Cases |
|------|------|-------------|-----------|
| 🏠 | `nav-home` | Home icon | Home page, dashboard, main view |
| ◀️ | `nav-back` | Back arrow | Go back, previous page |
| ▶️ | `nav-forward` | Forward arrow | Go forward, next page |
| ☰ | `nav-menu` | Menu icon | Toggle menu, navigation menu |

### UI Icons (4)

| Icon | Name | Description | Use Cases |
|------|------|-------------|-----------|
| 🔍 | `ui-search` | Search icon | Search, find, lookup |
| ⚙️ | `ui-settings` | Settings icon | Settings, configuration, preferences |
| ❓ | `ui-help` | Help icon | Help, FAQ, support |
| ✕ | `ui-close` | Close icon | Close modal, dismiss, cancel |

### Social Icons (2)

| Icon | Name | Description | Use Cases |
|------|------|-------------|-----------|
| 👤 | `social-user` | User icon | User profile, member, account |
| 👥 | `social-users` | Users icon | Group members, team, community |

### Chart Icons (2)

| Icon | Name | Description | Use Cases |
|------|------|-------------|-----------|
| 📊 | `chart-bar` | Bar chart | Analytics, statistics, data visualization |
| 📈 | `chart-line` | Line chart | Trends, growth, performance |

### Validation Icons (2)

| Icon | Name | Description | Use Cases |
|------|------|-------------|-----------|
| ✓ | `validation-check` | Checkmark | Success, confirmed, valid |
| ✗ | `validation-cross` | Cross | Error, invalid, failed |

---

## SVG Export Specifications

### Technical Requirements

```xml
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Icon paths here -->
</svg>
```

### Export Settings (Figma)

1. **Format**: SVG
2. **Precision**: 2 decimal places
3. **Rounding**: Enabled
4. **Optimization**: Enabled
5. **Include namespaces**: Disabled
6. **Minify**: Disabled (for readability)

### Path Guidelines

- Use absolute coordinates
- Round to 2 decimal places
- Combine paths where possible
- Use `<line>`, `<circle>`, `<rect>`, `<polyline>` for simple shapes
- Use `<path>` for complex shapes
- Always use `d` attribute for paths

### Color Handling

- Never hardcode colors in SVG
- Use `currentColor` for stroke/fill
- Remove all fill attributes (use stroke only)
- Ensure `fill="none"` for all icons

---

## Icon Usage Guidelines

### Basic Usage

```tsx
import { Icon } from '@/components/Icon'

// Default icon
<Icon name="action-add" />

// With size
<Icon name="action-add" size={32} />

// With variant
<Icon name="action-add" variant="success" />

// With accessibility label
<Icon name="action-add" ariaLabel="Add new group" />

// With custom class
<Icon name="action-add" className="hover:text-blue-700" />
```

### In Buttons

```tsx
<button className="flex items-center gap-2">
  <Icon name="action-add" size={20} />
  Create Group
</button>
```

### In Navigation

```tsx
<nav className="flex gap-4">
  <a href="/">
    <Icon name="nav-home" variant="active" />
  </a>
  <a href="/groups">
    <Icon name="social-users" />
  </a>
</nav>
```

### Status Indicators

```tsx
<div className="flex items-center gap-2">
  <Icon name="status-active" variant="success" size={16} />
  <span>Active</span>
</div>
```

### Payment Display

```tsx
<div className="flex items-center gap-2">
  <Icon name="payment-coin" variant="info" size={24} />
  <span>1,250 USDC</span>
</div>
```

### Form Validation

```tsx
{isValid ? (
  <Icon name="validation-check" variant="success" size={20} />
) : (
  <Icon name="validation-cross" variant="error" size={20} />
)}
```

### Loading State

```tsx
<Icon name="action-refresh" className="animate-spin" />
```

---

## Accessibility

### ARIA Attributes

```tsx
// Decorative icon (default)
<Icon name="action-add" ariaHidden={true} />

// Icon with meaning
<Icon 
  name="status-error" 
  ariaLabel="Error: Transaction failed"
  ariaHidden={false}
/>

// Icon with title
<Icon 
  name="payment-wallet" 
  title="Connect your wallet"
/>
```

### Best Practices

1. Use `ariaHidden={true}` for decorative icons
2. Provide `ariaLabel` for icons that convey meaning
3. Use `title` attribute for tooltips
4. Pair icons with text labels when possible
5. Ensure sufficient color contrast (WCAG AA minimum)
6. Test with screen readers

### Color Contrast

All icon variants meet WCAG AA standards:

| Variant | Color | Contrast Ratio |
|---------|-------|-----------------|
| Default | Gray-700 | 7.5:1 |
| Active | Blue-600 | 8.6:1 |
| Disabled | Gray-300 | 2.1:1 |
| Error | Red-600 | 5.3:1 |
| Success | Green-600 | 5.2:1 |
| Warning | Amber-600 | 5.8:1 |
| Info | Cyan-600 | 5.1:1 |

---

## Implementation

### Setup

1. Add `IconSprite` to your app root:

```tsx
// App.tsx
import { IconSprite } from '@/components/IconSprite'

export function App() {
  return (
    <>
      <IconSprite />
      {/* Rest of app */}
    </>
  )
}
```

2. Import and use icons:

```tsx
import { Icon } from '@/components/Icon'

export function MyComponent() {
  return <Icon name="action-add" size={24} />
}
```

### TypeScript Support

```tsx
import { Icon, IconSize, IconVariant } from '@/components/Icon'
import { IconName, getIconsByCategory } from '@/icons/iconDefinitions'

// Type-safe icon usage
const iconName: IconName = 'action-add'
const size: IconSize = 24
const variant: IconVariant = 'success'

<Icon name={iconName} size={size} variant={variant} />
```

### Customization

Extend icon variants in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'icon-primary': '#3B82F6',
        'icon-secondary': '#8B5CF6',
      }
    }
  }
}
```

Then use in Icon component:

```tsx
const variantMap = {
  // ... existing variants
  'custom': 'text-icon-primary',
}
```

---

## Performance Considerations

### Sprite Sheet Benefits

- Single HTTP request for all icons
- Reduced file size vs individual SVGs
- Faster rendering
- Better caching

### Optimization Tips

1. Use appropriate sizes (don't scale 48px icon to 16px)
2. Lazy load IconSprite if not immediately needed
3. Use CSS classes for styling (avoid inline styles)
4. Memoize Icon component in lists

```tsx
const MemoizedIcon = React.memo(Icon)
```

---

## Maintenance & Updates

### Adding New Icons

1. Design on 24×24px grid
2. Use 2px stroke weight
3. Export as SVG
4. Add to `IconSprite.tsx`
5. Add definition to `iconDefinitions.ts`
6. Update this guide
7. Test across all sizes and variants

### Icon Checklist

- [ ] Designed on 24×24px grid
- [ ] 2px stroke weight
- [ ] Round caps and joins
- [ ] No hardcoded colors
- [ ] Tested at all sizes (16, 20, 24, 32, 48px)
- [ ] Tested with all variants
- [ ] Accessibility tested
- [ ] Added to sprite sheet
- [ ] Added to definitions
- [ ] Documentation updated

---

## Design System Integration

### Color Palette

Icons use the application's color system:

```css
--color-primary: #3B82F6;      /* Blue-600 */
--color-secondary: #8B5CF6;    /* Purple-500 */
--color-success: #10B981;      /* Green-600 */
--color-error: #EF4444;        /* Red-600 */
--color-warning: #F59E0B;      /* Amber-500 */
--color-info: #06B6D4;         /* Cyan-600 */
--color-default: #374151;      /* Gray-700 */
--color-disabled: #D1D5DB;     /* Gray-300 */
```

### Typography Integration

Icons align with text baseline:

```tsx
<div className="flex items-center gap-2">
  <Icon name="action-add" size={20} />
  <span className="text-base">Add Item</span>
</div>
```

---

## Troubleshooting

### Icon Not Displaying

1. Ensure `IconSprite` is rendered in app root
2. Check icon name spelling
3. Verify icon exists in `iconDefinitions.ts`
4. Check browser console for errors

### Color Not Applying

1. Verify variant name is correct
2. Check Tailwind CSS is configured
3. Ensure `currentColor` is used in SVG
4. Check for CSS specificity conflicts

### Accessibility Issues

1. Add `ariaLabel` for meaningful icons
2. Use `ariaHidden={true}` for decorative icons
3. Test with screen readers
4. Verify color contrast ratios

---

## References

- [SVG Specification](https://www.w3.org/TR/SVG2/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React SVG Best Practices](https://react.dev/reference/react-dom/components/svg)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-20 | Initial icon library with 30+ icons |

---

## Contact & Support

For icon requests, design questions, or issues:
1. Check this guide first
2. Review existing icons in `iconDefinitions.ts`
3. Submit design specifications for new icons
4. Follow the icon checklist for additions

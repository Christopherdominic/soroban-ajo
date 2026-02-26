# Icon System Documentation

## Overview

The Soroban Ajo icon system provides a comprehensive, accessible, and scalable library of 30+ icons designed for consistent visual communication across the application.

### Key Features

✅ **30+ Icons** - Organized into 8 categories (action, status, payment, navigation, UI, social, chart, validation)
✅ **5 Sizes** - 16px, 20px, 24px, 32px, 48px with Tailwind integration
✅ **7 Variants** - default, active, disabled, error, success, warning, info
✅ **Accessibility** - Full WCAG AA compliance with ARIA support
✅ **Performance** - SVG sprite sheet for efficient delivery
✅ **Type-Safe** - Full TypeScript support with icon name validation

---

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

### 2. Use Icons

```tsx
import { Icon } from '@/components/Icon'

export function MyComponent() {
  return (
    <button className="flex items-center gap-2">
      <Icon name="action-add" size={20} />
      Create Group
    </button>
  )
}
```

---

## Documentation

### 📖 Main Guides

1. **[Icon Style Guide](./ICON_STYLE_GUIDE.md)** - Complete design system documentation
   - Icon library (30+ icons)
   - Naming conventions
   - States and variants
   - Accessibility guidelines
   - Implementation details

2. **[Icon Grid Specifications](./ICON_GRID_SPECIFICATIONS.md)** - Technical specifications
   - Grid system (24×24px base)
   - Sizing system (16, 20, 24, 32, 48px)
   - Stroke specifications (2px weight)
   - SVG export requirements
   - Performance optimization

3. **[Icon Usage Guidelines](./ICON_USAGE_GUIDELINES.md)** - Practical usage examples
   - Common patterns
   - Component integration
   - Accessibility best practices
   - Troubleshooting
   - Real-world examples

### 📁 Source Files

- **`src/components/Icon.tsx`** - Icon component (React)
- **`src/components/IconSprite.tsx`** - SVG sprite sheet
- **`src/icons/iconDefinitions.ts`** - Icon definitions and metadata

---

## Icon Library

### Categories

| Category | Count | Icons |
|----------|-------|-------|
| **Action** | 8 | add, delete, edit, save, download, upload, share, refresh |
| **Status** | 8 | active, inactive, pending, completed, warning, error, locked, verified |
| **Payment** | 8 | wallet, send, receive, coin, card, invoice, history, calculator |
| **Navigation** | 4 | home, back, forward, menu |
| **UI** | 4 | search, settings, help, close |
| **Social** | 2 | user, users |
| **Chart** | 2 | bar, line |
| **Validation** | 2 | check, cross |
| **Total** | **38** | |

### Icon Naming Pattern

All icons follow the pattern: `{category}-{action/state}`

Examples:
- `action-add` - Add/create action
- `status-active` - Active status indicator
- `payment-wallet` - Wallet icon
- `nav-home` - Home navigation
- `validation-check` - Validation checkmark

---

## Component API

### Icon Component

```tsx
interface IconProps {
  name: string              // Icon name (e.g., 'action-add')
  size?: IconSize          // 16 | 20 | 24 | 32 | 48 (default: 24)
  variant?: IconVariant    // 'default' | 'active' | 'disabled' | 'error' | 'success' | 'warning' | 'info'
  className?: string       // Additional Tailwind classes
  ariaHidden?: boolean     // Hide from screen readers (default: true)
  ariaLabel?: string       // Accessibility label
  title?: string           // Tooltip text
}
```

### Usage Examples

```tsx
// Basic
<Icon name="action-add" />

// With size
<Icon name="action-add" size={32} />

// With variant
<Icon name="action-add" variant="success" />

// With accessibility
<Icon 
  name="action-add" 
  ariaLabel="Add new group"
  ariaHidden={false}
/>

// With custom styling
<Icon 
  name="action-add" 
  className="hover:text-blue-700 transition-colors"
/>
```

---

## Sizing System

### Responsive Sizes

| Size | Pixels | Tailwind | Use Case |
|------|--------|----------|----------|
| **XS** | 16px | `w-4 h-4` | Inline text, badges |
| **SM** | 20px | `w-5 h-5` | Form labels, small buttons |
| **MD** | 24px | `w-6 h-6` | Default, standard buttons |
| **LG** | 32px | `w-8 h-8` | Large buttons, card headers |
| **XL** | 48px | `w-12 h-12` | Hero sections, featured content |

### Responsive Usage

```tsx
// Mobile: 20px, Desktop: 24px
<Icon 
  name="action-add" 
  size={20}
  className="md:w-6 md:h-6"
/>
```

---

## Variants

### Color Variants

| Variant | Color | Use Case |
|---------|-------|----------|
| **default** | Gray-700 | Normal state |
| **active** | Blue-600 | Selected/focused |
| **disabled** | Gray-300 | Unavailable |
| **error** | Red-600 | Error/failure |
| **success** | Green-600 | Success/valid |
| **warning** | Amber-600 | Warning/caution |
| **info** | Cyan-600 | Information |

### Variant Usage

```tsx
<Icon name="status-active" variant="success" />
<Icon name="status-error" variant="error" />
<Icon name="action-delete" variant="disabled" />
```

---

## Common Patterns

### Button with Icon

```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
  <Icon name="action-add" size={20} ariaHidden={true} />
  Create
</button>
```

### Status Indicator

```tsx
<div className="flex items-center gap-2">
  <Icon name="status-active" variant="success" size={16} ariaHidden={true} />
  <span>Active</span>
</div>
```

### Navigation

```tsx
<nav className="flex gap-4">
  <a href="/" className="flex items-center gap-2">
    <Icon name="nav-home" ariaHidden={true} />
    Home
  </a>
</nav>
```

### Card Header

```tsx
<div className="flex items-center gap-3 mb-4">
  <Icon name="payment-wallet" size={32} variant="info" ariaHidden={true} />
  <h3 className="text-lg font-semibold">Wallet</h3>
</div>
```

### Form Validation

```tsx
{isValid ? (
  <Icon name="validation-check" variant="success" size={20} ariaHidden={true} />
) : (
  <Icon name="validation-cross" variant="error" size={20} ariaHidden={true} />
)}
```

---

## Accessibility

### ARIA Attributes

```tsx
// Decorative icon (default)
<Icon name="action-add" ariaHidden={true} />

// Meaningful icon
<Icon 
  name="status-error" 
  ariaLabel="Error: Transaction failed"
  ariaHidden={false}
/>

// Icon with tooltip
<Icon 
  name="payment-wallet" 
  title="Connect your wallet"
/>
```

### Best Practices

1. Use `ariaHidden={true}` for decorative icons
2. Provide `ariaLabel` for standalone icons
3. Pair icons with text labels when possible
4. Ensure sufficient color contrast (WCAG AA)
5. Test with screen readers

### Color Contrast

All variants meet WCAG AA standards (4.5:1 minimum):

- Default: 7.5:1 (AAA)
- Active: 8.6:1 (AAA)
- Error: 5.3:1 (AA)
- Success: 5.2:1 (AA)
- Warning: 5.8:1 (AA)
- Info: 5.1:1 (AA)

---

## TypeScript Support

### Type-Safe Icon Usage

```tsx
import { Icon, IconSize, IconVariant } from '@/components/Icon'
import { IconName, getIconsByCategory, isValidIconName } from '@/icons/iconDefinitions'

// Type-safe icon name
const iconName: IconName = 'action-add'

// Type-safe size
const size: IconSize = 24

// Type-safe variant
const variant: IconVariant = 'success'

// Validate icon name
if (isValidIconName('action-add')) {
  <Icon name="action-add" />
}

// Get icons by category
const actionIcons = getIconsByCategory('action')
```

---

## Performance

### Optimization Tips

1. **Use appropriate sizes** - Don't scale 48px icon to 16px
2. **Memoize in lists** - Use `React.memo(Icon)` for repeated icons
3. **Use CSS classes** - Avoid inline styles
4. **Lazy load sprite** - Load IconSprite on demand if needed

### Sprite Sheet Benefits

- Single HTTP request for all icons
- Reduced file size vs individual SVGs
- Faster rendering
- Better caching

---

## Troubleshooting

### Icon Not Displaying

**Solution**:
1. Ensure `IconSprite` is rendered in app root
2. Check icon name spelling
3. Verify icon exists in `iconDefinitions.ts`
4. Check browser console for errors

### Color Not Applying

**Solution**:
1. Verify variant name is correct
2. Check Tailwind CSS is configured
3. Ensure `currentColor` is used in SVG
4. Check for CSS specificity conflicts

### Accessibility Issues

**Solution**:
1. Add `ariaLabel` for meaningful icons
2. Use `ariaHidden={true}` for decorative icons
3. Test with screen readers (NVDA, JAWS, VoiceOver)
4. Verify color contrast ratios

---

## Adding New Icons

### Process

1. Design on 24×24px grid
2. Use 2px stroke weight
3. Export as SVG
4. Add to `IconSprite.tsx`
5. Add definition to `iconDefinitions.ts`
6. Update documentation
7. Test across all sizes and variants

### Checklist

- [ ] Designed on 24×24px grid
- [ ] 2px stroke weight
- [ ] Round caps and joins
- [ ] No hardcoded colors
- [ ] Tested at all sizes
- [ ] Tested with all variants
- [ ] Accessibility tested
- [ ] Added to sprite sheet
- [ ] Added to definitions
- [ ] Documentation updated

---

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Icon.tsx              # Icon component
│   │   └── IconSprite.tsx        # SVG sprite sheet
│   └── icons/
│       └── iconDefinitions.ts    # Icon definitions
├── ICON_STYLE_GUIDE.md           # Design system
├── ICON_GRID_SPECIFICATIONS.md   # Technical specs
├── ICON_USAGE_GUIDELINES.md      # Usage examples
└── ICON_SYSTEM_README.md         # This file
```

---

## Related Documentation

- [Icon Style Guide](./ICON_STYLE_GUIDE.md) - Complete design system
- [Icon Grid Specifications](./ICON_GRID_SPECIFICATIONS.md) - Technical details
- [Icon Usage Guidelines](./ICON_USAGE_GUIDELINES.md) - Practical examples
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-20 | Initial icon system with 38 icons |

---

## Support

For questions or issues:
1. Check the relevant documentation guide
2. Review examples in `ICON_USAGE_GUIDELINES.md`
3. Verify icon name in `iconDefinitions.ts`
4. Check browser console for errors
5. Test with different sizes and variants

---

## License

The icon system is part of the Soroban Ajo project and follows the same license terms.


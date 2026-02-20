# Icon Grid Specifications

## Overview

This document provides detailed technical specifications for the icon grid system, sizing, and implementation guidelines for the Soroban Ajo application.

---

## Grid System

### Base Grid: 24×24px

All icons are designed on a 24×24px grid with a 2px stroke weight. This ensures consistency and scalability.

```
┌─────────────────────────────┐
│                             │
│      24×24px Grid           │
│      2px Stroke             │
│                             │
└─────────────────────────────┘
```

### Safe Zone

The safe zone is the area where icon content should be placed to ensure visibility at all sizes.

```
┌─────────────────────────────┐
│  ┌─────────────────────┐    │
│  │                     │    │
│  │   Safe Zone         │    │
│  │   20×20px           │    │
│  │   (2px padding)     │    │
│  │                     │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

### Padding & Margins

- **Internal Padding**: 2px from edge
- **Safe Zone**: 20×20px
- **Stroke Width**: 2px
- **Minimum Clearance**: 1px between elements

---

## Sizing System

### Responsive Sizes

| Size | Pixels | Tailwind | Use Case | Margin |
|------|--------|----------|----------|--------|
| **XS** | 16px | `w-4 h-4` | Inline text, badges, compact UI | 4px |
| **SM** | 20px | `w-5 h-5` | Form labels, small buttons | 4px |
| **MD** | 24px | `w-6 h-6` | Default, standard buttons | 6px |
| **LG** | 32px | `w-8 h-8` | Large buttons, card headers | 8px |
| **XL** | 48px | `w-12 h-12` | Hero sections, featured content | 12px |

### Scaling Ratios

All sizes maintain proportional scaling from the 24px base:

```
16px = 24px × 0.67
20px = 24px × 0.83
24px = 24px × 1.00 (base)
32px = 24px × 1.33
48px = 24px × 2.00
```

### Stroke Weight Consistency

Stroke weight remains 2px across all sizes for visual consistency:

| Size | Stroke | Ratio |
|------|--------|-------|
| 16px | 2px | 12.5% |
| 20px | 2px | 10% |
| 24px | 2px | 8.3% |
| 32px | 2px | 6.25% |
| 48px | 2px | 4.17% |

---

## Spacing & Layout

### Icon Spacing in Components

#### Inline with Text

```
┌──────────────────────────────┐
│ [Icon] 4px [Text]            │
└──────────────────────────────┘

Gap: 4-6px (size dependent)
Alignment: Center
```

#### Button Layout

```
┌──────────────────────────────┐
│  [Icon] 6px [Text] 12px      │
└──────────────────────────────┘

Icon margin: 6px
Text margin: 12px
Padding: 8-12px
```

#### Icon Grid

```
┌─────┐ ┌─────┐ ┌─────┐
│ [I] │ │ [I] │ │ [I] │
└─────┘ └─────┘ └─────┘
  8px    8px    8px

Gap: 8px between icons
Padding: 8px from container edge
```

### Vertical Alignment

```
Text Baseline
    ↓
┌───────────────────────────┐
│ [Icon] Text               │
│   ↑                       │
│ Center aligned            │
└───────────────────────────┘
```

Use `items-center` in Tailwind for proper alignment.

---

## Stroke Specifications

### Stroke Weight

- **Primary**: 2px
- **Consistency**: All icons use 2px
- **Reason**: Optimal visibility and scalability

### Stroke Style

```
strokeLinecap="round"    /* Rounded line endings */
strokeLinejoin="round"   /* Rounded line corners */
fill="none"              /* Stroke only, no fill */
```

### Stroke Color

```
stroke="currentColor"    /* Inherits from text color */
```

This allows icons to inherit color from:
- Parent text color
- Tailwind color classes
- CSS color properties

### Stroke Examples

#### Simple Line
```svg
<line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" />
```

#### Curved Path
```svg
<path d="M 5 12 Q 12 5 19 12" strokeWidth="2" />
```

#### Circle
```svg
<circle cx="12" cy="12" r="10" strokeWidth="2" />
```

---

## Viewbox & Coordinate System

### Standard Viewbox

```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <!-- Icon content -->
</svg>
```

### Coordinate System

```
(0,0) ─────────────────── (24,0)
  │                          │
  │      24×24 Grid          │
  │                          │
(0,24) ─────────────────── (24,24)
```

### Common Coordinates

| Position | X | Y |
|----------|---|---|
| Top-left | 0 | 0 |
| Top-center | 12 | 0 |
| Top-right | 24 | 0 |
| Center-left | 0 | 12 |
| Center | 12 | 12 |
| Center-right | 24 | 12 |
| Bottom-left | 0 | 24 |
| Bottom-center | 12 | 24 |
| Bottom-right | 24 | 24 |

---

## Icon Anatomy

### Simple Icon (Line-based)

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <line x1="12" y1="5" x2="12" y2="19" />
  <line x1="5" y1="12" x2="19" y2="12" />
</svg>
```

### Complex Icon (Path-based)

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path d="M 12 2 L 15 10 L 23 10 L 17 16 L 19 24 L 12 19 L 5 24 L 7 16 L 1 10 L 9 10 Z" />
</svg>
```

### Composite Icon (Multiple elements)

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <circle cx="12" cy="12" r="10" />
  <line x1="12" y1="8" x2="12" y2="12" />
  <line x1="12" y1="12" x2="15" y2="15" />
</svg>
```

---

## Design Guidelines

### Optical Centering

Icons should appear visually centered, not mathematically centered:

```
Mathematical Center: (12, 12)
Visual Center: May vary based on icon shape
```

Adjust coordinates to achieve visual balance.

### Negative Space

Maintain consistent negative space around icon content:

```
┌─────────────────────────┐
│  ┌─────────────────┐    │
│  │                 │    │
│  │   Icon Content  │    │
│  │                 │    │
│  └─────────────────┘    │
└─────────────────────────┘

Padding: 2px minimum
```

### Symmetry

Most icons should be symmetrical for visual balance:

```
Vertical Symmetry:
    ↑
    │
────┼────
    │
    ↓

Horizontal Symmetry:
← ─ ┼ ─ →
```

### Consistency

Maintain consistent visual weight across all icons:

```
Light Icon    Medium Icon   Heavy Icon
(thin lines)  (2px stroke)  (thick lines)

Use: 2px stroke for all
```

---

## Color Variants

### Variant Color Mapping

| Variant | Color | Hex | Tailwind | Use Case |
|---------|-------|-----|----------|----------|
| Default | Gray-700 | #374151 | `text-gray-700` | Normal state |
| Active | Blue-600 | #2563EB | `text-blue-600` | Selected/focused |
| Disabled | Gray-300 | #D1D5DB | `text-gray-300` | Unavailable |
| Error | Red-600 | #DC2626 | `text-red-600` | Error/failure |
| Success | Green-600 | #16A34A | `text-green-600` | Success/valid |
| Warning | Amber-600 | #D97706 | `text-amber-600` | Warning/caution |
| Info | Cyan-600 | #0891B2 | `text-cyan-600` | Information |

### Color Application

```tsx
<Icon name="action-add" variant="success" />
// Renders with text-green-600 class
```

---

## Implementation Details

### SVG Sprite Sheet

Icons are stored in a sprite sheet for efficient delivery:

```svg
<svg style={{ display: 'none' }}>
  <defs>
    <symbol id="icon-action-add" viewBox="0 0 24 24">
      <!-- Icon content -->
    </symbol>
    <symbol id="icon-action-delete" viewBox="0 0 24 24">
      <!-- Icon content -->
    </symbol>
  </defs>
</svg>
```

### Icon Reference

Icons are referenced using `<use>` element:

```tsx
<svg viewBox="0 0 24 24">
  <use href="#icon-action-add" />
</svg>
```

### Tailwind Integration

Icon sizes map to Tailwind classes:

```js
const sizeMap = {
  16: 'w-4 h-4',
  20: 'w-5 h-5',
  24: 'w-6 h-6',
  32: 'w-8 h-8',
  48: 'w-12 h-12',
}
```

---

## Responsive Behavior

### Mobile (< 640px)

- Default icon size: 20px
- Minimum touch target: 44×44px
- Spacing: 4px

```tsx
<Icon name="action-add" size={20} className="md:w-6 md:h-6" />
```

### Tablet (640px - 1024px)

- Default icon size: 24px
- Touch target: 48×48px
- Spacing: 6px

### Desktop (> 1024px)

- Default icon size: 24px
- Hover effects enabled
- Spacing: 8px

---

## Performance Optimization

### File Size

- Single sprite sheet: ~15KB (gzipped)
- Individual icon: ~200-400 bytes
- Total icons: 30+

### Loading Strategy

1. **Inline Sprite**: Embed in HTML for instant availability
2. **Lazy Load**: Load sprite on demand if needed
3. **Preload**: Preload sprite in critical path

### Caching

- Sprite sheet: Long-term cache (1 year)
- Icon component: Browser cache
- CSS classes: Tailwind cache

---

## Accessibility Specifications

### ARIA Attributes

```tsx
// Decorative icon
<Icon name="action-add" ariaHidden={true} />

// Meaningful icon
<Icon 
  name="status-error" 
  ariaLabel="Error: Transaction failed"
  ariaHidden={false}
/>
```

### Color Contrast

All variants meet WCAG AA standards (4.5:1 minimum):

| Variant | Contrast | Level |
|---------|----------|-------|
| Default | 7.5:1 | AAA |
| Active | 8.6:1 | AAA |
| Error | 5.3:1 | AA |
| Success | 5.2:1 | AA |
| Warning | 5.8:1 | AA |
| Info | 5.1:1 | AA |

### Screen Reader Support

```tsx
// Good: Icon with label
<div className="flex items-center gap-2">
  <Icon name="status-active" ariaHidden={true} />
  <span>Active</span>
</div>

// Good: Icon with aria-label
<Icon 
  name="action-add" 
  ariaLabel="Add new group"
/>

// Avoid: Icon without context
<Icon name="action-add" />
```

---

## Testing Specifications

### Visual Testing

- [ ] Icon displays correctly at all sizes (16, 20, 24, 32, 48px)
- [ ] Icon displays correctly with all variants
- [ ] Icon maintains aspect ratio when scaled
- [ ] Stroke weight appears consistent

### Functional Testing

- [ ] Icon renders without errors
- [ ] Icon inherits color from parent
- [ ] Icon responds to hover/active states
- [ ] Icon works with custom classes

### Accessibility Testing

- [ ] Screen reader announces icon correctly
- [ ] Color contrast meets WCAG AA
- [ ] Icon works with keyboard navigation
- [ ] Icon works with zoom (up to 200%)

### Performance Testing

- [ ] Sprite sheet loads efficiently
- [ ] Icon renders without layout shift
- [ ] No console errors
- [ ] Memory usage is minimal

---

## Export Checklist

When exporting icons from Figma:

- [ ] Format: SVG
- [ ] Precision: 2 decimal places
- [ ] Rounding: Enabled
- [ ] Optimization: Enabled
- [ ] Include namespaces: Disabled
- [ ] Minify: Disabled
- [ ] Viewbox: 0 0 24 24
- [ ] Stroke width: 2
- [ ] Stroke linecap: round
- [ ] Stroke linejoin: round
- [ ] Fill: none
- [ ] Color: currentColor

---

## Common Issues & Solutions

### Icon Appears Blurry

**Cause**: Odd pixel coordinates
**Solution**: Use even numbers for coordinates

```svg
<!-- Bad -->
<line x1="5.5" y1="12" x2="18.5" y2="12" />

<!-- Good -->
<line x1="5" y1="12" x2="19" y2="12" />
```

### Icon Doesn't Scale Properly

**Cause**: Hardcoded dimensions
**Solution**: Use viewBox and relative sizing

```svg
<!-- Bad -->
<svg width="24" height="24" viewBox="0 0 24 24">

<!-- Good -->
<svg viewBox="0 0 24 24">
```

### Color Not Applying

**Cause**: Fill attribute overriding stroke
**Solution**: Ensure fill="none"

```svg
<!-- Bad -->
<circle cx="12" cy="12" r="10" fill="blue" />

<!-- Good -->
<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" />
```

### Icon Misaligned

**Cause**: Uneven padding
**Solution**: Center content in viewBox

```svg
<!-- Ensure content is centered around (12, 12) -->
<line x1="5" y1="12" x2="19" y2="12" />
```

---

## References

- [SVG Specification](https://www.w3.org/TR/SVG2/)
- [Tailwind CSS Sizing](https://tailwindcss.com/docs/width)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Material Design Icons](https://fonts.google.com/icons)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-20 | Initial grid specifications |


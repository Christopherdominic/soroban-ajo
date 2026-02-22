# Design System Documentation

Complete design system and component library for Soroban Ajo.

## Overview

The design system provides a comprehensive set of design tokens, utility classes, and component styles that ensure consistency across the application.

## Files Structure

```
src/styles/
├── variables.css    # Design tokens (CSS custom properties)
├── globals.css      # Global styles, components, and utilities
└── README.md        # This file
```

## Design Tokens

All design tokens are defined in `variables.css` as CSS custom properties.

### Typography

#### Font Families
- `--font-family-sans`: Inter (body text)
- `--font-family-display`: Inter (headings)
- `--font-family-mono`: Fira Code (code)

#### Font Sizes
```css
--font-size-xs: 0.75rem    /* 12px */
--font-size-sm: 0.875rem   /* 14px */
--font-size-base: 1rem     /* 16px */
--font-size-lg: 1.125rem   /* 18px */
--font-size-xl: 1.25rem    /* 20px */
--font-size-2xl: 1.5rem    /* 24px */
--font-size-3xl: 1.875rem  /* 30px */
--font-size-4xl: 2.25rem   /* 36px */
--font-size-5xl: 3rem      /* 48px */
--font-size-6xl: 3.75rem   /* 60px */
```

#### Font Weights
- `light`: 300
- `normal`: 400
- `medium`: 500
- `semibold`: 600
- `bold`: 700
- `extrabold`: 800

### Spacing Scale

```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
```

### Border Radius

```css
--radius-sm: 0.125rem    /* 2px */
--radius-base: 0.25rem   /* 4px */
--radius-md: 0.375rem    /* 6px */
--radius-lg: 0.5rem      /* 8px */
--radius-xl: 0.75rem     /* 12px */
--radius-2xl: 1rem       /* 16px */
--radius-3xl: 1.5rem     /* 24px */
--radius-full: 9999px
```

### Shadows

#### Standard Shadows
- `--shadow-xs`: Minimal shadow
- `--shadow-sm`: Small shadow
- `--shadow-base`: Default shadow
- `--shadow-md`: Medium shadow
- `--shadow-lg`: Large shadow
- `--shadow-xl`: Extra large shadow
- `--shadow-2xl`: Maximum shadow

#### Glow Shadows
- `--shadow-glow-sm`: Small glow effect
- `--shadow-glow-md`: Medium glow effect
- `--shadow-glow-lg`: Large glow effect

#### Card Shadows
- `--shadow-card`: Default card shadow
- `--shadow-card-hover`: Card hover state
- `--shadow-card-active`: Card active state

### Animation

#### Durations
```css
--duration-instant: 75ms
--duration-fast: 150ms
--duration-base: 200ms
--duration-moderate: 300ms
--duration-slow: 500ms
--duration-slower: 700ms
```

#### Easings
- `--ease-linear`: Linear timing
- `--ease-in`: Ease in
- `--ease-out`: Ease out
- `--ease-in-out`: Ease in-out
- `--ease-bounce`: Bounce effect
- `--ease-elastic`: Elastic effect

### Colors

#### Primary (Indigo)
- 50-950 scale available
- Main: `--color-primary-600`

#### Accent (Purple)
- 50-900 scale available
- Main: `--color-accent-600`

#### Surface (Slate)
- 50-950 scale available
- Used for backgrounds and UI elements

#### Semantic Colors
- `--color-success`: #10b981 (Green)
- `--color-error`: #ef4444 (Red)
- `--color-warning`: #f59e0b (Amber)
- `--color-info`: #06b6d4 (Cyan)

#### Theme Colors
- `--color-background`: Adapts to light/dark mode
- `--color-foreground`: Adapts to light/dark mode
- `--color-muted`: Adapts to light/dark mode
- `--color-border`: Adapts to light/dark mode

## Component Classes

### Buttons

```tsx
// Primary button
<button className="btn btn-primary btn-md">Click me</button>

// Secondary button
<button className="btn btn-secondary btn-md">Cancel</button>

// Ghost button
<button className="btn btn-ghost btn-sm">Link</button>
```

**Sizes**: `btn-sm`, `btn-md`, `btn-lg`

### Cards

```tsx
// Standard card
<div className="card p-6">Content</div>

// Interactive card
<div className="card card-interactive p-6">Clickable</div>
```

### Inputs

```tsx
// Standard input
<input className="input" placeholder="Enter text" />

// Error state
<input className="input input-error" placeholder="Invalid" />
```

### Badges

```tsx
<span className="badge badge-primary">New</span>
<span className="badge badge-success">Active</span>
<span className="badge badge-error">Error</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-info">Info</span>
```

### Skeleton Loading

```tsx
<div className="skeleton h-4 w-32" />
<div className="skeleton h-20 w-full" />
```

## Utility Classes

### Focus Ring
```tsx
<button className="focus-ring">Accessible button</button>
```

### Scrollbar
```tsx
<div className="scrollbar-thin overflow-auto">
  Scrollable content
</div>
```

### Animations
```tsx
<div className="animate-fade-in">Fades in</div>
<div className="animate-fade-in-up">Slides up while fading</div>
<div className="animate-scale-in">Scales in</div>
<div className="animate-shimmer">Shimmer effect</div>
```

### Gradient Text
```tsx
<h1 className="gradient-text">Beautiful gradient</h1>
```

### Line Clamp
```tsx
<p className="line-clamp-2">
  Long text that will be truncated after 2 lines...
</p>
```

## Tailwind Utilities

All design tokens are also available as Tailwind utilities:

### Colors
```tsx
<div className="bg-primary-600 text-white">Primary</div>
<div className="bg-surface-100 text-surface-900">Surface</div>
```

### Spacing
```tsx
<div className="p-4 m-6 space-y-8">Content</div>
```

### Typography
```tsx
<h1 className="text-4xl font-bold">Heading</h1>
<p className="text-base font-normal">Body text</p>
```

### Shadows
```tsx
<div className="shadow-card hover:shadow-card-hover">Card</div>
<div className="shadow-glow-md">Glowing element</div>
```

### Border Radius
```tsx
<div className="rounded-lg">Standard</div>
<div className="rounded-2xl">Large</div>
<div className="rounded-full">Circle</div>
```

### Animations
```tsx
<div className="transition-all duration-base ease-out">
  Smooth transition
</div>
```

## Dark Mode

Dark mode is supported via:
1. System preference: `@media (prefers-color-scheme: dark)`
2. Manual toggle: `data-theme="dark"` attribute

```tsx
// Toggle dark mode
<html data-theme="dark">
  {/* App content */}
</html>
```

Theme colors automatically adapt:
- `background`, `foreground`, `muted`, `border`

## Z-Index Scale

```tsx
<div className="z-dropdown">Dropdown (1000)</div>
<div className="z-modal">Modal (1050)</div>
<div className="z-tooltip">Tooltip (1070)</div>
```

## Best Practices

1. **Use design tokens**: Always use CSS variables or Tailwind utilities instead of hardcoded values
2. **Consistent spacing**: Use the spacing scale (4px increments)
3. **Semantic colors**: Use semantic color names (success, error, warning, info)
4. **Accessible focus states**: Always include focus-visible styles
5. **Smooth transitions**: Use the duration scale for consistent timing
6. **Dark mode**: Test components in both light and dark modes

## Examples

### Complete Button Component

```tsx
export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children 
}: ButtonProps) {
  return (
    <button 
      className={`
        btn 
        btn-${variant} 
        btn-${size}
      `}
    >
      {children}
    </button>
  );
}
```

### Complete Card Component

```tsx
export function Card({ 
  interactive = false, 
  children 
}: CardProps) {
  return (
    <div 
      className={`
        card 
        p-6 
        ${interactive ? 'card-interactive' : ''}
      `}
    >
      {children}
    </div>
  );
}
```

## Migration Guide

If updating existing components:

1. Replace hardcoded colors with design tokens
2. Use component classes (`.btn`, `.card`, `.input`)
3. Replace custom shadows with design system shadows
4. Use spacing scale instead of arbitrary values
5. Add dark mode support using theme colors

## Support

For questions or issues with the design system, refer to:
- `/documentation/Design brand guidelines and visual identity.txt`
- `/documentation/ICON_SYSTEM_README.md`

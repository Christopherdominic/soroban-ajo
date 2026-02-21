# Brand Patterns & Background Textures

This document describes the brand patterns and background textures available in the Soroban Ajo application.

## Overview

The brand pattern system provides Stellar-themed visual elements that enhance the design while maintaining consistency across the application. All patterns are optimized for performance and accessibility.

## Available Patterns

### 1. SVG Patterns

Located in `frontend/public/patterns/`:

#### Stellar Waves (`stellar-waves.svg`)
- Smooth wave patterns with gradient fills
- Best for: Hero sections, page headers
- Colors: Blue to purple to cyan gradient
- Usage: `bg-stellar-waves` or `pattern-overlay-waves`

#### Stellar Mesh (`stellar-mesh.svg`)
- Mesh gradient with blend modes
- Best for: Full-page backgrounds, sections
- Colors: Multi-directional gradients
- Usage: `bg-stellar-mesh` or `pattern-overlay-mesh`

#### Stellar Constellation (`stellar-constellation.svg`)
- Connected star pattern
- Best for: Dark backgrounds, feature cards
- Colors: Blue, purple, cyan stars with connections
- Usage: `bg-stellar-constellation` or `pattern-overlay-constellation`

#### Stellar Grid (`stellar-grid.svg`)
- Subtle dot grid pattern
- Best for: Card backgrounds, subtle textures
- Colors: Light blue dots
- Usage: `bg-stellar-grid` or `pattern-overlay-grid`

### 2. CSS Gradient Patterns

#### Gradient Stellar
- Linear gradient across brand colors
- Usage: `bg-gradient-stellar` or `bg-pattern-gradient`
- Colors: Blue → Purple → Cyan

#### Gradient Stellar Subtle
- Low-opacity version for subtle backgrounds
- Usage: `bg-gradient-stellar-subtle` or `bg-pattern-gradient-subtle`
- Opacity: 5%

#### Animated Gradient
- Shifting gradient animation (15s loop)
- Usage: `bg-animated-gradient`
- Animation: Smooth color position shift

#### Mesh Gradient
- Radial gradients from corners
- Usage: `bg-mesh-gradient`
- Effect: Soft corner glows

## Component Usage

### BrandPatternWrapper Component

The main component for applying patterns:

```tsx
import { BrandPatternWrapper } from '@/components/BrandPatternWrapper'

// Basic usage
<BrandPatternWrapper pattern="waves">
  <YourContent />
</BrandPatternWrapper>

// With overlay
<BrandPatternWrapper pattern="grid" overlay>
  <YourContent />
</BrandPatternWrapper>

// With animation
<BrandPatternWrapper pattern="constellation" animate>
  <YourContent />
</BrandPatternWrapper>
```

#### Props

- `pattern`: Pattern type (waves, mesh, constellation, grid, gradient, etc.)
- `overlay`: Boolean - applies pattern as overlay (::before pseudo-element)
- `animate`: Boolean - adds floating animation
- `className`: Additional CSS classes

### Pre-configured Variants

Quick-use variants for common scenarios:

```tsx
import { PatternVariants } from '@/components/BrandPatternWrapper'

// Hero section
<PatternVariants.Hero>
  <h1>Welcome</h1>
</PatternVariants.Hero>

// Card with pattern
<PatternVariants.Card>
  <CardContent />
</PatternVariants.Card>

// Page section
<PatternVariants.Section>
  <SectionContent />
</PatternVariants.Section>

// Feature card with animation
<PatternVariants.Feature>
  <FeatureContent />
</PatternVariants.Feature>

// Full background
<PatternVariants.Background>
  <AppContent />
</PatternVariants.Background>
```

## Tailwind Utility Classes

### Direct Pattern Classes

```css
/* Background patterns */
.bg-pattern-waves
.bg-pattern-mesh
.bg-pattern-constellation
.bg-pattern-grid
.bg-pattern-gradient
.bg-pattern-gradient-subtle

/* Pattern overlays */
.pattern-overlay-waves
.pattern-overlay-mesh
.pattern-overlay-constellation
.pattern-overlay-grid
```

### Animated Backgrounds

```css
/* Animated gradient */
.bg-animated-gradient

/* Shimmer effect */
.bg-shimmer
```

### Special Effects

```css
/* Glow effects */
.stellar-glow          /* Static glow */
.stellar-glow-hover    /* Glow on hover */

/* Mesh gradient */
.bg-mesh-gradient

/* Subtle texture */
.bg-texture-subtle

/* Floating animation */
.animate-float
```

## Usage Examples

### Hero Section

```tsx
<BrandPatternWrapper pattern="waves" className="min-h-[400px] flex items-center justify-center">
  <div className="text-center text-white">
    <h1 className="text-5xl font-bold">Soroban Ajo</h1>
    <p className="text-xl">Decentralized Rotational Savings</p>
  </div>
</BrandPatternWrapper>
```

### Feature Card

```tsx
<div className="bg-white rounded-xl p-6 pattern-overlay-constellation stellar-glow-hover">
  <h3 className="text-xl font-bold mb-2">Feature Title</h3>
  <p className="text-gray-600">Feature description</p>
</div>
```

### Page Background

```tsx
<div className="min-h-screen bg-mesh-gradient">
  <YourPageContent />
</div>
```

### Animated Section

```tsx
<div className="bg-animated-gradient py-16">
  <div className="max-w-7xl mx-auto">
    <SectionContent />
  </div>
</div>
```

## Customization

### Tailwind Config

Patterns are configured in `frontend/tailwind.config.js`:

```javascript
backgroundImage: {
  'stellar-waves': "url('/patterns/stellar-waves.svg')",
  'stellar-mesh': "url('/patterns/stellar-mesh.svg')",
  'stellar-constellation': "url('/patterns/stellar-constellation.svg')",
  'stellar-grid': "url('/patterns/stellar-grid.svg')",
  // ... more patterns
}
```

### Custom Animations

Add custom animations in `tailwind.config.js`:

```javascript
animation: {
  'float': 'float 6s ease-in-out infinite',
  'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'shimmer': 'shimmer 2s linear infinite',
}
```

## Performance Considerations

1. **SVG Patterns**: Optimized file sizes, use sparingly on mobile
2. **Animated Gradients**: Use `will-change` for better performance
3. **Overlays**: Prefer overlays over full backgrounds when possible
4. **Opacity**: Lower opacity patterns have better performance

## Accessibility

- All patterns maintain sufficient contrast ratios
- Patterns don't interfere with text readability
- Animations respect `prefers-reduced-motion`
- Patterns are decorative and don't convey essential information

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- SVG patterns: IE11+ (with fallbacks)
- CSS gradients: All modern browsers
- Animations: All modern browsers with fallbacks

## Testing

View all patterns in the PatternShowcase component:

```tsx
import { PatternShowcase } from '@/components/PatternShowcase'

// In your app
<PatternShowcase />
```

## Best Practices

1. Use subtle patterns for backgrounds
2. Reserve animated patterns for hero sections
3. Combine patterns with overlays for depth
4. Test contrast ratios with content
5. Use pre-configured variants for consistency
6. Avoid pattern overload - less is more
7. Consider mobile performance

## Color Palette

All patterns use the Stellar brand colors:

- Primary Blue: `#3B82F6`
- Secondary Purple: `#8B5CF6`
- Accent Cyan: `#06B6D4`

## Future Enhancements

- [ ] Add more constellation variations
- [ ] Create seasonal pattern themes
- [ ] Add particle effect patterns
- [ ] Implement WebGL patterns for advanced effects
- [ ] Add pattern customization UI

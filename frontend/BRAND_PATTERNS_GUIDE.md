# Brand Patterns & Background Textures Guide

This guide documents all available brand patterns and background textures for the Soroban Ajo application.

## Overview

The brand pattern system provides a cohesive visual identity using Stellar-inspired designs with the following color palette:
- Primary: `#3B82F6` (Blue)
- Secondary: `#8B5CF6` (Purple)
- Accent: `#06B6D4` (Cyan)

## SVG Patterns

### 1. Stellar Mesh (`pattern-mesh`)
Soft gradient circles creating a mesh-like effect.

```tsx
<div className="pattern-mesh">
  {/* Your content */}
</div>
```

**Use cases:** Hero sections, landing pages, feature highlights

### 2. Constellation (`pattern-constellation`)
Connected stars pattern representing the Stellar network.

```tsx
<div className="pattern-constellation bg-white">
  {/* Your content */}
</div>
```

**Use cases:** About sections, network visualizations, backgrounds

### 3. Dot Grid (`pattern-grid`)
Subtle repeating dot pattern for minimal texture.

```tsx
<div className="pattern-grid bg-white">
  {/* Your content */}
</div>
```

**Use cases:** Form backgrounds, card overlays, subtle textures

### 4. Hexagon Grid (`pattern-hexagon`)
Geometric hexagon pattern for modern tech aesthetic.

```tsx
<div className="pattern-hexagon bg-white">
  {/* Your content */}
</div>
```

**Use cases:** Technical sections, blockchain visualizations

### 5. Wave Pattern (`pattern-waves`)
Flowing wave layers for dynamic sections.

```tsx
<div className="pattern-waves bg-white">
  {/* Your content */}
</div>
```

**Use cases:** Footer sections, dividers, transitions

## CSS Gradients

### Linear Gradients

#### Stellar Gradient (`gradient-stellar`)
Bold brand colors for high-impact sections.

```tsx
<div className="gradient-stellar">
  {/* Your content */}
</div>
```

#### Soft Gradient (`gradient-stellar-soft`)
Subtle brand colors for backgrounds.

```tsx
<div className="gradient-stellar-soft">
  {/* Your content */}
</div>
```

### Radial Gradients

#### Radial Stellar (`gradient-radial-stellar`)
Center-focused glow effect.

```tsx
<div className="gradient-radial-stellar bg-white">
  {/* Your content */}
</div>
```

### Mesh Gradients

#### Mesh Gradient 1 (`gradient-mesh-1`)
Corner-based radial blend.

```tsx
<div className="gradient-mesh-1 bg-white">
  {/* Your content */}
</div>
```

#### Mesh Gradient 2 (`gradient-mesh-2`)
Multi-point radial gradient.

```tsx
<div className="gradient-mesh-2 bg-white">
  {/* Your content */}
</div>
```

## Animated Backgrounds

### Animated Gradient (`bg-animated-gradient`)
Shifting color gradient animation (15s cycle).

```tsx
<div className="bg-animated-gradient">
  {/* Your content */}
</div>
```

**Use cases:** Hero sections, call-to-action areas

### Pulse Glow (`bg-animated-pulse`)
Breathing opacity effect (3s cycle).

```tsx
<div className="gradient-stellar-soft bg-animated-pulse">
  {/* Your content */}
</div>
```

**Use cases:** Loading states, attention-grabbing elements

### Float Animation (`bg-float`)
Subtle vertical floating motion (6s cycle).

```tsx
<div className="gradient-mesh-1 bg-float">
  {/* Your content */}
</div>
```

**Use cases:** Cards, interactive elements

### Hero Stellar (`hero-stellar`)
Complete hero section with rotating background animation.

```tsx
<div className="hero-stellar">
  {/* Your hero content */}
</div>
```

**Use cases:** Landing page heroes, feature showcases

## Combined Patterns

### Pattern Overlay Mesh (`pattern-overlay-mesh`)
Mesh pattern with gradient overlay.

```tsx
<div className="pattern-overlay-mesh">
  {/* Your content */}
</div>
```

### Pattern Overlay Grid (`pattern-overlay-grid`)
Grid pattern on white background.

```tsx
<div className="pattern-overlay-grid">
  {/* Your content */}
</div>
```

### Pattern Overlay Constellation (`pattern-overlay-constellation`)
Constellation pattern with background color.

```tsx
<div className="pattern-overlay-constellation">
  {/* Your content */}
</div>
```

### Card Pattern (`card-pattern`)
Card with subtle grid overlay using pseudo-element.

```tsx
<div className="card-pattern bg-white rounded-lg p-6">
  {/* Your card content */}
</div>
```

## Tailwind Configuration

All patterns are available as Tailwind utilities:

```javascript
// Background images
bg-pattern-mesh
bg-pattern-constellation
bg-pattern-grid
bg-pattern-hexagon
bg-pattern-waves
bg-gradient-stellar
bg-gradient-stellar-soft
bg-gradient-radial-stellar

// Animations
animate-gradient-shift
animate-pulse-glow
animate-float
animate-rotate-slow
```

## Best Practices

### Performance
- Use SVG patterns sparingly on mobile devices
- Prefer CSS gradients for better performance
- Limit animated backgrounds to hero sections

### Accessibility
- Ensure sufficient contrast for text over patterns
- Use `backdrop-blur` for overlays when needed
- Test with reduced motion preferences

### Design Guidelines
- Use subtle patterns for backgrounds
- Reserve bold gradients for hero sections
- Combine patterns with transparency for depth
- Match pattern intensity to content importance

## Examples

### Hero Section
```tsx
<section className="hero-stellar min-h-screen flex items-center justify-center">
  <div className="relative z-10 text-center">
    <h1 className="text-5xl font-bold text-gray-900">Welcome to Soroban Ajo</h1>
    <p className="text-xl text-gray-700 mt-4">Decentralized Rotational Savings</p>
  </div>
</section>
```

### Feature Card
```tsx
<div className="card-pattern bg-white rounded-lg p-6 shadow-lg">
  <h3 className="text-xl font-semibold mb-2">Feature Title</h3>
  <p className="text-gray-600">Feature description...</p>
</div>
```

### Dashboard Background
```tsx
<div className="min-h-screen pattern-overlay-grid">
  {/* Dashboard content */}
</div>
```

### Animated CTA
```tsx
<button className="bg-animated-gradient text-white px-8 py-4 rounded-lg font-semibold">
  Get Started
</button>
```

## File Locations

- SVG Patterns: `frontend/public/patterns/`
- CSS Utilities: `frontend/src/styles/index.css`
- Tailwind Config: `frontend/tailwind.config.js`
- Showcase Component: `frontend/src/components/PatternShowcase.tsx`

## Customization

To create custom patterns:

1. Add SVG files to `frontend/public/patterns/`
2. Define CSS classes in `frontend/src/styles/index.css`
3. Add Tailwind utilities in `frontend/tailwind.config.js`
4. Follow the naming convention: `pattern-{name}` or `gradient-{name}`

## Browser Support

All patterns are supported in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

For older browsers, patterns gracefully degrade to solid colors.

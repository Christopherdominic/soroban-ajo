# Brand Patterns - Quick Reference

## 🎨 Quick Usage Guide

### Import the Component
```tsx
import { BrandPatternWrapper, PatternVariants } from '@/components/BrandPatternWrapper'
```

### Basic Patterns

```tsx
// Waves pattern
<BrandPatternWrapper pattern="waves">
  <YourContent />
</BrandPatternWrapper>

// Mesh pattern
<BrandPatternWrapper pattern="mesh">
  <YourContent />
</BrandPatternWrapper>

// Constellation pattern
<BrandPatternWrapper pattern="constellation">
  <YourContent />
</BrandPatternWrapper>

// Grid pattern
<BrandPatternWrapper pattern="grid">
  <YourContent />
</BrandPatternWrapper>
```

### Pattern Overlays

```tsx
// Pattern as overlay (::before pseudo-element)
<BrandPatternWrapper pattern="waves" overlay>
  <YourContent />
</BrandPatternWrapper>
```

### Animated Patterns

```tsx
// Add floating animation
<BrandPatternWrapper pattern="constellation" animate>
  <YourContent />
</BrandPatternWrapper>
```

### Pre-configured Variants

```tsx
// Hero section
<PatternVariants.Hero>
  <h1>Welcome</h1>
</PatternVariants.Hero>

// Card
<PatternVariants.Card>
  <CardContent />
</PatternVariants.Card>

// Section
<PatternVariants.Section>
  <SectionContent />
</PatternVariants.Section>

// Feature (with animation)
<PatternVariants.Feature>
  <FeatureContent />
</PatternVariants.Feature>

// Full background
<PatternVariants.Background>
  <AppContent />
</PatternVariants.Background>
```

## 🎯 Tailwind Utility Classes

### Background Patterns
```html
<div class="bg-pattern-waves">...</div>
<div class="bg-pattern-mesh">...</div>
<div class="bg-pattern-constellation">...</div>
<div class="bg-pattern-grid">...</div>
<div class="bg-pattern-gradient">...</div>
<div class="bg-pattern-gradient-subtle">...</div>
```

### Pattern Overlays
```html
<div class="pattern-overlay-waves">...</div>
<div class="pattern-overlay-mesh">...</div>
<div class="pattern-overlay-constellation">...</div>
<div class="pattern-overlay-grid">...</div>
```

### Animated Backgrounds
```html
<div class="bg-animated-gradient">...</div>
<div class="bg-mesh-gradient">...</div>
<div class="bg-shimmer">...</div>
```

### Special Effects
```html
<div class="stellar-glow">Static glow effect</div>
<div class="stellar-glow-hover">Glow on hover</div>
<div class="bg-texture-subtle">Subtle texture</div>
<div class="animate-float">Floating animation</div>
```

## 📁 File Locations

- **SVG Patterns**: `frontend/public/patterns/*.svg`
- **Component**: `frontend/src/components/BrandPatternWrapper.tsx`
- **Showcase**: `frontend/src/components/PatternShowcase.tsx`
- **Styles**: `frontend/src/styles/index.css`
- **Config**: `frontend/tailwind.config.js`
- **Docs**: `frontend/src/docs/BRAND_PATTERNS.md`

## 🎨 Available Patterns

| Pattern | Best For | Style |
|---------|----------|-------|
| `waves` | Hero sections, headers | Smooth wave gradients |
| `mesh` | Full backgrounds | Mesh gradient blend |
| `constellation` | Dark backgrounds, features | Connected stars |
| `grid` | Cards, subtle textures | Dot grid |
| `gradient` | Bold sections | Linear gradient |
| `gradient-subtle` | Subtle backgrounds | Low-opacity gradient |
| `animated-gradient` | Hero sections | Animated color shift |
| `mesh-gradient` | Page backgrounds | Radial corner glows |

## 🚀 Common Use Cases

### Hero Section
```tsx
<PatternVariants.Hero className="py-20">
  <div className="text-center text-white">
    <h1 className="text-5xl font-bold">Soroban Ajo</h1>
    <p className="text-xl mt-4">Decentralized Rotational Savings</p>
  </div>
</PatternVariants.Hero>
```

### Feature Card
```tsx
<div className="bg-white rounded-xl p-6 pattern-overlay-grid stellar-glow-hover">
  <h3 className="text-xl font-bold mb-2">Feature Title</h3>
  <p className="text-gray-600">Description</p>
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
<section className="bg-animated-gradient py-16">
  <div className="max-w-7xl mx-auto px-4">
    <SectionContent />
  </div>
</section>
```

## 🎨 Brand Colors

- Primary Blue: `#3B82F6`
- Secondary Purple: `#8B5CF6`
- Accent Cyan: `#06B6D4`

## 📊 View Patterns Demo

Navigate to the "Patterns" tab in the app to see all patterns in action.

## 💡 Tips

1. Use subtle patterns for backgrounds
2. Reserve animated patterns for hero sections
3. Combine patterns with overlays for depth
4. Test contrast ratios with content
5. Consider mobile performance
6. Use pre-configured variants for consistency

## 🔗 Related Documentation

- Full documentation: `frontend/src/docs/BRAND_PATTERNS.md`
- Pattern files: `frontend/public/patterns/README.md`

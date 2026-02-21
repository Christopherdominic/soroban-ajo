# Brand Patterns Quick Reference

## 🎨 Quick Pattern Selection Guide

### For Hero Sections
```tsx
className="hero-stellar"              // Animated rotating background
className="pattern-mesh"              // Soft gradient circles
className="bg-animated-gradient"      // Shifting colors
```

### For Backgrounds
```tsx
className="pattern-overlay-grid"     // Subtle dot grid
className="gradient-stellar-soft"    // Light brand gradient
className="gradient-mesh-1"          // Corner radial blend
```

### For Cards
```tsx
className="card-pattern"             // Grid overlay
className="gradient-mesh-2"          // Multi-point radial
className="pattern-overlay-mesh"     // Mesh + gradient
```

### For Sections
```tsx
className="pattern-constellation"    // Connected stars
className="pattern-waves"            // Wave layers
className="pattern-hexagon"          // Geometric pattern
```

## 🚀 Animation Classes

```tsx
className="bg-animated-gradient"     // 15s color shift
className="bg-animated-pulse"        // 3s breathing
className="bg-float"                 // 6s floating
className="animate-rotate-slow"      // 30s rotation
```

## 💡 Common Combinations

### Subtle Background
```tsx
<div className="pattern-overlay-grid bg-white">
```

### Hero with Blur
```tsx
<div className="hero-stellar">
  <div className="backdrop-blur-sm bg-white/80 p-8">
    {/* Content */}
  </div>
</div>
```

### Animated Card
```tsx
<div className="gradient-mesh-1 bg-float rounded-lg p-6">
```

### Patterned Section
```tsx
<section className="pattern-constellation bg-gray-50 py-16">
```

## 📁 Files

- **SVG Patterns:** `/frontend/public/patterns/`
- **CSS Classes:** `/frontend/src/styles/index.css`
- **Tailwind Config:** `/frontend/tailwind.config.js`
- **Demo Component:** `/frontend/src/components/PatternShowcase.tsx`
- **Full Guide:** `/frontend/BRAND_PATTERNS_GUIDE.md`

## 🎯 Tailwind Utilities

```css
/* Backgrounds */
bg-pattern-mesh
bg-pattern-constellation
bg-pattern-grid
bg-pattern-hexagon
bg-pattern-waves
bg-gradient-stellar
bg-gradient-stellar-soft
bg-gradient-radial-stellar

/* Animations */
animate-gradient-shift
animate-pulse-glow
animate-float
animate-rotate-slow
```

## ⚡ Performance Tips

1. Use CSS gradients over SVG patterns when possible
2. Limit animations to hero sections
3. Test on mobile devices
4. Use `backdrop-blur` sparingly
5. Prefer `pattern-overlay-*` classes for better performance

## 🎨 Color Variables

```css
--pattern-primary: #3B82F6    /* Blue */
--pattern-secondary: #8B5CF6  /* Purple */
--pattern-accent: #06B6D4     /* Cyan */
--pattern-opacity: 0.05       /* Default opacity */
```

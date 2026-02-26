# Brand Patterns & Background Textures

## Overview
Visual brand patterns have been implemented to enhance the design with Stellar-themed backgrounds and textures.

## Files Created

### SVG Pattern Assets (`frontend/public/patterns/`)
1. **grid.svg** - Subtle grid pattern with primary color
2. **dots.svg** - Dot pattern for backgrounds
3. **waves.svg** - Wave gradient pattern matching Stellar brand
4. **mesh.svg** - Mesh gradient with radial glows

## CSS Classes Added (`frontend/src/styles/globals.css`)

### Pattern Classes
- `.pattern-grid` - Grid background pattern
- `.pattern-dots` - Dot background pattern
- `.pattern-waves` - Wave pattern (bottom positioned)
- `.pattern-mesh` - Mesh gradient pattern

### Gradient Classes
- `.gradient-stellar` - Full Stellar brand gradient (primary → accent → purple)
- `.gradient-stellar-subtle` - Subtle version with low opacity
- `.gradient-radial-glow` - Radial glow effect
- `.gradient-mesh` - Multi-point radial gradient mesh

### Animated Backgrounds
- `.gradient-animated` - Animated gradient shift (15s loop)
- `.pattern-float` - Floating animation for patterns (6s loop)

### Pattern Overlay
- `.pattern-overlay` - Wrapper that adds grid pattern overlay with proper z-index management

## Tailwind Config Updates (`frontend/tailwind.config.js`)

Added background image utilities:
```javascript
'pattern-grid': "url('/patterns/grid.svg')"
'pattern-dots': "url('/patterns/dots.svg')"
'pattern-waves': "url('/patterns/waves.svg')"
'pattern-mesh': "url('/patterns/mesh.svg')"
'gradient-stellar': 'linear-gradient(...)'
'gradient-stellar-subtle': 'linear-gradient(...)'
'gradient-radial-glow': 'radial-gradient(...)'
'gradient-mesh': 'radial-gradient(...)'
```

## Layout Integration (`frontend/src/app/layout.tsx`)

The root layout now includes:
```tsx
<div className="pattern-overlay gradient-mesh min-h-screen">
  <Providers>
    <AppLayout>{children}</AppLayout>
  </Providers>
</div>
```

## Usage Examples

### Basic Pattern Background
```tsx
<div className="pattern-grid">
  {/* Content */}
</div>
```

### Gradient Background
```tsx
<div className="gradient-stellar-subtle">
  {/* Content */}
</div>
```

### Animated Pattern
```tsx
<div className="gradient-animated pattern-float">
  {/* Content */}
</div>
```

### Pattern Overlay (Recommended)
```tsx
<div className="pattern-overlay">
  {/* Grid pattern will appear as overlay */}
  {/* Content maintains proper z-index */}
</div>
```

## Color Scheme

All patterns use the Stellar brand colors:
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Purple)
- Accent: `#a855f7` (Purple-accent)

Opacity levels are kept subtle (0.02-0.15) to avoid overwhelming content.

## Browser Compatibility

- All patterns use standard CSS and SVG
- Animations use CSS keyframes (widely supported)
- Gradients are CSS3 standard
- No JavaScript required

## Performance Notes

- SVG patterns are lightweight (<1KB each)
- CSS animations use GPU-accelerated transforms
- Patterns are cached by the browser
- No impact on bundle size

## Next Steps

To pass CI/lint tests, ensure:
1. Node version >= 18.0.0 (currently using v12.22.9)
2. Run `npm install` successfully
3. Run `npm run lint` to verify no linting errors
4. Run `npm run build` to ensure production build works

## Customization

To modify patterns:
1. Edit SVG files in `frontend/public/patterns/`
2. Adjust CSS classes in `frontend/src/styles/globals.css`
3. Update Tailwind config for utility classes
4. Modify opacity/colors to match brand guidelines

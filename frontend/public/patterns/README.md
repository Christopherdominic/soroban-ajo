# Stellar Brand Patterns

This directory contains SVG pattern files used throughout the Soroban Ajo application.

## Available Patterns

### stellar-mesh.svg
Soft gradient circles creating a mesh-like effect. Perfect for hero sections and feature highlights.

### stellar-constellation.svg
Connected stars pattern representing the Stellar network. Great for backgrounds and network visualizations.

### stellar-grid.svg
Subtle repeating dot pattern for minimal texture. Ideal for form backgrounds and card overlays.

### stellar-hexagon.svg
Geometric hexagon pattern for modern tech aesthetic. Works well in technical sections.

### stellar-waves.svg
Flowing wave layers for dynamic sections. Perfect for footer sections and dividers.

## Usage

These SVG files are referenced in CSS classes defined in `frontend/src/styles/index.css`.

### Direct Usage
```html
<div style="background-image: url('/patterns/stellar-mesh.svg')">
  <!-- Content -->
</div>
```

### CSS Class Usage
```tsx
<div className="pattern-mesh">
  <!-- Content -->
</div>
```

### Tailwind Usage
```tsx
<div className="bg-pattern-mesh">
  <!-- Content -->
</div>
```

## Customization

To customize patterns:
1. Edit the SVG files directly
2. Adjust colors using the `stop-color` attributes in gradients
3. Modify opacity using the `stop-opacity` or `opacity` attributes
4. Change pattern density by adjusting coordinates and sizes

## Color Palette

All patterns use the Stellar brand colors:
- Primary: `#3B82F6` (Blue)
- Secondary: `#8B5CF6` (Purple)
- Accent: `#06B6D4` (Cyan)

## Performance

These SVG files are optimized for web use:
- Minimal file size
- Efficient rendering
- Scalable without quality loss
- GPU-accelerated when possible

## Browser Support

All patterns work in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Documentation

For complete documentation, see:
- `/frontend/BRAND_PATTERNS_GUIDE.md` - Full guide
- `/frontend/PATTERN_QUICK_REFERENCE.md` - Quick reference
- `/frontend/src/components/PatternShowcase.tsx` - Interactive demo

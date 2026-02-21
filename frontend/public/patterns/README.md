# Stellar Brand Patterns

This directory contains SVG pattern files used throughout the Soroban Ajo application.

## Files

- `stellar-waves.svg` - Wave pattern with gradient fills
- `stellar-mesh.svg` - Mesh gradient pattern
- `stellar-constellation.svg` - Connected star constellation pattern
- `stellar-grid.svg` - Subtle dot grid pattern

## Usage

These patterns are referenced in:
- `frontend/tailwind.config.js` - Tailwind background image configuration
- `frontend/src/styles/index.css` - CSS utility classes
- `frontend/src/components/BrandPatternWrapper.tsx` - React component wrapper

## Colors

All patterns use the Stellar brand color palette:
- Primary Blue: #3B82F6
- Secondary Purple: #8B5CF6
- Accent Cyan: #06B6D4

## Optimization

- All SVG files are optimized for web delivery
- Patterns use gradients and simple shapes for small file sizes
- Opacity values are tuned for subtle, non-intrusive backgrounds

## Customization

To create new patterns:
1. Design in SVG format using brand colors
2. Optimize with SVGO or similar tool
3. Add to this directory
4. Register in `tailwind.config.js`
5. Create utility classes in `index.css`
6. Update `BrandPatternWrapper.tsx` component

## Documentation

See `frontend/src/docs/BRAND_PATTERNS.md` for complete usage documentation.

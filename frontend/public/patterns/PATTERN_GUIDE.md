# Visual Pattern Guide

## Pattern Selection Guide

### 🌊 Stellar Waves
**File**: `stellar-waves.svg`  
**Best For**: Hero sections, page headers, landing pages  
**Visual Style**: Smooth flowing waves with blue-to-purple-to-cyan gradient  
**Opacity**: 5-10%  
**Animation**: Works well with floating animation  

**Use When**:
- Creating hero sections
- Need dynamic, flowing background
- Want to convey movement and fluidity

---

### 🕸️ Stellar Mesh
**File**: `stellar-mesh.svg`  
**Best For**: Full-page backgrounds, section dividers  
**Visual Style**: Mesh gradient with multiply blend mode  
**Opacity**: 15%  
**Animation**: Static (subtle is better)  

**Use When**:
- Need full-page background
- Want subtle, professional look
- Creating section backgrounds

---

### ⭐ Stellar Constellation
**File**: `stellar-constellation.svg`  
**Best For**: Dark backgrounds, feature cards, tech sections  
**Visual Style**: Connected stars with lines, space theme  
**Opacity**: 20-40%  
**Animation**: Excellent with floating animation  

**Use When**:
- Dark mode or dark sections
- Tech/innovation features
- Want to emphasize connectivity
- Space/stellar theme is prominent

---

### 📐 Stellar Grid
**File**: `stellar-grid.svg`  
**Best For**: Card backgrounds, subtle textures, form backgrounds  
**Visual Style**: Subtle dot grid pattern  
**Opacity**: 10-50%  
**Animation**: Static recommended  

**Use When**:
- Need subtle texture
- Card backgrounds
- Form sections
- Want structure without distraction

---

## CSS Gradient Patterns

### 🎨 Gradient Stellar
**Class**: `bg-gradient-stellar` or `bg-pattern-gradient`  
**Style**: Linear gradient (135deg) Blue → Purple → Cyan  
**Best For**: Bold sections, CTAs, headers  

### 🎨 Gradient Stellar Subtle
**Class**: `bg-gradient-stellar-subtle` or `bg-pattern-gradient-subtle`  
**Style**: Same as above but 5% opacity  
**Best For**: Subtle backgrounds, overlays  

### 🎨 Animated Gradient
**Class**: `bg-animated-gradient`  
**Style**: Shifting gradient (15s loop)  
**Best For**: Hero sections, attention-grabbing areas  
**Performance**: Moderate (use sparingly)  

### 🎨 Mesh Gradient
**Class**: `bg-mesh-gradient`  
**Style**: Radial gradients from corners  
**Best For**: Page backgrounds, large sections  

---

## Pattern Combinations

### Hero Section (Recommended)
```tsx
<PatternVariants.Hero>
  // Waves pattern + floating animation
</PatternVariants.Hero>
```

### Feature Card (Recommended)
```tsx
<PatternVariants.Feature>
  // Constellation overlay + floating animation
</PatternVariants.Feature>
```

### Page Background (Recommended)
```tsx
<div className="bg-mesh-gradient">
  // Subtle mesh gradient
</div>
```

### Card Background (Recommended)
```tsx
<div className="pattern-overlay-grid bg-white">
  // Grid overlay on white card
</div>
```

---

## Pattern Intensity Guide

### Subtle (5-10% opacity)
- Use for: Main backgrounds, large areas
- Patterns: Grid, Mesh, Gradient Subtle
- Goal: Don't distract from content

### Medium (15-30% opacity)
- Use for: Section backgrounds, cards
- Patterns: Waves, Mesh, Constellation
- Goal: Add visual interest without overwhelming

### Bold (40-100% opacity)
- Use for: Hero sections, CTAs, accents
- Patterns: Gradient, Animated Gradient
- Goal: Draw attention, create impact

---

## Mobile Considerations

### Recommended for Mobile
- ✅ Grid pattern (lightweight)
- ✅ Gradient Subtle
- ✅ Mesh Gradient (CSS-based)

### Use Sparingly on Mobile
- ⚠️ Animated Gradient (performance)
- ⚠️ Constellation (complex SVG)
- ⚠️ Waves (large SVG)

### Avoid on Mobile
- ❌ Multiple animated patterns
- ❌ High-opacity complex SVGs
- ❌ Nested pattern overlays

---

## Accessibility Checklist

- [ ] Pattern doesn't reduce text contrast below 4.5:1
- [ ] Pattern is decorative only (no essential info)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Pattern doesn't cause visual strain
- [ ] Content is readable on all pattern backgrounds

---

## Quick Decision Tree

**Need bold, attention-grabbing?**
→ Use Animated Gradient or Gradient Stellar

**Need subtle, professional?**
→ Use Grid or Mesh Gradient

**Need dynamic, flowing?**
→ Use Waves pattern

**Need tech/innovation theme?**
→ Use Constellation pattern

**Need card background?**
→ Use Grid overlay

**Need page background?**
→ Use Mesh Gradient

**Need hero section?**
→ Use Waves or Animated Gradient

---

## Performance Tips

1. **Limit animations**: Max 1-2 animated patterns per page
2. **Use CSS over SVG**: When possible, prefer CSS gradients
3. **Optimize opacity**: Lower opacity = better performance
4. **Lazy load**: Consider lazy loading for below-fold patterns
5. **Test on mobile**: Always test pattern performance on mobile devices

---

## Color Customization

All patterns use these CSS variables (can be customized):

```css
--pattern-primary: #3B82F6;    /* Blue */
--pattern-secondary: #8B5CF6;  /* Purple */
--pattern-accent: #06B6D4;     /* Cyan */
```

To customize, override in your CSS:

```css
:root {
  --pattern-primary: #your-color;
  --pattern-secondary: #your-color;
  --pattern-accent: #your-color;
}
```

---

## Testing Checklist

Before deploying patterns:

- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices
- [ ] Verify text contrast ratios
- [ ] Check animation performance
- [ ] Test with reduced motion enabled
- [ ] Verify pattern loads correctly
- [ ] Check file sizes
- [ ] Test dark mode compatibility

---

## Support

For questions or issues:
- See: `frontend/src/docs/BRAND_PATTERNS.md`
- Quick Reference: `frontend/BRAND_PATTERNS_QUICK_REFERENCE.md`
- View Demo: Navigate to "Patterns" tab in app

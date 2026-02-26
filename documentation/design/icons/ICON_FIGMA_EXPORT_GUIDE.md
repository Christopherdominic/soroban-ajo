# Icon Figma Export Guide

## Overview

This guide provides step-by-step instructions for exporting icons from Figma to SVG format compatible with the Soroban Ajo icon system.

---

## Figma Setup

### 1. Create Icon Frame

1. Create a new frame: `24x24` pixels
2. Name it with the icon name: `action-add`, `status-active`, etc.
3. Set background to transparent
4. Add icon content to the frame

### 2. Icon Design Guidelines

#### Grid & Guides

- Enable pixel grid (View → Show Pixel Grid)
- Use 2px stroke weight for all paths
- Align to 1px grid for crisp edges

#### Stroke Settings

- **Stroke Weight**: 2px
- **Stroke Cap**: Round
- **Stroke Join**: Round
- **Fill**: None (transparent)
- **Color**: Black (will be converted to currentColor)

#### Safe Zone

- Keep content within 20×20px safe zone
- Leave 2px padding from edges
- Avoid placing content on exact edges

### 3. Component Setup

1. Right-click frame → Create component
2. Set component name: `icon/action-add`
3. Add description: "Add/create action icon"
4. Tag with category: `icon`, `action`

---

## Export Process

### Method 1: Individual Icon Export (Recommended)

#### Step 1: Select Icon Frame

1. Open Figma file
2. Select the icon frame (24×24)
3. Ensure only the icon is selected

#### Step 2: Export Settings

1. Right-click → Export
2. Click "+" to add export
3. Configure export settings:
   - **Format**: SVG
   - **Suffix**: (leave empty)
   - **Scale**: 1x

#### Step 3: SVG Export Options

1. Click the export settings gear icon
2. Configure:
   - **Precision**: 2 decimal places
   - **Rounding**: Enabled
   - **Optimization**: Enabled
   - **Include namespaces**: Disabled
   - **Minify**: Disabled (for readability)

#### Step 4: Export

1. Click "Export [icon-name]"
2. Save to local folder
3. Verify SVG file

### Method 2: Batch Export

#### Step 1: Select Multiple Icons

1. Select all icon frames (Cmd/Ctrl + Click)
2. Ensure all are 24×24px

#### Step 2: Configure Batch Export

1. Right-click → Export
2. Add export with same settings as Method 1
3. Click "Export all"

#### Step 3: Organize Files

1. Create folder: `icons/`
2. Move all exported SVGs to folder
3. Verify naming convention

---

## SVG Cleanup

### Automated Cleanup (Recommended)

Use SVGO (SVG Optimizer):

```bash
# Install SVGO
npm install -g svgo

# Optimize single file
svgo icon-add.svg

# Optimize folder
svgo icons/ -o icons-optimized/
```

### Manual Cleanup

If automated cleanup isn't available:

1. Open SVG in text editor
2. Remove unnecessary attributes:
   - Remove `id` attributes
   - Remove `data-name` attributes
   - Remove `xmlns` (if not needed)
3. Verify structure:
   - `viewBox="0 0 24 24"`
   - `fill="none"`
   - `stroke="currentColor"`
   - `strokeWidth="2"`
   - `strokeLinecap="round"`
   - `strokeLinejoin="round"`

### Example SVG Structure

```xml
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <line x1="12" y1="5" x2="12" y2="19" />
  <line x1="5" y1="12" x2="19" y2="12" />
</svg>
```

---

## SVG Validation

### Checklist

- [ ] Viewbox is `0 0 24 24`
- [ ] Fill is `none`
- [ ] Stroke is `currentColor`
- [ ] Stroke width is `2`
- [ ] Stroke linecap is `round`
- [ ] Stroke linejoin is `round`
- [ ] No hardcoded colors
- [ ] No unnecessary attributes
- [ ] Coordinates are clean (no excessive decimals)
- [ ] Paths are optimized

### Common Issues

#### Issue: Hardcoded Colors

**Problem**:
```xml
<circle cx="12" cy="12" r="10" fill="black" stroke="black" />
```

**Solution**:
```xml
<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" />
```

#### Issue: Excessive Decimals

**Problem**:
```xml
<line x1="12.5432" y1="5.1234" x2="12.5432" y2="19.8765" />
```

**Solution**:
```xml
<line x1="12.54" y1="5.12" x2="12.54" y2="19.88" />
```

#### Issue: Unnecessary Attributes

**Problem**:
```xml
<svg id="icon-1" data-name="icon-add" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
```

**Solution**:
```xml
<svg viewBox="0 0 24 24">
```

---

## Integration into Icon System

### Step 1: Add to IconSprite

1. Open `src/components/IconSprite.tsx`
2. Add new symbol in appropriate category:

```tsx
<symbol id="icon-action-add" viewBox="0 0 24 24">
  <line x1="12" y1="5" x2="12" y2="19" />
  <line x1="5" y1="12" x2="19" y2="12" />
</symbol>
```

### Step 2: Add to Definitions

1. Open `src/icons/iconDefinitions.ts`
2. Add icon definition:

```ts
'action-add': {
  category: ICON_CATEGORIES.ACTION,
  description: 'Plus icon for adding items',
  useCases: ['Create group', 'Add member', 'New transaction'],
},
```

### Step 3: Test

1. Run development server: `npm run dev`
2. Use icon in component:

```tsx
<Icon name="action-add" size={24} />
```

3. Verify:
   - Icon displays correctly
   - All sizes work (16, 20, 24, 32, 48px)
   - All variants work (default, active, disabled, etc.)
   - Accessibility works (ariaLabel, ariaHidden)

### Step 4: Update Documentation

1. Add icon to `ICON_STYLE_GUIDE.md`
2. Add icon to `ICON_GRID_SPECIFICATIONS.md`
3. Add usage example to `ICON_USAGE_GUIDELINES.md`

---

## Batch Processing Script

### Python Script for SVG Cleanup

```python
#!/usr/bin/env python3
import os
import re
from pathlib import Path

def clean_svg(svg_path):
    """Clean SVG file for icon system"""
    with open(svg_path, 'r') as f:
        content = f.read()
    
    # Remove unnecessary attributes
    content = re.sub(r' id="[^"]*"', '', content)
    content = re.sub(r' data-name="[^"]*"', '', content)
    content = re.sub(r' xmlns="[^"]*"', '', content)
    
    # Ensure proper SVG structure
    if 'viewBox="0 0 24 24"' not in content:
        content = content.replace('viewBox=', 'viewBox="0 0 24 24" viewBox=')
    
    if 'fill="none"' not in content:
        content = content.replace('<svg', '<svg fill="none"')
    
    if 'stroke="currentColor"' not in content:
        content = content.replace('<svg', '<svg stroke="currentColor"')
    
    if 'strokeWidth="2"' not in content:
        content = content.replace('<svg', '<svg strokeWidth="2"')
    
    if 'strokeLinecap="round"' not in content:
        content = content.replace('<svg', '<svg strokeLinecap="round"')
    
    if 'strokeLinejoin="round"' not in content:
        content = content.replace('<svg', '<svg strokeLinejoin="round"')
    
    # Write cleaned content
    with open(svg_path, 'w') as f:
        f.write(content)
    
    print(f"Cleaned: {svg_path}")

# Process all SVG files in directory
svg_dir = Path('icons')
for svg_file in svg_dir.glob('*.svg'):
    clean_svg(svg_file)

print("All SVG files cleaned!")
```

### Usage

```bash
# Save as clean_svgs.py
python3 clean_svgs.py
```

---

## Figma Plugin Recommendations

### Recommended Plugins

1. **SVG Export** - Better SVG export options
2. **Figma to Code** - Generate code from designs
3. **Iconify** - Icon library integration
4. **Batch Rename** - Rename multiple components

### Installation

1. Open Figma
2. Go to Plugins → Browse plugins
3. Search for plugin name
4. Click "Install"

---

## Quality Assurance

### Visual Testing

- [ ] Icon displays at 16px
- [ ] Icon displays at 20px
- [ ] Icon displays at 24px
- [ ] Icon displays at 32px
- [ ] Icon displays at 48px
- [ ] Icon looks crisp (no blurriness)
- [ ] Stroke weight appears consistent

### Functional Testing

- [ ] Icon renders without errors
- [ ] Icon inherits color correctly
- [ ] Icon works with all variants
- [ ] Icon works with custom classes
- [ ] Icon works in different contexts

### Accessibility Testing

- [ ] Screen reader announces correctly
- [ ] Color contrast meets WCAG AA
- [ ] Icon works with keyboard navigation
- [ ] Icon works with zoom (up to 200%)

---

## Troubleshooting

### Icon Appears Blurry

**Cause**: Odd pixel coordinates
**Solution**: Use even numbers for coordinates

```xml
<!-- Bad -->
<line x1="5.5" y1="12" x2="18.5" y2="12" />

<!-- Good -->
<line x1="5" y1="12" x2="19" y2="12" />
```

### Icon Doesn't Scale Properly

**Cause**: Hardcoded dimensions
**Solution**: Use viewBox and relative sizing

```xml
<!-- Bad -->
<svg width="24" height="24" viewBox="0 0 24 24">

<!-- Good -->
<svg viewBox="0 0 24 24">
```

### Color Not Applying

**Cause**: Fill attribute overriding stroke
**Solution**: Ensure fill="none"

```xml
<!-- Bad -->
<circle cx="12" cy="12" r="10" fill="blue" />

<!-- Good -->
<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" />
```

### Icon Misaligned

**Cause**: Uneven padding
**Solution**: Center content in viewBox

```xml
<!-- Ensure content is centered around (12, 12) -->
<line x1="5" y1="12" x2="19" y2="12" />
```

---

## Best Practices

### Design Phase

1. Use 24×24px frame
2. Use 2px stroke weight
3. Use round caps and joins
4. Keep content within safe zone
5. Maintain visual balance
6. Test at multiple sizes

### Export Phase

1. Use consistent export settings
2. Clean up SVG files
3. Validate SVG structure
4. Test in application
5. Document changes

### Integration Phase

1. Add to IconSprite.tsx
2. Add to iconDefinitions.ts
3. Update documentation
4. Test all sizes and variants
5. Test accessibility

---

## Batch Icon Creation Workflow

### Timeline

1. **Design Phase** (1-2 hours)
   - Create all icon frames
   - Apply consistent styling
   - Test at multiple sizes

2. **Export Phase** (30 minutes)
   - Export all icons
   - Clean up SVG files
   - Validate structure

3. **Integration Phase** (1-2 hours)
   - Add to IconSprite
   - Add to definitions
   - Update documentation
   - Test thoroughly

### Total Time: 3-5 hours for 30+ icons

---

## References

- [SVG Specification](https://www.w3.org/TR/SVG2/)
- [Figma Export Documentation](https://help.figma.com/en/articles/360040028114-Export-files)
- [SVGO Documentation](https://github.com/svg/svgo)
- [Icon System Documentation](./ICON_SYSTEM_README.md)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-20 | Initial Figma export guide |


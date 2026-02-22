# Empty State Illustrations & SVG Specifications

## Overview
Comprehensive illustration specifications for empty states, including SVG code, design guidelines, and implementation instructions.

---

## Design Principles

### Illustration Style
- **Minimal**: Simple, clean shapes
- **Friendly**: Approachable and inviting
- **Consistent**: Unified color palette and style
- **Scalable**: Works at multiple sizes
- **Accessible**: Includes proper alt text

### Color Palette
- Primary: `#3B82F6` (blue-500)
- Secondary: `#8B5CF6` (purple-500)
- Accent: `#10B981` (green-500)
- Neutral: `#E5E7EB` (gray-200)
- Background: `#F9FAFB` (gray-50)

### Sizes
- Small: 80px × 80px
- Medium: 120px × 120px
- Large: 160px × 160px

---

## 1. No Groups Created

### Concept
Three people in a circle with empty coin stack in center

### SVG Code (160px × 160px)

```svg
<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="80" cy="80" r="70" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="2"/>
  
  <!-- Person 1 (top) -->
  <circle cx="80" cy="40" r="12" fill="#3B82F6"/>
  <rect x="70" y="54" width="20" height="24" rx="4" fill="#3B82F6" opacity="0.7"/>
  
  <!-- Person 2 (bottom-left) -->
  <circle cx="50" cy="100" r="12" fill="#8B5CF6"/>
  <rect x="40" y="114" width="20" height="24" rx="4" fill="#8B5CF6" opacity="0.7"/>
  
  <!-- Person 3 (bottom-right) -->
  <circle cx="110" cy="100" r="12" fill="#10B981"/>
  <rect x="100" y="114" width="20" height="24" rx="4" fill="#10B981" opacity="0.7"/>
  
  <!-- Empty coin stack (center) -->
  <ellipse cx="80" cy="85" rx="16" ry="4" fill="#E5E7EB"/>
  <ellipse cx="80" cy="82" rx="16" ry="4" fill="#E5E7EB"/>
  <ellipse cx="80" cy="79" rx="16" ry="4" fill="#E5E7EB"/>
  
  <!-- Connecting lines (dashed) -->
  <line x1="80" y1="52" x2="80" y2="75" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="4 4"/>
  <line x1="62" y1="114" x2="72" y2="90" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="4 4"/>
  <line x1="98" y1="114" x2="88" y2="90" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="4 4"/>
</svg>
```

### React Component

```tsx
export const NoGroupsIllustration: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="No groups created illustration"
  >
    {/* SVG content */}
  </svg>
)
```

---

## 2. No Search Results

### Concept
Magnifying glass with empty results

### SVG Code (120px × 120px)

```svg
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Magnifying glass circle -->
  <circle cx="50" cy="50" r="30" stroke="#3B82F6" stroke-width="4" fill="none"/>
  
  <!-- Magnifying glass handle -->
  <line x1="72" y1="72" x2="95" y2="95" stroke="#3B82F6" stroke-width="4" stroke-linecap="round"/>
  
  <!-- Empty indicator (X) -->
  <line x1="40" y1="40" x2="60" y2="60" stroke="#E5E7EB" stroke-width="3" stroke-linecap="round"/>
  <line x1="60" y1="40" x2="40" y2="60" stroke="#E5E7EB" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Background circle -->
  <circle cx="60" cy="60" r="55" fill="#F9FAFB" opacity="0.5" style="mix-blend-mode: multiply"/>
</svg>
```

---

## 3. No Transactions

### Concept
Empty receipt/document with clock

### SVG Code (120px × 120px)

```svg
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Receipt/document -->
  <rect x="30" y="20" width="60" height="80" rx="4" fill="white" stroke="#E5E7EB" stroke-width="2"/>
  
  <!-- Receipt lines (empty) -->
  <line x1="40" y1="35" x2="80" y2="35" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/>
  <line x1="40" y1="50" x2="80" y2="50" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/>
  <line x1="40" y1="65" x2="80" y2="65" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/>
  <line x1="40" y1="80" x2="65" y2="80" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Clock icon (waiting) -->
  <circle cx="85" cy="85" r="20" fill="#3B82F6"/>
  <line x1="85" y1="85" x2="85" y2="75" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="85" y1="85" x2="92" y2="85" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>
```

---

## 4. No Members

### Concept
Empty group circle with plus sign

### SVG Code (120px × 120px)

```svg
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Large circle (group boundary) -->
  <circle cx="60" cy="60" r="45" stroke="#E5E7EB" stroke-width="3" stroke-dasharray="8 8" fill="none"/>
  
  <!-- Plus sign (add member) -->
  <circle cx="60" cy="60" r="25" fill="#3B82F6" opacity="0.1"/>
  <line x1="60" y1="45" x2="60" y2="75" stroke="#3B82F6" stroke-width="4" stroke-linecap="round"/>
  <line x1="45" y1="60" x2="75" y2="60" stroke="#3B82F6" stroke-width="4" stroke-linecap="round"/>
  
  <!-- Small person icons (placeholders) -->
  <circle cx="35" cy="35" r="6" fill="#E5E7EB"/>
  <circle cx="85" cy="35" r="6" fill="#E5E7EB"/>
  <circle cx="35" cy="85" r="6" fill="#E5E7EB"/>
  <circle cx="85" cy="85" r="6" fill="#E5E7EB"/>
</svg>
```

---

## 5. Wallet Not Connected

### Concept
Wallet with disconnected plug

### SVG Code (120px × 120px)

```svg
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Wallet body -->
  <rect x="25" y="40" width="70" height="50" rx="6" fill="#3B82F6" opacity="0.2" stroke="#3B82F6" stroke-width="2"/>
  
  <!-- Wallet flap -->
  <path d="M 25 40 L 25 35 C 25 32 27 30 30 30 L 90 30 C 93 30 95 32 95 35 L 95 40" fill="#3B82F6" opacity="0.3"/>
  
  <!-- Card slot -->
  <rect x="35" y="55" width="50" height="20" rx="3" fill="white" stroke="#3B82F6" stroke-width="2"/>
  
  <!-- Disconnected plug (right side) -->
  <circle cx="100" cy="65" r="8" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2"/>
  <line x1="100" y1="65" x2="110" y2="65" stroke="#9CA3AF" stroke-width="2"/>
  <circle cx="115" cy="65" r="3" fill="#9CA3AF"/>
  
  <!-- Disconnected socket (left side of wallet) -->
  <circle cx="20" cy="65" r="8" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2"/>
  <circle cx="18" cy="63" r="2" fill="#9CA3AF"/>
  <circle cx="22" cy="67" r="2" fill="#9CA3AF"/>
</svg>
```

---

## 6. Network Error

### Concept
Broken connection/signal

### SVG Code (120px × 120px)

```svg
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Signal waves (broken) -->
  <path d="M 30 60 Q 40 40, 50 60" stroke="#EF4444" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M 20 60 Q 35 25, 50 60" stroke="#EF4444" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
  
  <path d="M 90 60 Q 80 40, 70 60" stroke="#EF4444" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M 100 60 Q 85 25, 70 60" stroke="#EF4444" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
  
  <!-- Break/gap in middle -->
  <line x1="50" y1="60" x2="55" y2="60" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
  <line x1="65" y1="60" x2="70" y2="60" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
  
  <!-- X mark in gap -->
  <line x1="55" y1="55" x2="65" y2="65" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
  <line x1="65" y1="55" x2="55" y2="65" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Device icon -->
  <rect x="50" y="75" width="20" height="30" rx="2" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2"/>
  <circle cx="60" cy="100" r="2" fill="#9CA3AF"/>
</svg>
```

---

## 7. Permission Denied

### Concept
Lock with shield

### SVG Code (120px × 120px)

```svg
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Shield -->
  <path d="M 60 20 L 85 30 L 85 55 C 85 70, 75 85, 60 95 C 45 85, 35 70, 35 55 L 35 30 Z" fill="#F59E0B" opacity="0.2" stroke="#F59E0B" stroke-width="2"/>
  
  <!-- Lock body -->
  <rect x="50" y="55" width="20" height="25" rx="2" fill="#F59E0B"/>
  
  <!-- Lock shackle -->
  <path d="M 52 55 L 52 48 C 52 43, 55 40, 60 40 C 65 40, 68 43, 68 48 L 68 55" stroke="#F59E0B" stroke-width="3" fill="none"/>
  
  <!-- Keyhole -->
  <circle cx="60" cy="65" r="3" fill="white"/>
  <rect x="58" y="65" width="4" height="8" fill="white"/>
</svg>
```

---

## 8. Coming Soon

### Concept
Calendar with clock

### SVG Code (120px × 120px)

```svg
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Calendar -->
  <rect x="30" y="35" width="60" height="60" rx="4" fill="white" stroke="#3B82F6" stroke-width="2"/>
  
  <!-- Calendar header -->
  <rect x="30" y="35" width="60" height="15" rx="4" fill="#3B82F6"/>
  <line x1="45" y1="30" x2="45" y2="40" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
  <line x1="75" y1="30" x2="75" y2="40" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Calendar grid -->
  <line x1="30" y1="60" x2="90" y2="60" stroke="#E5E7EB" stroke-width="1"/>
  <line x1="30" y1="72" x2="90" y2="72" stroke="#E5E7EB" stroke-width="1"/>
  <line x1="30" y1="84" x2="90" y2="84" stroke="#E5E7EB" stroke-width="1"/>
  
  <!-- Clock overlay -->
  <circle cx="75" cy="75" r="18" fill="#10B981"/>
  <line x1="75" y1="75" x2="75" y2="67" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="75" y1="75" x2="80" y2="75" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>
```

---

## Implementation Guide

### React Component Pattern

```tsx
interface IllustrationProps {
  size?: number
  className?: string
}

export const EmptyStateIllustration: React.FC<IllustrationProps> = ({
  size = 120,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Descriptive label"
  >
    {/* SVG content */}
  </svg>
)
```

### Usage with EmptyState Component

```tsx
<EmptyState
  illustration={<NoGroupsIllustration size={160} />}
  heading="Start Your First Savings Group"
  message="Create a group to save together."
  primaryAction={{
    label: "Create Group",
    onClick: handleCreate,
  }}
/>
```

---

## Accessibility

### Alt Text Guidelines

Each illustration should have descriptive alt text:

```tsx
<svg
  role="img"
  aria-label="Three people in a circle with empty coin stack, representing no groups created yet"
>
```

### Screen Reader Considerations

- Use `role="img"` for semantic meaning
- Provide `aria-label` with clear description
- Hide decorative elements with `aria-hidden="true"`
- Ensure illustrations complement text, not replace it

---

## Export Guidelines

### Figma Export Settings
1. Select illustration frame
2. Export as SVG
3. Settings:
   - Include "id" attribute: No
   - Outline text: Yes
   - Simplify stroke: Yes
4. Optimize with SVGO

### Optimization

```bash
# Install SVGO
npm install -g svgo

# Optimize SVG
svgo input.svg -o output.svg
```

### File Naming

```
{state}-illustration.svg
```

Examples:
- `no-groups-illustration.svg`
- `no-search-results-illustration.svg`
- `wallet-not-connected-illustration.svg`

---

## Design Checklist

- [ ] Follows color palette
- [ ] Scalable at all sizes (80px, 120px, 160px)
- [ ] Stroke width consistent (2-4px)
- [ ] Border radius consistent (2-6px)
- [ ] Includes proper spacing
- [ ] Optimized file size (<5KB)
- [ ] Accessible alt text provided
- [ ] Tested on light/dark backgrounds
- [ ] Exported as clean SVG
- [ ] Documented in this guide

---

**Version**: 1.0  
**Last Updated**: February 20, 2026

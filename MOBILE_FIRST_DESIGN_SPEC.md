# Mobile-First Design Specification

## Overview
This document defines mobile-optimized design patterns and specifications for the Soroban Ajo financial application, prioritizing touch-first interactions and mobile user experience.

## Mobile Navigation Patterns

### Primary Navigation: Bottom Tab Bar
**Rationale**: Bottom tabs provide thumb-friendly access to core features on mobile devices.

**Tab Structure**:
- Home (Dashboard)
- Groups (Active Ajo groups)
- Activity (Transaction history)
- Profile (Settings & account)

**Specifications**:
- Height: 56px (iOS) / 56px (Android)
- Icon size: 24x24px
- Active state: Primary color with label
- Inactive state: Gray with label
- Safe area insets: Respect device notches and home indicators

### Secondary Navigation: Contextual Actions
- Use floating action buttons (FAB) for primary actions (Create Group)
- Use top app bar with back navigation for nested screens
- Implement swipe-back gesture for iOS-style navigation

### Hamburger Menu: Not Recommended
**Reason**: Hidden navigation reduces discoverability and requires extra taps. Use bottom tabs instead.

## Touch-Friendly Sizing

### Minimum Touch Targets
- Buttons: 48x48px minimum (WCAG 2.1 Level AAA)
- Input fields: 48px height minimum
- List items: 56px height minimum
- Icon buttons: 48x48px minimum
- Spacing between targets: 8px minimum

### Button Specifications
```
Primary Button:
- Height: 48px
- Padding: 16px horizontal
- Border radius: 8px
- Font size: 16px
- Font weight: 600

Secondary Button:
- Height: 44px
- Padding: 12px horizontal
- Border radius: 6px
- Font size: 15px
- Font weight: 500

Text Button:
- Height: 40px
- Padding: 8px horizontal
- Font size: 15px
- Font weight: 500
```

### Input Field Specifications
```
Text Input:
- Height: 56px
- Padding: 16px horizontal
- Border radius: 8px
- Font size: 16px (prevents iOS zoom)
- Label: 12px above field

Number Input (Amount):
- Height: 64px
- Font size: 24px (large for financial data)
- Padding: 16px horizontal
- Border radius: 8px
```

## Responsive Breakpoints

### Mobile Breakpoints
```css
/* Extra Small - iPhone SE, older devices */
@media (min-width: 320px) {
  - Single column layout
  - Compact spacing (8px base)
  - Smaller typography scale
  - Hide secondary information
}

/* Small - iPhone 12/13/14, standard phones */
@media (min-width: 375px) {
  - Single column layout
  - Standard spacing (16px base)
  - Full typography scale
  - Show essential information
}

/* Medium - Large phones, small tablets */
@media (min-width: 428px) {
  - Single column with wider content
  - Enhanced spacing (20px base)
  - Show additional context
  - Larger touch targets
}

/* Tablet Portrait */
@media (min-width: 768px) {
  - Two column layouts where appropriate
  - Side-by-side forms
  - Expanded navigation
  - Desktop-like interactions
}

/* Tablet Landscape / Desktop */
@media (min-width: 1024px) {
  - Multi-column layouts
  - Sidebar navigation
  - Desktop patterns
}
```

### Breakpoint Strategy
- Design mobile-first (320px base)
- Test on 375px (most common)
- Enhance for 428px+ (large phones)
- Adapt for 768px+ (tablets)

## Mobile-Specific Feature Prioritization

### Home Screen (Dashboard)
**Priority 1 - Above the fold**:
- Account balance (large, prominent)
- Next contribution due date
- Quick action: Create Group

**Priority 2 - Scroll to view**:
- Active groups summary (2-3 cards)
- Recent activity (3-5 items)

**Priority 3 - Collapsed/Hidden**:
- Statistics and charts
- Historical data
- Settings access

### Group Details Screen
**Priority 1**:
- Group name and status
- Your contribution status
- Next payout information
- Contribute button (if applicable)

**Priority 2**:
- Member list (collapsed by default)
- Contribution schedule
- Group progress indicator

**Priority 3**:
- Full transaction history
- Group settings
- Member details

### Create Group Flow
**Simplified Mobile Steps**:
1. Group name
2. Contribution amount (large number input)
3. Cycle duration (picker/stepper)
4. Max members (picker/stepper)
5. Review and confirm

**Design Pattern**: One field per screen with large, clear inputs and prominent "Next" button.

## Gesture Interactions

### Swipe Gestures
```
Pull to Refresh:
- Location: Top of scrollable lists
- Feedback: Spinner with haptic feedback
- Use cases: Dashboard, activity feed, group list

Swipe to Delete:
- Location: List items (drafts, notifications)
- Pattern: Swipe left reveals delete button
- Confirmation: Required for destructive actions

Swipe Navigation:
- iOS: Swipe from left edge to go back
- Android: Support system back gesture
```

### Long-Press Interactions
```
Long-Press Menu:
- Location: Group cards, member items
- Feedback: Haptic + context menu
- Actions: View details, share, copy info

Long-Press to Preview:
- Location: Transaction items
- Feedback: Modal preview with blur background
- Action: Lift finger to dismiss, tap to open
```

### Tap Interactions
```
Single Tap:
- Primary action (open, select, navigate)
- Immediate feedback (ripple effect)

Double Tap:
- Not recommended (accessibility issues)
- Use explicit buttons instead
```

### Pinch and Zoom
```
Not Applicable:
- Financial data should not require zoom
- Ensure text is readable at default size
- Use responsive typography
```

## Landscape Orientation

### Landscape Support Strategy
**Recommended**: Portrait-only for core flows, landscape-optional for viewing.

### Portrait-Only Screens
- Onboarding
- Authentication
- Create group flow
- Payment confirmation

### Landscape-Adaptive Screens
- Dashboard (two-column layout)
- Group list (grid view)
- Activity feed (wider cards)
- Profile settings (split view)

### Landscape Specifications
```
Layout:
- Use horizontal space for side-by-side content
- Reduce vertical scrolling
- Show navigation and content simultaneously

Constraints:
- Maintain touch target sizes
- Avoid horizontal scrolling
- Keep primary actions visible
```

## Mobile Onboarding Flow

### First Launch Experience
```
Screen 1: Welcome
- App logo and name
- Tagline: "Save together, grow together"
- CTA: Get Started

Screen 2: How It Works
- Visual: Circular contribution diagram
- Text: "Join a group, contribute regularly, receive payouts"
- CTA: Next

Screen 3: Security
- Visual: Shield icon
- Text: "Powered by Stellar blockchain"
- CTA: Next

Screen 4: Get Started
- Connect wallet button
- Create account button
- Skip: Browse as guest
```

### Onboarding Principles
- Maximum 3-4 screens
- Skip option always visible
- Large visuals, minimal text
- Clear value proposition
- Easy exit to app

### Progressive Disclosure
- Show features as users need them
- Contextual tooltips on first use
- Dismissible hints
- Help center access

## Performance-Aware Design Constraints

### Image Optimization
```
Profile Images:
- Size: 48x48px (1x), 96x96px (2x), 144x144px (3x)
- Format: WebP with JPEG fallback
- Lazy loading: Below fold

Group Images:
- Size: 80x80px (1x), 160x160px (2x), 240x240px (3x)
- Format: WebP with JPEG fallback
- Placeholder: Colored initials

Icons:
- Use SVG for scalability
- Inline critical icons
- Lazy load decorative icons
```

### Animation Performance
```
Preferred:
- Transform (translate, scale, rotate)
- Opacity
- CSS transitions for simple states

Avoid:
- Layout changes (width, height, top, left)
- Box-shadow animations
- Complex SVG animations

Guidelines:
- Duration: 200-300ms for UI feedback
- Easing: ease-out for entrances, ease-in for exits
- Reduce motion: Respect prefers-reduced-motion
```

### Loading States
```
Skeleton Screens:
- Use for initial page loads
- Match layout of loaded content
- Subtle shimmer animation

Spinners:
- Use for actions (submit, refresh)
- Center in container
- Disable interaction during load

Progressive Loading:
- Load critical content first
- Defer below-fold content
- Show partial data while loading
```

### Data Management
```
Caching Strategy:
- Cache user data locally
- Refresh on pull-to-refresh
- Background sync when online

Pagination:
- Load 20 items initially
- Infinite scroll for lists
- "Load more" button as fallback

Offline Support:
- Show cached data when offline
- Queue actions for later sync
- Clear offline indicator
```

### Network Optimization
```
API Calls:
- Batch requests where possible
- Debounce search inputs (300ms)
- Cancel in-flight requests on navigation

Asset Loading:
- Critical CSS inline
- Defer non-critical JavaScript
- Preload next-screen assets
```

## Typography Scale (Mobile)

```css
/* Mobile Typography */
.heading-1 {
  font-size: 28px;
  line-height: 36px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.heading-2 {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.heading-3 {
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
}

.body-large {
  font-size: 17px;
  line-height: 24px;
  font-weight: 400;
}

.body {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}

.body-small {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.caption {
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
}

/* Financial Data */
.amount-large {
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.amount-medium {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
```

## Spacing System (Mobile)

```css
/* Base: 4px */
--space-1: 4px;   /* Tight spacing */
--space-2: 8px;   /* Compact spacing */
--space-3: 12px;  /* Small spacing */
--space-4: 16px;  /* Base spacing */
--space-5: 20px;  /* Medium spacing */
--space-6: 24px;  /* Large spacing */
--space-8: 32px;  /* XL spacing */
--space-10: 40px; /* Section spacing */
--space-12: 48px; /* Page spacing */
```

## Color System (Mobile Considerations)

### Contrast Requirements
- Text on background: 4.5:1 minimum (WCAG AA)
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum
- Test in bright sunlight conditions

### Dark Mode Support
- Provide dark theme variant
- Use system preference detection
- Smooth transition between modes
- Reduce pure white/black (use grays)

## Accessibility on Mobile

### Touch Accessibility
- Minimum 48x48px touch targets
- Adequate spacing between targets
- Visual feedback on touch
- Support for larger text sizes

### Screen Reader Support
- Semantic HTML elements
- ARIA labels for custom controls
- Announce state changes
- Logical focus order

### Motion and Animation
- Respect prefers-reduced-motion
- Provide static alternatives
- Avoid auto-playing animations
- User control over motion

## Testing Checklist

### Device Testing
- [ ] iPhone SE (320px width)
- [ ] iPhone 12/13/14 (375px width)
- [ ] iPhone 14 Pro Max (428px width)
- [ ] Samsung Galaxy S21 (360px width)
- [ ] iPad Mini (768px width)
- [ ] iPad Pro (1024px width)

### Interaction Testing
- [ ] All touch targets meet 48px minimum
- [ ] Buttons provide visual feedback
- [ ] Forms work with on-screen keyboard
- [ ] Scrolling is smooth (60fps)
- [ ] Gestures work as expected
- [ ] Landscape orientation (where supported)

### Performance Testing
- [ ] First contentful paint < 1.5s
- [ ] Time to interactive < 3s
- [ ] Smooth animations (60fps)
- [ ] No layout shifts during load
- [ ] Works on 3G connection

### Accessibility Testing
- [ ] VoiceOver (iOS) navigation
- [ ] TalkBack (Android) navigation
- [ ] Keyboard navigation (tablet)
- [ ] Color contrast meets WCAG AA
- [ ] Text scales up to 200%

## Implementation Priority

### Phase 1: Core Mobile Experience
1. Bottom tab navigation
2. Touch-friendly button sizes
3. Responsive breakpoints (320px, 375px, 768px)
4. Mobile typography scale
5. Basic gesture support (pull-to-refresh)

### Phase 2: Enhanced Interactions
1. Swipe gestures (delete, navigate)
2. Long-press menus
3. Haptic feedback
4. Loading states and animations
5. Landscape layouts

### Phase 3: Optimization
1. Performance optimization
2. Offline support
3. Advanced gestures
4. Dark mode
5. Progressive web app features

## Design Deliverables

### Figma Files Structure
```
📁 Soroban Ajo Mobile
  📄 Cover & Overview
  📁 Design System
    - Colors
    - Typography
    - Spacing
    - Components
  📁 Mobile Screens (375px)
    - Onboarding
    - Authentication
    - Dashboard
    - Groups
    - Activity
    - Profile
  📁 Responsive Variants
    - 320px (Small)
    - 428px (Large)
    - 768px (Tablet)
  📁 Interactions
    - Gestures
    - Animations
    - Transitions
  📁 States
    - Loading
    - Empty
    - Error
    - Success
```

### Documentation Deliverables
- [x] Mobile-first design specification (this document)
- [ ] Touch interaction specifications
- [ ] Responsive breakpoint guide
- [ ] Performance optimization guidelines
- [ ] Component library documentation
- [ ] Gesture interaction guide

## Next Steps

1. Review and approve this specification
2. Create Figma design system for mobile
3. Design core screens at 375px breakpoint
4. Create responsive variants for other breakpoints
5. Document gesture interactions
6. Implement design system in code
7. Build and test mobile prototypes

## References

- [Apple Human Interface Guidelines - iOS](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Material Design - Mobile](https://material.io/design/platform-guidance/android-mobile.html)
- [WCAG 2.1 Touch Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Web Performance Best Practices](https://web.dev/performance/)

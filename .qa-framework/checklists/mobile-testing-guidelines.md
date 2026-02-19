# Mobile Testing Guidelines

## Overview

This document provides comprehensive guidelines for mobile device testing of the Soroban Ajo application, including responsive design validation, mobile wallet integration, touch interactions, and mobile-specific scenarios.

**Purpose**: Ensure optimal user experience on mobile devices
**Scope**: iOS and Android devices, responsive web design, mobile wallets
**Target Audience**: QA Engineers, Mobile Testers, Frontend Developers

---

## Mobile Test Matrix

### Target Devices

#### iOS Devices

| Device | Screen Size | Category | Priority | Test Frequency |
|--------|-------------|----------|----------|----------------|
| iPhone 14 Pro Max | 6.7" (428x926) | Large | Critical | Every release |
| iPhone 14 Pro | 6.1" (393x852) | Medium | Critical | Every release |
| iPhone SE (3rd gen) | 4.7" (375x667) | Small | High | Major releases |
| iPad Pro 12.9" | 12.9" (1024x1366) | Tablet | Medium | Major releases |
| iPad Mini | 8.3" (744x1133) | Tablet | Low | Quarterly |

**iOS Versions to Test**:
- iOS 16+ (Critical)
- iOS 15 (High)
- iOS 14 (Medium)

#### Android Devices

| Device | Screen Size | Category | Priority | Test Frequency |
|--------|-------------|----------|----------|----------------|
| Samsung Galaxy S23 Ultra | 6.8" (1440x3088) | Large | Critical | Every release |
| Google Pixel 7 | 6.3" (1080x2400) | Medium | Critical | Every release |
| Samsung Galaxy A54 | 6.4" (1080x2340) | Medium | High | Major releases |
| OnePlus Nord | 6.44" (1080x2400) | Medium | Medium | Major releases |
| Motorola Moto G | 6.5" (720x1600) | Budget | Low | Quarterly |

**Android Versions to Test**:
- Android 13+ (Critical)
- Android 12 (High)
- Android 11 (Medium)

### Screen Size Categories

#### Small (< 5.5")
- **Resolution**: 375x667 to 414x736
- **Examples**: iPhone SE, older Android phones
- **Challenges**: Limited screen real estate, compact layouts
- **Priority**: High (still significant user base)

#### Medium (5.5" - 6.5")
- **Resolution**: 375x812 to 428x926
- **Examples**: iPhone 14, Pixel 7, Galaxy S23
- **Challenges**: Balance between content and usability
- **Priority**: Critical (majority of users)

#### Large (> 6.5")
- **Resolution**: 428x926+
- **Examples**: iPhone 14 Pro Max, Galaxy S23 Ultra
- **Challenges**: One-handed use, reachability
- **Priority**: High (growing segment)

#### Tablet (7"+)
- **Resolution**: 768x1024+
- **Examples**: iPad, Galaxy Tab
- **Challenges**: Hybrid mobile/desktop experience
- **Priority**: Medium (smaller user base)

---

## Responsive Design Test Cases

### Layout Adaptation

#### TC-MOB-001: Viewport Adaptation
**Priority**: Critical
**Description**: Verify layout adapts correctly to different screen sizes

**Test Steps**:
1. Open application on mobile device
2. Verify all content is visible without horizontal scrolling
3. Check that text is readable without zooming
4. Verify images scale appropriately
5. Check that buttons are appropriately sized

**Expected Results**:
- [ ] No horizontal scrolling required
- [ ] Text is at least 16px font size
- [ ] Images scale to fit viewport
- [ ] Buttons are at least 44x44px (iOS) or 48x48dp (Android)
- [ ] Content fits within safe areas (notch, home indicator)

**Test on**: Small, Medium, Large screens

---

#### TC-MOB-002: Navigation Menu
**Priority**: Critical
**Description**: Verify mobile navigation menu works correctly

**Test Steps**:
1. Open application on mobile device
2. Tap hamburger menu icon
3. Verify menu slides in/opens
4. Tap menu items
5. Verify navigation works
6. Close menu

**Expected Results**:
- [ ] Menu icon visible and tappable
- [ ] Menu opens smoothly
- [ ] All menu items visible
- [ ] Navigation works correctly
- [ ] Menu closes when item selected
- [ ] Menu can be closed by tapping outside

**Test on**: All screen sizes

---

#### TC-MOB-003: Form Layout
**Priority**: High
**Description**: Verify forms are usable on mobile devices

**Test Steps**:
1. Navigate to group creation form
2. Verify all form fields are visible
3. Tap each input field
4. Verify keyboard appears
5. Enter data in all fields
6. Submit form

**Expected Results**:
- [ ] Form fields stack vertically
- [ ] Labels are clearly visible
- [ ] Input fields are appropriately sized
- [ ] Keyboard doesn't obscure active field
- [ ] Submit button is easily accessible
- [ ] Validation messages are visible

**Test on**: Small, Medium screens

---

### Touch Interactions

#### TC-MOB-004: Touch Targets
**Priority**: Critical
**Description**: Verify all interactive elements are easily tappable

**Test Steps**:
1. Navigate through application
2. Attempt to tap all buttons
3. Attempt to tap all links
4. Attempt to tap all form controls
5. Verify no accidental taps

**Expected Results**:
- [ ] All buttons are at least 44x44px (iOS) or 48x48dp (Android)
- [ ] Adequate spacing between touch targets (8px minimum)
- [ ] Touch targets respond to first tap
- [ ] Visual feedback on tap (ripple, highlight)
- [ ] No accidental taps on adjacent elements

**Test on**: All screen sizes

---

#### TC-MOB-005: Swipe Gestures
**Priority**: Medium
**Description**: Verify swipe gestures work correctly (if implemented)

**Test Steps**:
1. Navigate to group list
2. Attempt to swipe left/right on items
3. Verify swipe actions work
4. Test swipe to dismiss modals
5. Test pull-to-refresh (if implemented)

**Expected Results**:
- [ ] Swipe gestures are smooth
- [ ] Swipe actions are intuitive
- [ ] Visual feedback during swipe
- [ ] Swipe threshold is appropriate
- [ ] Accidental swipes are prevented

**Test on**: Medium, Large screens

---

#### TC-MOB-006: Scroll Behavior
**Priority**: High
**Description**: Verify scrolling works smoothly on mobile

**Test Steps**:
1. Navigate to pages with scrollable content
2. Scroll up and down
3. Test momentum scrolling
4. Test scroll to top
5. Verify fixed headers/footers

**Expected Results**:
- [ ] Scrolling is smooth (60fps)
- [ ] Momentum scrolling works
- [ ] No scroll jank or stuttering
- [ ] Fixed elements stay in place
- [ ] Scroll position is maintained on navigation

**Test on**: All screen sizes

---

### Mobile Navigation

#### TC-MOB-007: Bottom Navigation
**Priority**: High
**Description**: Verify bottom navigation bar works correctly

**Test Steps**:
1. Open application on mobile device
2. Verify bottom navigation is visible
3. Tap each navigation item
4. Verify active state is indicated
5. Navigate between sections

**Expected Results**:
- [ ] Bottom navigation always visible
- [ ] Icons are clear and recognizable
- [ ] Active state is clearly indicated
- [ ] Navigation is responsive
- [ ] Labels are readable (if present)

**Test on**: Small, Medium screens

---

#### TC-MOB-008: Back Button Behavior
**Priority**: High
**Description**: Verify back button navigation works correctly

**Test Steps**:
1. Navigate through multiple pages
2. Use browser/device back button
3. Verify navigation history is correct
4. Test back button in modals
5. Verify no unexpected exits

**Expected Results**:
- [ ] Back button navigates to previous page
- [ ] Navigation history is maintained
- [ ] Modals close on back button
- [ ] No unexpected app exits
- [ ] State is preserved on back navigation

**Test on**: All devices

---

## Mobile Wallet Integration

### Mobile Wallet Test Cases

#### TC-MOB-009: Mobile Wallet Connection
**Priority**: Critical
**Description**: Verify mobile wallet apps can connect to the application

**Test Steps**:
1. Install mobile wallet app (e.g., Freighter Mobile, Lobstr)
2. Open Soroban Ajo in mobile browser
3. Tap "Connect Wallet"
4. Select mobile wallet option
5. Approve connection in wallet app
6. Verify connection successful

**Expected Results**:
- [ ] Wallet connection options displayed
- [ ] Deep link to wallet app works
- [ ] Connection approval flow is clear
- [ ] Wallet address displayed after connection
- [ ] Connection persists across page refreshes

**Test on**: iOS and Android

**Supported Wallets**:
- Freighter Mobile (iOS, Android)
- Lobstr (iOS, Android)
- Albedo (Web-based, works on mobile browsers)

---

#### TC-MOB-010: Transaction Signing on Mobile
**Priority**: Critical
**Description**: Verify transaction signing works on mobile wallets

**Test Steps**:
1. Connect mobile wallet
2. Initiate transaction (create group)
3. Verify wallet app opens
4. Review transaction details
5. Approve transaction
6. Return to application
7. Verify transaction confirmed

**Expected Results**:
- [ ] Wallet app opens automatically
- [ ] Transaction details are clear
- [ ] Amount and recipient are visible
- [ ] User can approve or reject
- [ ] Application receives response
- [ ] UI updates after confirmation

**Test on**: iOS and Android

---

#### TC-MOB-011: Wallet Disconnection
**Priority**: High
**Description**: Verify wallet can be disconnected on mobile

**Test Steps**:
1. Connect mobile wallet
2. Navigate to account/settings
3. Tap "Disconnect Wallet"
4. Verify disconnection
5. Verify UI updates

**Expected Results**:
- [ ] Disconnect option is accessible
- [ ] Disconnection is immediate
- [ ] UI updates to disconnected state
- [ ] No errors occur
- [ ] Can reconnect after disconnection

**Test on**: iOS and Android

---

### Browser-Based Wallet Testing

#### TC-MOB-012: Albedo on Mobile Browser
**Priority**: High
**Description**: Verify Albedo wallet works in mobile browsers

**Test Steps**:
1. Open application in mobile browser (Safari, Chrome)
2. Tap "Connect Wallet"
3. Select Albedo
4. Complete Albedo authentication
5. Approve connection
6. Test transaction signing

**Expected Results**:
- [ ] Albedo interface is mobile-friendly
- [ ] Authentication flow works
- [ ] Connection is established
- [ ] Transaction signing works
- [ ] No layout issues

**Test on**: iOS Safari, Android Chrome

---

## Mobile-Specific Scenarios

### Orientation Changes

#### TC-MOB-013: Portrait to Landscape
**Priority**: Medium
**Description**: Verify application handles orientation changes

**Test Steps**:
1. Open application in portrait mode
2. Rotate device to landscape
3. Verify layout adapts
4. Rotate back to portrait
5. Verify layout returns to normal

**Expected Results**:
- [ ] Layout adapts smoothly
- [ ] No content is cut off
- [ ] State is preserved
- [ ] No errors occur
- [ ] Performance is acceptable

**Test on**: Medium, Large screens

---

### Network Switching

#### TC-MOB-014: WiFi to Cellular
**Priority**: High
**Description**: Verify application handles network switching

**Test Steps**:
1. Connect to WiFi
2. Load application
3. Disable WiFi (switch to cellular)
4. Perform actions (create group, contribute)
5. Switch back to WiFi
6. Verify functionality

**Expected Results**:
- [ ] Application detects network change
- [ ] Pending requests are retried
- [ ] User is notified of network issues
- [ ] Functionality resumes on reconnection
- [ ] No data loss occurs

**Test on**: iOS and Android

---

#### TC-MOB-015: Offline Mode
**Priority**: Medium
**Description**: Verify application behavior when offline

**Test Steps**:
1. Load application
2. Enable airplane mode
3. Attempt to perform actions
4. Verify error messages
5. Disable airplane mode
6. Verify recovery

**Expected Results**:
- [ ] Offline state is detected
- [ ] User-friendly error messages displayed
- [ ] Cached data is still accessible
- [ ] Actions are queued (if applicable)
- [ ] Automatic reconnection works

**Test on**: iOS and Android

---

### Background/Foreground Transitions

#### TC-MOB-016: App Backgrounding
**Priority**: Medium
**Description**: Verify application handles backgrounding correctly

**Test Steps**:
1. Open application
2. Start a transaction
3. Switch to another app (background)
4. Wait 30 seconds
5. Return to application (foreground)
6. Verify state

**Expected Results**:
- [ ] State is preserved
- [ ] Transaction status is updated
- [ ] No errors occur
- [ ] Session is maintained
- [ ] Data is refreshed if needed

**Test on**: iOS and Android

---

#### TC-MOB-017: App Termination
**Priority**: Medium
**Description**: Verify application handles termination gracefully

**Test Steps**:
1. Open application
2. Connect wallet
3. Force close application
4. Reopen application
5. Verify state

**Expected Results**:
- [ ] Wallet connection is restored (if possible)
- [ ] User data is preserved
- [ ] No data corruption
- [ ] Application recovers gracefully
- [ ] User can continue where they left off

**Test on**: iOS and Android

---

## Mobile Performance Testing

### Performance Benchmarks

| Metric | Target | Maximum Acceptable |
|--------|--------|-------------------|
| First Contentful Paint (FCP) | < 2 seconds | < 4 seconds |
| Time to Interactive (TTI) | < 3 seconds | < 5 seconds |
| Largest Contentful Paint (LCP) | < 2.5 seconds | < 4 seconds |
| First Input Delay (FID) | < 100ms | < 300ms |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.25 |

**Test Conditions**:
- Network: 4G (4 Mbps down, 3 Mbps up)
- Device: Mid-tier mobile device
- Cache: Cold cache

### Performance Test Cases

#### TC-MOB-018: Page Load Performance
**Priority**: High
**Description**: Verify page loads within acceptable time on mobile

**Test Steps**:
1. Clear browser cache
2. Open application on mobile device
3. Measure load time using DevTools
4. Record Core Web Vitals
5. Compare against benchmarks

**Expected Results**:
- [ ] FCP < 2 seconds
- [ ] TTI < 3 seconds
- [ ] LCP < 2.5 seconds
- [ ] No layout shifts
- [ ] Smooth rendering

**Test on**: 4G network, mid-tier device

---

#### TC-MOB-019: Scroll Performance
**Priority**: High
**Description**: Verify smooth scrolling on mobile

**Test Steps**:
1. Navigate to page with long content
2. Scroll up and down rapidly
3. Monitor frame rate
4. Check for jank or stuttering
5. Verify smooth animations

**Expected Results**:
- [ ] Consistent 60fps scrolling
- [ ] No visible jank
- [ ] Smooth momentum scrolling
- [ ] No layout thrashing
- [ ] Animations are smooth

**Test on**: All screen sizes

---

## Mobile Testing Tools

### Device Testing

#### Physical Devices
- **Pros**: Most accurate, real user experience
- **Cons**: Expensive, limited device coverage
- **When to Use**: Final validation, critical releases

#### Emulators/Simulators
- **iOS Simulator**: Xcode (macOS only)
- **Android Emulator**: Android Studio
- **Pros**: Free, easy to set up, good for development
- **Cons**: Not 100% accurate, performance differences

#### Cloud Testing Services
- **BrowserStack**: Real devices in the cloud
- **Sauce Labs**: Automated mobile testing
- **AWS Device Farm**: Amazon's device testing service
- **Pros**: Wide device coverage, automated testing
- **Cons**: Cost, setup complexity

### Testing Tools

#### Chrome DevTools Device Mode
```
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device from dropdown
4. Test responsive behavior
```

#### Responsive Design Mode (Firefox)
```
1. Open Firefox DevTools (F12)
2. Click responsive design mode icon (Ctrl+Shift+M)
3. Select device or custom dimensions
4. Test responsive behavior
```

#### Safari Responsive Design Mode
```
1. Open Safari Web Inspector
2. Enable Responsive Design Mode
3. Select device
4. Test on iOS simulator
```

---

## Mobile Testing Checklist

### Pre-Test Checklist
- [ ] Test devices available and charged
- [ ] Mobile wallets installed
- [ ] Test accounts configured
- [ ] Network conditions set up
- [ ] Testing tools configured

### Responsive Design Tests
- [ ] Layout adaptation (all screen sizes)
- [ ] Navigation menu (mobile)
- [ ] Form layout (mobile)
- [ ] Touch targets (all sizes)
- [ ] Scroll behavior

### Mobile Wallet Tests
- [ ] Wallet connection (iOS)
- [ ] Wallet connection (Android)
- [ ] Transaction signing (iOS)
- [ ] Transaction signing (Android)
- [ ] Wallet disconnection

### Mobile-Specific Tests
- [ ] Orientation changes
- [ ] Network switching
- [ ] Offline mode
- [ ] Background/foreground transitions
- [ ] App termination recovery

### Performance Tests
- [ ] Page load performance
- [ ] Scroll performance
- [ ] Animation performance
- [ ] Memory usage
- [ ] Battery impact

### Post-Test Checklist
- [ ] All results documented
- [ ] Issues reported with screenshots
- [ ] Performance metrics recorded
- [ ] Device-specific issues noted
- [ ] Test report generated

---

## Common Mobile Issues and Solutions

### Issue: Text Too Small
**Solution**: Use relative units (rem, em), minimum 16px font size

### Issue: Buttons Too Small
**Solution**: Minimum 44x44px (iOS) or 48x48dp (Android)

### Issue: Horizontal Scrolling
**Solution**: Use `max-width: 100%`, `overflow-x: hidden`

### Issue: Viewport Not Set
**Solution**: Add viewport meta tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Issue: Touch Delay
**Solution**: Use `touch-action: manipulation` CSS property

### Issue: Keyboard Obscures Input
**Solution**: Scroll active input into view, adjust viewport

---

## Mobile Optimization Best Practices

### Performance
- Minimize bundle size
- Lazy load images
- Use responsive images
- Implement code splitting
- Enable compression

### UX
- Design for thumb zones
- Provide visual feedback
- Use native-like interactions
- Minimize text input
- Provide clear error messages

### Accessibility
- Ensure sufficient color contrast
- Support screen readers
- Provide alternative text
- Enable keyboard navigation
- Test with accessibility tools

---

## Related Documents
- Cross-Browser Testing Matrix
- Performance Testing Guide
- Test Automation Strategy
- Accessibility Testing Guidelines

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Owner**: QA Team / Mobile Team
**Next Review**: 2024-04-15

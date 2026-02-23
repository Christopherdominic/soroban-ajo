# PWA Testing Guide

## Pre-Testing Setup

### 1. Install and Build
```bash
cd frontend
npm install
npm run build
npm start
```

### 2. Access the App
Open: http://localhost:3000

## Test Cases

### TC-001: Service Worker Registration
**Objective**: Verify service worker registers successfully

**Steps**:
1. Open app in Chrome
2. Open DevTools (F12)
3. Go to Application tab
4. Click "Service Workers" in sidebar

**Expected**:
- Service worker shows as "activated and running"
- Status: Active
- Source: /sw.js

**Pass/Fail**: ___

---

### TC-002: Manifest Loading
**Objective**: Verify web app manifest loads correctly

**Steps**:
1. Open DevTools > Application tab
2. Click "Manifest" in sidebar
3. Review manifest properties

**Expected**:
- Name: "Ajo - Decentralized Savings Groups"
- Short name: "Ajo"
- Start URL: "/"
- Display: "standalone"
- Theme color: "#3b82f6"
- Icons: 192x192, 512x512 visible

**Pass/Fail**: ___

---

### TC-003: Install Prompt - Desktop
**Objective**: Verify install prompt appears and works

**Steps**:
1. Open app in Chrome (incognito mode)
2. Wait 30 seconds or refresh multiple times
3. Look for install prompt at bottom of screen
4. Click "Install" button

**Expected**:
- Install prompt appears with app icon
- "Install" and "Not now" buttons visible
- Clicking "Install" opens app in standalone window
- App icon appears in OS app launcher

**Pass/Fail**: ___

---

### TC-004: Install Prompt - Dismiss
**Objective**: Verify dismiss functionality works

**Steps**:
1. Wait for install prompt to appear
2. Click "Not now" button
3. Refresh page
4. Wait 30 seconds

**Expected**:
- Prompt disappears when dismissed
- Prompt does not reappear on refresh
- Preference saved in localStorage

**Pass/Fail**: ___

---

### TC-005: Offline Mode - Basic
**Objective**: Verify offline fallback page works

**Steps**:
1. Visit homepage and wait for load
2. Open DevTools > Network tab
3. Select "Offline" from throttling dropdown
4. Click a navigation link

**Expected**:
- Offline page displays
- Shows "You're Offline" message
- Lists available offline features
- "Try Again" button visible

**Pass/Fail**: ___

---

### TC-006: Offline Indicator - Going Offline
**Objective**: Verify offline indicator appears when connection lost

**Steps**:
1. Open app with internet connection
2. Open DevTools > Network tab
3. Select "Offline" from throttling dropdown

**Expected**:
- Orange notification appears at top-right
- Shows WiFi-off icon
- Message: "You're offline"
- Notification persists while offline

**Pass/Fail**: ___

---

### TC-007: Offline Indicator - Coming Online
**Objective**: Verify online indicator appears when connection restored

**Steps**:
1. Set network to "Offline" in DevTools
2. Wait for offline indicator
3. Set network back to "Online"

**Expected**:
- Green notification appears at top-right
- Shows WiFi icon
- Message: "Back online"
- Notification auto-hides after 3 seconds

**Pass/Fail**: ___

---

### TC-008: Cache Storage - Static Assets
**Objective**: Verify static assets are cached

**Steps**:
1. Open DevTools > Application tab
2. Expand "Cache Storage" in sidebar
3. Review cached items

**Expected**:
- Multiple caches present:
  - static-image-assets
  - static-js-assets
  - static-style-assets
  - next-data
- Assets stored in appropriate caches

**Pass/Fail**: ___

---

### TC-009: Cache Strategy - Images
**Objective**: Verify images load from cache

**Steps**:
1. Load homepage (images load)
2. Open DevTools > Network tab
3. Refresh page
4. Check image requests

**Expected**:
- Images show "(from ServiceWorker)" or "(from cache)"
- Load time significantly faster
- No network requests for cached images

**Pass/Fail**: ___

---

### TC-010: Cache Strategy - API Calls
**Objective**: Verify API calls use NetworkFirst strategy

**Steps**:
1. Open DevTools > Network tab
2. Navigate to dashboard (triggers API calls)
3. Set network to "Offline"
4. Refresh page

**Expected**:
- API calls attempt network first
- Fall back to cache when offline
- Cached data displays correctly
- No errors in console

**Pass/Fail**: ___

---

### TC-011: Mobile Install - Android Chrome
**Objective**: Verify installation on Android device

**Steps**:
1. Open app in Chrome on Android
2. Tap menu (⋮)
3. Look for "Install app" option
4. Tap "Install"

**Expected**:
- "Install app" option visible in menu
- Install dialog appears
- App icon added to home screen
- App opens in fullscreen mode

**Pass/Fail**: ___

---

### TC-012: Mobile Install - iOS Safari
**Objective**: Verify installation on iOS device

**Steps**:
1. Open app in Safari on iOS
2. Tap Share button (□↑)
3. Scroll and find "Add to Home Screen"
4. Tap and confirm

**Expected**:
- "Add to Home Screen" option visible
- App icon preview shows correctly
- App icon added to home screen
- App opens in fullscreen mode

**Pass/Fail**: ___

---

### TC-013: App Shortcuts
**Objective**: Verify app shortcuts work

**Steps**:
1. Install app on desktop
2. Right-click app icon
3. Review available shortcuts
4. Click "Dashboard" shortcut

**Expected**:
- Shortcuts menu appears
- "Dashboard" and "Create Group" visible
- Clicking shortcut opens correct page
- App opens in standalone mode

**Pass/Fail**: ___

---

### TC-014: Theme Colors
**Objective**: Verify theme colors apply correctly

**Steps**:
1. Install app on mobile
2. Open app
3. Check status bar color
4. Toggle dark mode
5. Check status bar color again

**Expected**:
- Light mode: Blue theme color (#3b82f6)
- Dark mode: Dark blue theme color (#1e40af)
- Status bar matches theme
- Smooth transition between modes

**Pass/Fail**: ___

---

### TC-015: Lighthouse PWA Audit
**Objective**: Verify PWA score meets requirements

**Steps**:
1. Run: `npx lighthouse http://localhost:3000 --view`
2. Wait for audit to complete
3. Review PWA score

**Expected**:
- PWA score: > 90
- All PWA checks pass:
  - ✅ Installable
  - ✅ PWA optimized
  - ✅ Works offline
  - ✅ Has manifest
  - ✅ Has service worker

**Pass/Fail**: ___

---

### TC-016: Offline Page Navigation
**Objective**: Verify offline page functionality

**Steps**:
1. Go offline (DevTools > Network > Offline)
2. Navigate to offline page
3. Click "Try Again" button
4. Go back online
5. Click "Try Again" again

**Expected**:
- Offline page displays correctly
- "Try Again" button visible
- Clicking while offline shows same page
- Clicking when online reloads successfully

**Pass/Fail**: ___

---

### TC-017: Service Worker Update
**Objective**: Verify service worker updates on new deployment

**Steps**:
1. Note current service worker version
2. Make a small change to manifest.json
3. Rebuild: `npm run build`
4. Restart: `npm start`
5. Refresh app
6. Check service worker in DevTools

**Expected**:
- New service worker detected
- Update installs automatically
- Old service worker replaced
- No errors during update

**Pass/Fail**: ___

---

### TC-018: Cache Expiration
**Objective**: Verify cache expiration works

**Steps**:
1. Open DevTools > Application > Cache Storage
2. Note cache entries and timestamps
3. Wait or manually adjust system time
4. Refresh app
5. Check cache entries

**Expected**:
- Expired entries removed
- New entries added
- Cache size stays within limits
- No stale data served

**Pass/Fail**: ___

---

### TC-019: Multiple Tabs
**Objective**: Verify PWA works across multiple tabs

**Steps**:
1. Open app in tab 1
2. Open app in tab 2
3. Go offline in DevTools
4. Navigate in both tabs

**Expected**:
- Both tabs show offline indicator
- Both tabs can access cached content
- Service worker shared between tabs
- No conflicts or errors

**Pass/Fail**: ___

---

### TC-020: Uninstall
**Objective**: Verify app can be uninstalled cleanly

**Steps**:
1. Install app (desktop or mobile)
2. Uninstall app:
   - Desktop: Right-click icon > Uninstall
   - Android: Long-press icon > Uninstall
   - iOS: Long-press icon > Remove App
3. Check browser storage

**Expected**:
- App uninstalls successfully
- Icon removed from home screen/launcher
- Cache storage cleared (optional)
- No errors or residual data

**Pass/Fail**: ___

---

## Test Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-001: Service Worker Registration | ☐ Pass ☐ Fail | |
| TC-002: Manifest Loading | ☐ Pass ☐ Fail | |
| TC-003: Install Prompt - Desktop | ☐ Pass ☐ Fail | |
| TC-004: Install Prompt - Dismiss | ☐ Pass ☐ Fail | |
| TC-005: Offline Mode - Basic | ☐ Pass ☐ Fail | |
| TC-006: Offline Indicator - Going Offline | ☐ Pass ☐ Fail | |
| TC-007: Offline Indicator - Coming Online | ☐ Pass ☐ Fail | |
| TC-008: Cache Storage - Static Assets | ☐ Pass ☐ Fail | |
| TC-009: Cache Strategy - Images | ☐ Pass ☐ Fail | |
| TC-010: Cache Strategy - API Calls | ☐ Pass ☐ Fail | |
| TC-011: Mobile Install - Android Chrome | ☐ Pass ☐ Fail | |
| TC-012: Mobile Install - iOS Safari | ☐ Pass ☐ Fail | |
| TC-013: App Shortcuts | ☐ Pass ☐ Fail | |
| TC-014: Theme Colors | ☐ Pass ☐ Fail | |
| TC-015: Lighthouse PWA Audit | ☐ Pass ☐ Fail | |
| TC-016: Offline Page Navigation | ☐ Pass ☐ Fail | |
| TC-017: Service Worker Update | ☐ Pass ☐ Fail | |
| TC-018: Cache Expiration | ☐ Pass ☐ Fail | |
| TC-019: Multiple Tabs | ☐ Pass ☐ Fail | |
| TC-020: Uninstall | ☐ Pass ☐ Fail | |

**Total Tests**: 20  
**Passed**: ___  
**Failed**: ___  
**Pass Rate**: ___%

## Browser Compatibility Matrix

| Feature | Chrome | Edge | Firefox | Safari | Chrome Android | Safari iOS |
|---------|--------|------|---------|--------|----------------|------------|
| Install | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Offline | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Cache | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Shortcuts | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Theme | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

## Issues Found

| Issue # | Test Case | Description | Severity | Status |
|---------|-----------|-------------|----------|--------|
| | | | | |
| | | | | |
| | | | | |

## Sign-off

**Tester Name**: _______________  
**Date**: _______________  
**Overall Result**: ☐ Pass ☐ Fail  
**Ready for Production**: ☐ Yes ☐ No

**Notes**:

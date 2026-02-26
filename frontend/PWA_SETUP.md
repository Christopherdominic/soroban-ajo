# PWA Setup Instructions

## Quick Start

Follow these steps to enable PWA features in the Ajo app:

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install the `next-pwa` package and all other dependencies.

### 2. Build the App

PWA features only work in production mode:

```bash
npm run build
```

### 3. Start Production Server

```bash
npm start
```

The app will be available at `http://localhost:3000`

### 4. Test PWA Features

#### Test Install Prompt
1. Open the app in Chrome/Edge
2. Visit multiple times or wait 30 seconds
3. Install prompt should appear at bottom
4. Click "Install" to add to home screen/desktop

#### Test Offline Mode
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Select "Offline" from throttling dropdown
4. Navigate to a new page
5. Should see offline fallback page

#### Test Service Worker
1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Click "Service Workers" in sidebar
4. Should see registered service worker
5. Check "Cache Storage" to see cached assets

### 5. Run Lighthouse Audit

```bash
# Install Lighthouse CLI (if not already installed)
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

Expected scores:
- PWA: > 90
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

## Mobile Testing

### Android
1. Open Chrome on Android device
2. Visit your deployed app URL
3. Tap menu (⋮) > "Install app"
4. App appears on home screen
5. Opens in fullscreen mode

### iOS
1. Open Safari on iOS device
2. Visit your deployed app URL
3. Tap Share button (□↑)
4. Select "Add to Home Screen"
5. App appears on home screen
6. Opens in fullscreen mode

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test service worker registration
- [ ] Test offline functionality
- [ ] Test install prompt on desktop
- [ ] Test install on mobile devices
- [ ] Run Lighthouse audit (PWA score > 90)
- [ ] Verify manifest.json loads correctly
- [ ] Test all app shortcuts work
- [ ] Verify icons display correctly
- [ ] Test theme colors in light/dark mode
- [ ] Check cache storage limits
- [ ] Test on multiple browsers (Chrome, Safari, Edge, Firefox)

## Troubleshooting

### Service Worker Not Working
- Ensure you're running production build (`npm run build && npm start`)
- Service workers are disabled in development mode
- Check browser console for errors
- Try in incognito mode

### Install Prompt Not Showing
- PWA criteria must be met (manifest, service worker, HTTPS)
- User must visit site multiple times
- May be dismissed by user (check localStorage)
- Some browsers don't support install prompts

### Offline Page Not Loading
- Check service worker is active in DevTools
- Verify fallback configuration in next.config.js
- Clear cache and reload
- Check network tab for failed requests

## Next Steps

After setup:
1. Customize theme colors in `public/manifest.json`
2. Add custom app shortcuts
3. Configure push notifications (optional)
4. Implement background sync (optional)
5. Monitor PWA analytics

For detailed documentation, see `frontend/docs/PWA.md`

# Progressive Web App (PWA) Implementation

## Overview

The Ajo app is now a fully functional Progressive Web App with offline capabilities, installability, and enhanced user experience.

## Features

### 1. Installability
- Users can install the app on mobile and desktop devices
- Install prompt appears automatically for eligible users
- Custom install UI with dismiss option
- Remembers user preference if dismissed

### 2. Offline Support
- Offline fallback page when no connection
- Cached static assets (CSS, JS, images, fonts)
- API response caching with NetworkFirst strategy
- Background sync for pending transactions (future enhancement)

### 3. Service Worker
- Automatic registration and updates
- Multiple caching strategies:
  - **CacheFirst**: Fonts, audio, video (long-term assets)
  - **StaleWhileRevalidate**: Images, styles, scripts (frequently updated)
  - **NetworkFirst**: API calls, dynamic content (fresh data priority)

### 4. App Manifest
- Standalone display mode (looks like native app)
- Custom theme colors (light/dark mode support)
- App shortcuts for quick actions
- Platform-specific icons (iOS, Android, Desktop)

### 5. Connection Status
- Real-time online/offline indicator
- Automatic reconnection detection
- User-friendly notifications

## Installation

### Dependencies

```bash
npm install next-pwa --save-dev
```

### Configuration

The PWA is configured in `next.config.js` using the `next-pwa` plugin with:
- Service worker generation
- Runtime caching strategies
- Offline fallback page
- Development mode disabled (for faster dev experience)

## File Structure

```
frontend/
├── public/
│   ├── manifest.json          # Web app manifest
│   ├── icon-192.png           # App icon (192x192)
│   ├── icon-512.png           # App icon (512x512)
│   ├── apple-touch-icon.png   # iOS icon (180x180)
│   └── sw.js                  # Generated service worker (gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # PWA meta tags and components
│   │   └── offline/
│   │       └── page.tsx       # Offline fallback page
│   └── components/
│       ├── InstallPrompt.tsx  # Install prompt UI
│       └── OfflineIndicator.tsx # Connection status indicator
└── next.config.js             # PWA configuration
```

## Usage

### Install Prompt

The install prompt automatically appears when:
- User visits the app multiple times
- App meets PWA criteria
- User hasn't dismissed it before

Users can:
- Click "Install" to add app to home screen/desktop
- Click "Not now" to dismiss (preference saved)

### Offline Mode

When offline:
- Previously visited pages remain accessible
- Cached assets load instantly
- Offline page shows for new navigation
- Connection status indicator appears

### Testing PWA

#### Local Testing

1. Build the production app:
```bash
npm run build
npm start
```

2. Open Chrome DevTools > Application tab
3. Check:
   - Manifest loads correctly
   - Service worker registers
   - Cache storage populated
   - Install prompt works

#### Lighthouse Audit

Run Lighthouse PWA audit:
```bash
npx lighthouse http://localhost:3000 --view
```

Target scores:
- PWA: > 90
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Mobile Testing

#### Android (Chrome)
1. Visit app in Chrome
2. Tap menu > "Install app" or "Add to Home screen"
3. App icon appears on home screen
4. Opens in standalone mode

#### iOS (Safari)
1. Visit app in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. App icon appears on home screen
5. Opens in standalone mode

#### Desktop (Chrome/Edge)
1. Visit app in Chrome or Edge
2. Look for install icon in address bar
3. Click to install
4. App opens in standalone window

## Caching Strategies

### CacheFirst
Used for: Fonts, audio, video
- Checks cache first
- Falls back to network if not cached
- Best for assets that rarely change

### StaleWhileRevalidate
Used for: Images, CSS, JS, Next.js data
- Returns cached version immediately
- Updates cache in background
- Best for frequently updated assets

### NetworkFirst
Used for: API calls, dynamic pages
- Tries network first (10s timeout)
- Falls back to cache if offline
- Best for fresh data with offline fallback

## Customization

### Update Theme Colors

Edit `public/manifest.json`:
```json
{
  "theme_color": "#3b82f6",
  "background_color": "#ffffff"
}
```

### Add App Shortcuts

Edit `public/manifest.json`:
```json
{
  "shortcuts": [
    {
      "name": "New Shortcut",
      "url": "/path",
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    }
  ]
}
```

### Modify Caching

Edit `next.config.js` runtime caching rules:
```javascript
runtimeCaching: [
  {
    urlPattern: /\/api\/custom/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'custom-api',
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 60 * 5, // 5 minutes
      },
    },
  },
]
```

## Future Enhancements

### Push Notifications
- Notify users of contribution deadlines
- Alert when payout is ready
- Remind about upcoming cycles

### Background Sync
- Queue transactions when offline
- Sync when connection restored
- Retry failed operations

### Periodic Background Sync
- Update group status in background
- Refresh contribution data
- Check for new notifications

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure HTTPS (required for PWA)
- Clear browser cache and reload
- Verify `next.config.js` configuration

### Install Prompt Not Showing
- Visit app multiple times
- Wait 30 seconds on page
- Check if already installed
- Verify manifest is valid

### Offline Page Not Working
- Check service worker is active
- Verify fallback configuration
- Test in incognito mode
- Check network throttling in DevTools

### Cache Not Updating
- Service worker uses cache-first for some assets
- Clear cache in DevTools > Application > Cache Storage
- Unregister service worker and reload
- Check cache expiration settings

## Best Practices

1. **Always test in production mode** - Service workers don't work in dev mode
2. **Use HTTPS** - Required for service workers and PWA features
3. **Test offline scenarios** - Use DevTools network throttling
4. **Monitor cache size** - Set appropriate expiration limits
5. **Version your service worker** - next-pwa handles this automatically
6. **Test on real devices** - Emulators don't fully replicate PWA behavior
7. **Update manifest carefully** - Changes require reinstallation

## Resources

- [Next PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Builder](https://www.pwabuilder.com/)

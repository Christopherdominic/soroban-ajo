# PWA Quick Reference

## Installation
```bash
cd frontend
npm install
```

## Testing PWA Locally
```bash
npm run build    # Build production version
npm start        # Start production server
```
Visit: http://localhost:3000

## Key Files

| File | Purpose |
|------|---------|
| `public/manifest.json` | App metadata, icons, theme |
| `next.config.js` | PWA configuration, caching |
| `src/components/InstallPrompt.tsx` | Install UI |
| `src/components/OfflineIndicator.tsx` | Connection status |
| `src/app/offline/page.tsx` | Offline fallback |
| `src/app/layout.tsx` | PWA integration |

## Caching Strategies

| Strategy | Used For | Behavior |
|----------|----------|----------|
| CacheFirst | Fonts, audio, video | Cache → Network |
| StaleWhileRevalidate | Images, CSS, JS | Cache + Background update |
| NetworkFirst | API, pages | Network → Cache (10s timeout) |

## Testing Checklist

### Desktop (Chrome/Edge)
- [ ] Install prompt appears
- [ ] Click install → App opens in window
- [ ] Offline mode works
- [ ] Service worker registers

### Mobile (Android)
- [ ] Chrome menu → "Install app"
- [ ] App icon on home screen
- [ ] Opens fullscreen
- [ ] Offline mode works

### Mobile (iOS)
- [ ] Safari Share → "Add to Home Screen"
- [ ] App icon on home screen
- [ ] Opens fullscreen
- [ ] Offline mode works

## DevTools Checks

### Application Tab
1. **Manifest**: Verify loads without errors
2. **Service Workers**: Check registration status
3. **Cache Storage**: Verify caches populated
4. **Offline**: Test with Network throttling

### Lighthouse Audit
```bash
lighthouse http://localhost:3000 --view
```
Target: PWA score > 90

## Common Issues

| Issue | Solution |
|-------|----------|
| Service worker not working | Use production build (`npm run build && npm start`) |
| Install prompt not showing | Visit multiple times, wait 30s, check if dismissed |
| Offline page not loading | Check service worker active, clear cache |
| Icons not displaying | Verify paths in manifest.json |

## Customization

### Change Theme Color
Edit `public/manifest.json`:
```json
{
  "theme_color": "#your-color",
  "background_color": "#your-color"
}
```

### Add App Shortcut
Edit `public/manifest.json`:
```json
{
  "shortcuts": [
    {
      "name": "Shortcut Name",
      "url": "/path",
      "icons": [{"src": "/icon-192.png", "sizes": "192x192"}]
    }
  ]
}
```

### Modify Cache Duration
Edit `next.config.js` runtimeCaching:
```javascript
{
  urlPattern: /pattern/,
  handler: 'NetworkFirst',
  options: {
    expiration: {
      maxAgeSeconds: 60 * 5  // 5 minutes
    }
  }
}
```

## Deployment Requirements

- ✅ HTTPS (required for service workers)
- ✅ Valid manifest.json
- ✅ Service worker at root scope
- ✅ Icons (192x192, 512x512)
- ✅ Production build

## Browser Support

| Browser | Install | Offline | Push |
|---------|---------|---------|------|
| Chrome Desktop | ✅ | ✅ | ✅ |
| Edge Desktop | ✅ | ✅ | ✅ |
| Firefox Desktop | ⚠️ | ✅ | ✅ |
| Safari Desktop | ⚠️ | ✅ | ❌ |
| Chrome Android | ✅ | ✅ | ✅ |
| Safari iOS | ✅ | ✅ | ❌ |

## Commands

```bash
# Development (PWA disabled)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Test PWA
npm run test:pwa

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

## Resources

- 📖 [Full Documentation](./docs/PWA.md)
- 🚀 [Setup Guide](./PWA_SETUP.md)
- 📋 [Implementation Summary](../PWA_IMPLEMENTATION_SUMMARY.md)
- 🔗 [Next PWA Docs](https://github.com/shadowwalker/next-pwa)
- 🔗 [Web.dev PWA](https://web.dev/progressive-web-apps/)

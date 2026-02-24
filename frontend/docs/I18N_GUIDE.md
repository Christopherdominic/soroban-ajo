# Multi-language Support (i18n) Implementation

## Overview
The Ajo app now supports 5 languages with full internationalization using `next-intl`.

## Supported Languages
- **English (en)** - Default
- **Spanish (es)** - Español
- **French (fr)** - Français
- **Portuguese (pt)** - Português
- **Swahili (sw)** - Kiswahili

## Architecture

### File Structure
```
frontend/src/
├── i18n.ts                          # i18n configuration
├── middleware.ts                     # Locale routing middleware
├── locales/                         # Translation files
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   ├── pt.json
│   └── sw.json
├── app/
│   └── [locale]/                    # Locale-based routing
│       ├── layout.tsx               # Locale-aware layout
│       └── page.tsx                 # Translated pages
├── components/
│   └── LanguageSelector.tsx         # Language switcher
├── hooks/
│   └── useTranslation.ts            # Translation hook
└── utils/i18n/
    └── formatters.ts                # Locale-aware formatters
```

### URL Structure
All routes are prefixed with locale:
- `/en/dashboard` - English
- `/es/dashboard` - Spanish
- `/fr/dashboard` - French
- `/pt/dashboard` - Portuguese
- `/sw/dashboard` - Swahili

## Usage

### In Components
```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');
  
  return <h1>{t('key')}</h1>;
}
```

### With Custom Hook
```tsx
import { useTranslation } from '@/hooks/useTranslation';

export default function MyComponent() {
  const { t, formatCurrency, formatDate } = useTranslation('namespace');
  
  return (
    <div>
      <p>{t('label')}</p>
      <p>{formatCurrency(100)}</p>
      <p>{formatDate(new Date())}</p>
    </div>
  );
}
```

### Formatting

#### Currency
```tsx
const { formatCurrency } = useTranslation();
formatCurrency(100.5) // "100.50 XLM"
```

#### Dates
```tsx
const { formatDate } = useTranslation();
formatDate(new Date()) // Locale-aware date format
```

#### Relative Time
```tsx
const { formatRelativeTime } = useTranslation();
formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
```

## Translation Keys Organization

### Structure
```json
{
  "common": {
    "appName": "Ajo",
    "loading": "Loading...",
    "error": "Error"
  },
  "nav": {
    "home": "Home",
    "dashboard": "Dashboard"
  },
  "group": {
    "create": "Create Group",
    "join": "Join Group"
  }
}
```

### Namespaces
- `common` - Shared UI elements
- `nav` - Navigation labels
- `home` - Home page content
- `wallet` - Wallet-related text
- `group` - Group management
- `groupForm` - Group creation form
- `contribution` - Contribution actions
- `transaction` - Transaction history
- `profile` - User profile
- `analytics` - Analytics page
- `language` - Language names
- `errors` - Error messages
- `time` - Time-related labels

## Language Selector

The language selector is available in:
- Top navigation bar (desktop)
- Mobile menu
- Profile settings

Language preference is stored in `localStorage` and persists across sessions.

## Adding New Languages

1. Create translation file: `frontend/src/locales/[code].json`
2. Add locale to `frontend/src/i18n.ts`:
   ```ts
   export const locales = ['en', 'es', 'fr', 'pt', 'sw', 'ar'] as const;
   ```
3. Add language name to all locale files:
   ```json
   {
     "language": {
       "ar": "العربية"
     }
   }
   ```

## RTL Support (Future)

For RTL languages like Arabic:
1. Add `dir` attribute to `<html>` tag based on locale
2. Update Tailwind config for RTL variants
3. Test layout with RTL-specific styles

## Best Practices

### DO
✅ Use translation keys for all user-facing text
✅ Organize keys by feature/namespace
✅ Use locale-aware formatters for dates/currency
✅ Test all languages before deployment
✅ Keep translation files in sync

### DON'T
❌ Hardcode text in components
❌ Mix languages in translation files
❌ Use generic keys like `text1`, `text2`
❌ Forget to translate error messages
❌ Assume date/number formats

## Testing

### Manual Testing
1. Switch language using selector
2. Verify all text is translated
3. Check date/currency formatting
4. Test navigation with locale URLs
5. Verify localStorage persistence

### Automated Testing
```bash
# Type check translations
npm run type-check

# Build to verify all locales
npm run build
```

## Performance

- Translation files are code-split by locale
- Only active locale is loaded
- Middleware handles locale routing efficiently
- No runtime overhead for unused languages

## Maintenance

### Updating Translations
1. Edit JSON files in `frontend/src/locales/`
2. Keep all locale files in sync
3. Use consistent key naming
4. Document context for translators

### Translation Workflow
1. Developer adds English keys
2. Export keys for translation
3. Translators provide translations
4. Import translations back to JSON files
5. Test and deploy

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Intl API Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [CLDR Locale Data](http://cldr.unicode.org/)

# Environment Configuration Guide

This guide explains how to configure and manage environment variables for the Soroban Ajo frontend application across different environments.

## Table of Contents

- [Overview](#overview)
- [Environment Files](#environment-files)
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)
- [Build Configurations](#build-configurations)
- [Environment Switching](#environment-switching)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The application supports three environments:
- **Development** - Local development with debug tools enabled
- **Staging** - Pre-production testing environment
- **Production** - Live production environment

Each environment has its own configuration file and can connect to different Stellar networks (testnet, mainnet, futurenet).

## Environment Files

### File Structure

```
frontend/
├── .env.example          # Template with all available variables
├── .env.development      # Development environment (committed)
├── .env.staging          # Staging environment (committed)
├── .env.production       # Production environment (committed)
├── .env.local            # Local overrides (NOT committed)
└── src/config/env.ts     # Type-safe environment configuration
```

### File Priority

Vite loads environment files in this order (later files override earlier ones):

1. `.env` - Loaded in all cases
2. `.env.local` - Loaded in all cases, ignored by git
3. `.env.[mode]` - Only loaded in specified mode (e.g., `.env.development`)
4. `.env.[mode].local` - Only loaded in specified mode, ignored by git

### Which Files to Commit?

✅ **Commit these files:**
- `.env.example` - Template for all variables
- `.env.development` - Development defaults
- `.env.staging` - Staging defaults
- `.env.production` - Production defaults

❌ **Never commit these files:**
- `.env.local` - Local overrides with sensitive data
- `.env.*.local` - Environment-specific local overrides

## Environment Variables

### Application Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_APP_ENV` | string | `development` | Application environment |
| `VITE_APP_NAME` | string | `Soroban Ajo` | Application name |
| `VITE_APP_VERSION` | string | `0.1.0` | Application version |

### Stellar Network Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_STELLAR_NETWORK` | string | `testnet` | Network: testnet, mainnet, futurenet |
| `VITE_SOROBAN_RPC_URL` | string | - | Soroban RPC endpoint URL |
| `VITE_HORIZON_URL` | string | - | Horizon API endpoint URL |
| `VITE_STELLAR_NETWORK_PASSPHRASE` | string | - | Network passphrase |

**Network URLs:**

Testnet:
- RPC: `https://soroban-testnet.stellar.org`
- Horizon: `https://horizon-testnet.stellar.org`
- Passphrase: `Test SDF Network ; September 2015`

Mainnet:
- RPC: `https://soroban-mainnet.stellar.org`
- Horizon: `https://horizon.stellar.org`
- Passphrase: `Public Global Stellar Network ; September 2015`

Futurenet:
- RPC: `https://rpc-futurenet.stellar.org`
- Horizon: `https://horizon-futurenet.stellar.org`
- Passphrase: `Test SDF Future Network ; October 2022`

### Smart Contract Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_SOROBAN_CONTRACT_ID` | string | - | Deployed contract ID |
| `VITE_CONTRACT_NETWORK` | string | `testnet` | Contract deployment network |

### Wallet Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_DEFAULT_WALLET` | string | `freighter` | Default wallet (freighter, albedo) |
| `VITE_WALLET_AUTO_CONNECT` | boolean | `false` | Auto-connect wallet on load |

### API Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_API_URL` | string | `http://localhost:3000` | Backend API URL |
| `VITE_API_TIMEOUT` | number | `30000` | API timeout in milliseconds |

### Feature Flags

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_DEBUG` | boolean | `false` | Enable debug mode |
| `VITE_ENABLE_ANALYTICS` | boolean | `false` | Enable analytics tracking |
| `VITE_ENABLE_ERROR_REPORTING` | boolean | `false` | Enable error reporting |
| `VITE_MAINTENANCE_MODE` | boolean | `false` | Enable maintenance mode |

### UI Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_DEFAULT_THEME` | string | `light` | Default theme (light, dark, system) |
| `VITE_ENABLE_ANIMATIONS` | boolean | `true` | Enable UI animations |
| `VITE_ITEMS_PER_PAGE` | number | `10` | Pagination items per page |

### Transaction Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_TX_TIMEOUT` | number | `30` | Transaction timeout in seconds |
| `VITE_MAX_TX_FEE` | number | `100000` | Maximum transaction fee in stroops |
| `VITE_DEFAULT_SLIPPAGE` | number | `0.5` | Default slippage tolerance (%) |

### Monitoring & Analytics

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_SENTRY_DSN` | string | - | Sentry DSN for error tracking |
| `VITE_GA_ID` | string | - | Google Analytics ID |
| `VITE_MIXPANEL_TOKEN` | string | - | Mixpanel token |

### Development Tools

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_ENABLE_DEVTOOLS` | boolean | `true` | Enable React DevTools |
| `VITE_ENABLE_REDUX_DEVTOOLS` | boolean | `true` | Enable Redux DevTools |
| `VITE_LOG_LEVEL` | string | `info` | Log level (error, warn, info, debug) |

### Security

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_HTTPS` | boolean | `false` | Enable HTTPS in development |
| `VITE_CORS_ORIGINS` | string | - | Comma-separated CORS origins |

### Performance

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_ENABLE_SW` | boolean | `false` | Enable service worker |
| `VITE_CACHE_DURATION` | number | `3600` | Cache duration in seconds |

### External Links

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_GITHUB_URL` | string | - | GitHub repository URL |
| `VITE_DISCORD_URL` | string | - | Discord server URL |
| `VITE_TWITTER_URL` | string | - | Twitter profile URL |
| `VITE_DOCS_URL` | string | - | Documentation URL |

## Setup Instructions

### 1. Initial Setup

```bash
# Navigate to frontend directory
cd frontend

# Copy example file to create local configuration
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local  # or use your preferred editor
```

### 2. Configure for Development

Update `.env.local` with your development settings:

```bash
# Minimum required configuration
VITE_SOROBAN_CONTRACT_ID=your_deployed_contract_id
VITE_STELLAR_NETWORK=testnet
```

### 3. Deploy Contract and Update Config

After deploying your smart contract:

```bash
# Update contract ID in your environment file
echo "VITE_SOROBAN_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" >> .env.local
```

### 4. Verify Configuration

```bash
# Start development server
npm run dev

# Check console for environment configuration
# (if VITE_DEBUG=true)
```

## Build Configurations

### Development Build

```bash
# Build for development (includes sourcemaps, no minification)
npm run build:dev
```

Features:
- Source maps enabled
- Console logs preserved
- No minification
- Debug tools enabled

### Staging Build

```bash
# Build for staging environment
npm run build:staging
```

Features:
- Source maps enabled
- Some optimizations
- Analytics enabled
- Error reporting enabled

### Production Build

```bash
# Build for production
npm run build:production
```

Features:
- No source maps
- Full minification
- Console logs removed
- Optimized chunks
- Service worker enabled

### Build Output

All builds output to the `dist/` directory:

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── index.html
└── ...
```

## Environment Switching

### During Development

```bash
# Run in development mode (default)
npm run dev

# Run in staging mode
npm run dev:staging

# Run in production mode
npm run dev:production
```

### Preview Builds

```bash
# Preview production build
npm run preview

# Preview staging build
npm run preview:staging
```

### Using Environment in Code

```typescript
import env, { isDevelopment, isProduction } from '@/config/env';

// Access configuration
console.log(env.sorobanRpcUrl);
console.log(env.contractId);

// Check environment
if (isDevelopment) {
  console.log('Running in development mode');
}

// Use feature flags
if (env.debug) {
  console.log('Debug mode enabled');
}
```

### Type-Safe Access

```typescript
import env from '@/config/env';

// All properties are typed
const rpcUrl: string = env.sorobanRpcUrl;
const debug: boolean = env.debug;
const timeout: number = env.apiTimeout;
```

## Best Practices

### 1. Never Commit Secrets

❌ **Don't do this:**
```bash
# .env.production
VITE_SENTRY_DSN=https://secret@sentry.io/123456
```

✅ **Do this instead:**
```bash
# .env.production
VITE_SENTRY_DSN=

# .env.local (not committed)
VITE_SENTRY_DSN=https://secret@sentry.io/123456
```

### 2. Use Environment-Specific Values

```bash
# Development
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true

# Production
VITE_API_URL=https://api.soroban-ajo.com
VITE_DEBUG=false
```

### 3. Validate Required Variables

The `env.ts` file automatically validates required variables:

```typescript
// This will throw an error if required variables are missing
import env from '@/config/env';
```

### 4. Document New Variables

When adding new environment variables:

1. Add to `.env.example` with description
2. Add to all environment files
3. Update this documentation
4. Add to `env.ts` with proper typing

### 5. Use Feature Flags

```typescript
import env from '@/config/env';

// Enable/disable features based on environment
if (env.enableAnalytics) {
  initializeAnalytics();
}

if (env.maintenanceMode) {
  showMaintenancePage();
}
```

## Troubleshooting

### Variables Not Loading

**Problem:** Environment variables are undefined

**Solutions:**
1. Ensure variable names start with `VITE_`
2. Restart dev server after changing `.env` files
3. Check file is in correct location (`frontend/` directory)
4. Verify no syntax errors in `.env` file

### Wrong Environment Loading

**Problem:** Wrong environment configuration is being used

**Solutions:**
1. Check `--mode` flag in npm script
2. Verify correct `.env.[mode]` file exists
3. Check `.env.local` isn't overriding values
4. Clear build cache: `rm -rf dist node_modules/.vite`

### Build Fails

**Problem:** Build fails with environment errors

**Solutions:**
1. Run `npm run type-check` to find TypeScript errors
2. Verify all required variables are set
3. Check `vite.config.ts` for syntax errors
4. Ensure Node.js version is compatible (v18+)

### Contract ID Not Working

**Problem:** Contract calls fail with invalid ID

**Solutions:**
1. Verify contract is deployed to correct network
2. Check `VITE_SOROBAN_CONTRACT_ID` is set correctly
3. Ensure network matches contract deployment
4. Verify contract ID format (starts with 'C')

### CORS Errors

**Problem:** API calls blocked by CORS

**Solutions:**
1. Add API URL to `VITE_CORS_ORIGINS`
2. Configure backend CORS settings
3. Check API URL is correct
4. Verify network connectivity

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main, staging, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
        working-directory: ./frontend
      
      - name: Build for production
        run: npm run build:production
        working-directory: ./frontend
        env:
          VITE_SOROBAN_CONTRACT_ID: ${{ secrets.CONTRACT_ID }}
          VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
      
      - name: Deploy
        # Your deployment steps here
```

### Environment Secrets

Store sensitive values in your CI/CD platform:

- GitHub Actions: Repository Secrets
- GitLab CI: CI/CD Variables
- Vercel: Environment Variables
- Netlify: Environment Variables

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Project README](../README.md)

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review error messages in console

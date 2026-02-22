# Environment Variables - Quick Reference

## Quick Start

```bash
# 1. Copy example file
cp .env.example .env.local

# 2. Add your contract ID
echo "VITE_SOROBAN_CONTRACT_ID=CXXXXXXXXX..." >> .env.local

# 3. Start development
npm run dev
```

## Common Commands

```bash
# Development
npm run dev                    # Run in development mode
npm run dev:staging            # Run in staging mode
npm run dev:production         # Run in production mode

# Build
npm run build                  # Build for production
npm run build:dev              # Build for development
npm run build:staging          # Build for staging

# Preview
npm run preview                # Preview production build
npm run preview:staging        # Preview staging build
```

## Essential Variables

### Minimum Required

```bash
VITE_SOROBAN_CONTRACT_ID=      # Your deployed contract ID
VITE_STELLAR_NETWORK=testnet   # testnet, mainnet, or futurenet
```

### Network URLs

**Testnet:**
```bash
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

**Mainnet:**
```bash
VITE_SOROBAN_RPC_URL=https://soroban-mainnet.stellar.org
VITE_HORIZON_URL=https://horizon.stellar.org
VITE_STELLAR_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015
```

## Using in Code

```typescript
import env from '@/config/env';

// Access variables
const contractId = env.contractId;
const rpcUrl = env.sorobanRpcUrl;
const isDebug = env.debug;

// Check environment
import { isDevelopment, isProduction } from '@/config/env';

if (isDevelopment) {
  console.log('Dev mode');
}
```

## Environment Files

| File | Purpose | Commit? |
|------|---------|---------|
| `.env.example` | Template | ✅ Yes |
| `.env.development` | Dev defaults | ✅ Yes |
| `.env.staging` | Staging defaults | ✅ Yes |
| `.env.production` | Prod defaults | ✅ Yes |
| `.env.local` | Local overrides | ❌ No |

## Feature Flags

```bash
VITE_DEBUG=true                      # Enable debug mode
VITE_ENABLE_ANALYTICS=false          # Disable analytics
VITE_ENABLE_ERROR_REPORTING=false    # Disable error reporting
VITE_MAINTENANCE_MODE=false          # Disable maintenance mode
```

## Troubleshooting

### Variables not loading?
1. Restart dev server
2. Check variable starts with `VITE_`
3. Verify file location

### Wrong environment?
1. Check `--mode` flag in script
2. Verify `.env.[mode]` file exists
3. Clear cache: `rm -rf dist node_modules/.vite`

### Build fails?
1. Run `npm run type-check`
2. Check all required variables are set
3. Verify contract ID is correct

## Security Checklist

- [ ] Never commit `.env.local`
- [ ] Never commit secrets in `.env.*` files
- [ ] Use CI/CD secrets for sensitive values
- [ ] Rotate keys regularly
- [ ] Use different keys per environment

## Full Documentation

See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for complete documentation.

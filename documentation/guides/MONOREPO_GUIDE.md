# Monorepo Structure Guide

## Overview

Drips is organized as a monorepo with three main packages:

1. **frontend/** - Next.js web application
2. **backend/** - Node.js/Express API server  
3. **contracts/** - Soroban smart contracts (Rust)

## Directory Structure

```
drips_maintener/
├── package.json              # Root package.json (workspace config)
├── README.md                 # Main project documentation
├── .gitignore               # Git ignore (monorepo-wide)
│
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   │   ├── layout.tsx   # Root layout
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── providers.tsx
│   │   │   ├── dashboard/
│   │   │   ├── groups/
│   │   │   └── analytics/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── .env.example
│   └── README.md
│
├── backend/                  # Node.js API Server
│   ├── src/
│   │   ├── index.ts         # Entry point
│   │   ├── routes/          # API routes
│   │   │   ├── health.ts
│   │   │   └── groups.ts
│   │   ├── controllers/     # Request handlers
│   │   │   └── groupsController.ts
│   │   ├── services/        # Business logic
│   │   │   └── sorobanService.ts
│   │   ├── middleware/      # Express middleware
│   │   │   └── errorHandler.ts
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── tests/               # Test files
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── contracts/                # Smart Contracts
│   └── ajo/
│       ├── src/
│       │   ├── lib.rs
│       │   ├── contract.rs
│       │   ├── types.rs
│       │   ├── errors.rs
│       │   ├── events.rs
│       │   └── utils.rs
│       ├── tests/
│       ├── Cargo.toml
│       └── README.md
│
├── documentation/            # Project Documentation
│   ├── NEXTJS_MIGRATION.md
│   ├── MIGRATION_SUMMARY.md
│   ├── CONTRIBUTING.md
│   ├── SECURITY.md
│   └── ... (all other .md files)
│
└── docs/                     # Architecture & Design Docs
    ├── architecture.md
    ├── roadmap.md
    └── ...
```

## Workspace Configuration

The root `package.json` defines workspaces for npm:

```json
{
  "workspaces": ["frontend", "backend"]
}
```

This enables:
- Shared `node_modules` at root (space efficient)
- Cross-package dependencies
- Single `npm install` at root installs all packages

## Package Management

### Install All Dependencies

```bash
# From root - installs frontend + backend
npm install

# Or use the script
npm run install:all
```

### Install for Single Package

```bash
# Frontend only
cd frontend && npm install

# Backend only
cd backend && npm install
```

### Add Dependency to Specific Package

```bash
# Add to frontend
cd frontend
npm install package-name

# Add to backend
cd backend
npm install package-name
```

## Running the Monorepo

### Development Mode

```bash
# From root - runs both frontend and backend
npm run dev

# Runs concurrently:
# - Frontend on http://localhost:3000
# - Backend on http://localhost:3001
```

### Individual Packages

```bash
# Frontend only
npm run dev:frontend
# or
cd frontend && npm run dev

# Backend only
npm run dev:backend
# or
cd backend && npm run dev
```

### Building

```bash
# Build all packages
npm run build

# Build individual
npm run build:frontend
npm run build:backend
npm run build:contracts
```

## Environment Variables

Each package has its own environment file:

### Frontend
- File: `frontend/.env.local`
- Prefix: `NEXT_PUBLIC_*`
- Example: `NEXT_PUBLIC_API_URL=http://localhost:3001`

### Backend
- File: `backend/.env`
- No prefix required
- Example: `PORT=3001`

### Contracts
- Configured via Stellar CLI
- No .env file needed

## Code Quality

### Linting

```bash
# Lint all packages
npm run lint

# Lint individual
npm run lint:frontend
npm run lint:backend
```

### Type Checking

```bash
# Type check all TypeScript packages
npm run type-check

# Individual
npm run type-check:frontend
npm run type-check:backend
```

### Testing

```bash
# Test contracts
npm run test:contracts
# Runs: cd contracts/ajo && cargo test

# Test backend (when configured)
cd backend && npm test

# Test frontend (when configured)
cd frontend && npm test
```

## Git Workflow

### Gitignore Structure

- Root `.gitignore` - General rules (node_modules, .env, etc.)
- `frontend/.gitignore` - Frontend-specific (.next, etc.)
- `backend/.gitignore` - Backend-specific (dist/, etc.)

### Committing Changes

```bash
# Stage changes from any package
git add frontend/src/components/NewComponent.tsx
git add backend/src/routes/newRoute.ts
git add contracts/ajo/src/lib.rs

# Commit with descriptive message
git commit -m "feat: add new group feature across stack"

# Push
git push
```

### Best Practices

- Keep commits focused on specific features
- Use conventional commit messages (feat:, fix:, docs:, etc.)
- Test locally before committing
- Run `npm run type-check` and `npm run lint` before pushing

## Development Workflow

### Starting New Feature

1. **Plan the feature** - Which packages need changes?
2. **Contracts first** (if needed)
   ```bash
   cd contracts/ajo
   # Make changes, test
   cargo test
   stellar contract build
   ```

3. **Backend API** (if needed)
   ```bash
   cd backend
   # Add routes, controllers, services
   npm run dev
   # Test endpoints
   ```

4. **Frontend UI**
   ```bash
   cd frontend
   # Add components, hooks
   npm run dev
   # Test in browser
   ```

5. **Test end-to-end**
   ```bash
   # From root
   npm run dev
   # Test full flow
   ```

## Common Tasks

### Adding a New API Endpoint

1. Create route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Add service logic in `backend/src/services/`
4. Update frontend service in `frontend/src/services/`
5. Create UI components in `frontend/src/components/`

### Adding a New Page

1. Create page in `frontend/src/app/[pagename]/page.tsx`
2. Add components if needed
3. Update navigation/links
4. Add API calls if needed

### Modifying Smart Contract

1. Update contract in `contracts/ajo/src/`
2. Run tests: `cargo test`
3. Rebuild: `stellar contract build`
4. Redeploy (testnet): `stellar contract deploy ...`
5. Update contract ID in frontend and backend `.env` files
6. Update frontend/backend services to use new contract interface

## Troubleshooting

### Port Conflicts

If ports 3000 or 3001 are in use:

```bash
# Change frontend port
cd frontend
PORT=3002 npm run dev

# Change backend port
cd backend
PORT=3003 npm run dev
```

### Dependency Issues

```bash
# Clean install
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

### TypeScript Errors

```bash
# Check types
npm run type-check

# If persistent, rebuild
cd frontend && npm run build
cd ../backend && npm run build
```

### Contract Build Fails

```bash
cd contracts/ajo
cargo clean
cargo build
stellar contract build
```

## Deployment

### Full Stack Deployment

1. **Deploy Contracts**
   ```bash
   cd contracts/ajo
   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/ajo.wasm --network mainnet
   # Save contract ID
   ```

2. **Deploy Backend**
   - Platform: Railway, Render, Heroku
   - Set environment variables
   - Deploy from `backend/` directory
   - Note API URL

3. **Deploy Frontend**
   - Platform: Vercel (recommended)
   - Set environment variables (including backend API URL)
   - Deploy from `frontend/` directory
   - Connect domain

## Benefits of Monorepo

✅ **Single Source of Truth** - All code in one place  
✅ **Shared Dependencies** - Efficient disk usage  
✅ **Atomic Commits** - Changes across packages in one commit  
✅ **Consistent Tooling** - Same TypeScript, ESLint versions  
✅ **Easy Cross-Package Changes** - Refactor easily  
✅ **Unified CI/CD** - Single pipeline for all packages  

## Resources

- [npm Workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- [Monorepo Best Practices](https://monorepo.tools/)
- Project READMEs:
  - [Frontend](../frontend/README.md)
  - [Backend](../backend/README.md)
  - [Main README](../README.md)

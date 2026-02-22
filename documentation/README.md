# Drips Frontend - Next.js Application

A modern, production-ready frontend for the Drips decentralized savings groups platform, built with Next.js 14, React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your Stellar/Soroban configuration
# NEXT_PUBLIC_SOROBAN_RPC_URL=your_rpc_url
# NEXT_PUBLIC_SOROBAN_CONTRACT_ID=your_contract_id

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── providers.tsx       # React Query & Toast providers
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── groups/             # Group listing & detail pages
│   │   └── analytics/          # Analytics pages
│   ├── components/             # React components
│   │   ├── WalletConnector.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── GroupCard.tsx
│   │   ├── GroupsList.tsx
│   │   ├── GroupDetailPage.tsx
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication state
│   │   ├── useContractData.ts  # Blockchain data fetching
│   │   ├── useWallet.ts        # Wallet integration
│   │   └── useAnalytics.ts
│   ├── services/               # Service layer
│   │   ├── soroban.ts          # Stellar SDK integration
│   │   ├── authService.ts      # Authentication
│   │   └── cache.ts            # Caching utilities
│   ├── utils/                  # Utility functions
│   │   └── notifications.ts    # Toast notifications
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   └── styles/                 # Global styles
│       └── globals.css
├── public/                     # Static assets
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── package.json
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.2
- **Styling**: Tailwind CSS 3.3
- **State Management**:
  - React Query (TanStack Query 5.28) - Server state
  - Zustand 4.4 - Client state
- **Blockchain**: Stellar SDK 12.0
- **UI Components**: Custom components with Tailwind
- **Notifications**: React Hot Toast 2.4
- **Charts**: Recharts 2.10
- **Date Utilities**: date-fns 2.30
- **HTTP Client**: Axios 1.6

## 📄 Available Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# Stellar/Soroban Configuration
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_SOROBAN_CONTRACT_ID=your_contract_id_here

# Application
NEXT_PUBLIC_APP_NAME=Drips
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎨 Component Architecture

### Client vs Server Components

- **Server Components** (default): Layout, static pages
- **Client Components** (`'use client'`): Interactive components, hooks, state management

### Key Components

1. **WalletConnector**: Freighter wallet integration
2. **DashboardLayout**: Main authenticated layout
3. **GroupsList**: Display all savings groups
4. **GroupCard**: Individual group preview
5. **GroupDetailPage**: Detailed group view with tabs
6. **ContributionForm**: Make contributions
7. **TransactionHistory**: View transaction history
8. **GroupAnalytics**: Charts and analytics

## 🔐 Authentication Flow

1. User clicks "Connect Wallet"
2. Freighter extension opens
3. User authorizes connection
4. Public key stored in Zustand store
5. Auto-redirect to dashboard

## 📊 Data Fetching

Using React Query for:
- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states

## 🎯 Routing

Next.js App Router structure:
- `/` - Landing page
- `/dashboard` - User dashboard (protected)
- `/groups` - Browse all groups
- `/groups/[id]` - Group detail page
- `/analytics` - Platform analytics

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

```bash
# Build
npm run build

# The output is in .next/ folder
# Serve with: npm start
```

## 📝 Code Style

- ESLint with Next.js config
- TypeScript strict mode
- Functional components with hooks
- Tailwind for all styling

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Stellar SDK](https://stellar.github.io/js-stellar-sdk/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
```

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_`
- Restart dev server after changes
- Check `.env.local` exists

## 📄 License

See LICENSE file in repository root.

# Frontend Development Quick Start

## ⚡ Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Your app will open at `http://localhost:5173`

### 3. Choose an Issue
Pick a frontend issue (#19-35) from the Wave program and comment to get assigned.

## 📦 What's Included

### Core Setup ✅
- **Vite** - Lightning-fast build tool
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

### Libraries Installed ✅
- **React Query** - Server state management
- **Zustand** - Client state management
- **Stellar SDK** - Blockchain integration
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **date-fns** - Date utilities
- **lucide-react** - react icons

### Development Tools ✅
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Tailwind CSS** - Pre-configured
- **PostCSS** - CSS processing

## 🚀 Available Commands

```bash
# Development
npm run dev           # Start dev server with hot reload
npm run type-check    # Check TypeScript
npm run lint          # Run ESLint

# Production
npm run build         # Build optimized bundle
npm run preview       # Preview production build

# Testing
npm test             # Run unit tests
```

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── components/    # Reusable React components
│   ├── pages/        # Page-level components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API & blockchain integration
│   ├── types/        # TypeScript interfaces
│   ├── utils/        # Helper functions
│   ├── styles/       # Global styles
│   ├── App.tsx       # Root component
│   └── main.tsx      # Entry point
├── public/           # Static assets
├── index.html        # HTML template
├── vite.config.ts    # Vite configuration
├── tailwind.config.js # Tailwind theme
└── package.json      # Dependencies
```

## 🎯 First Task Checklist

- [ ] Clone the repo and navigate to `frontend/`
- [ ] Run `npm install`
- [ ] Run `npm run dev` and verify it opens at localhost:5173
- [ ] Open [frontend/README.md](README.md) for full documentation
- [ ] Find a good first issue (#19-24) that interests you
- [ ] Comment on the issue: "I'd like to work on this! 👋"
- [ ] Read the issue description and acceptance criteria
- [ ] Start building! 🚀

## 💡 Useful Patterns

### Creating a Component
```typescript
// src/components/MyComponent.tsx
import React from 'react'

interface Props {
  title: string
}

export const MyComponent: React.FC<Props> = ({ title }) => {
  return <div className="p-4 rounded-lg bg-white">{title}</div>
}
```

### Using Tailwind CSS
```typescript
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
  Click me
</button>
```

### Environment Variables
Copy `.env.example` to `.env.local` and add your values:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

## 🔗 Blockchain Integration

The Stellar SDK is already installed. To interact with smart contracts:

```typescript
// In your component or service
import { Keypair, SorobanRpc } from 'stellar-sdk'

// Connect to testnet
const rpcUrl = import.meta.env.VITE_SOROBAN_RPC_URL
const contractId = import.meta.env.VITE_SOROBAN_CONTRACT_ID
```

## 🆘 Troubleshooting

**Port 5173 already in use?**
```bash
npm run dev -- --port 3000
```

**ESLint errors?**
```bash
npm run lint -- --fix
```

**TypeScript errors?**
```bash
npm run type-check
```

## 📚 Learn More

- [Full Frontend README](README.md)
- [Main Project Docs](../docs/)
- [GitHub Issues](https://github.com/Christopherdominic/soroban-ajo/issues)
- [React Docs](https://react.dev)
- [Stellar Docs](https://developers.stellar.org/docs)

## 🎉 Ready to Code?

You're all set! Pick an issue and start contributing. The community is here to help! 

Questions? Ask in the issue comments or join our Discord.

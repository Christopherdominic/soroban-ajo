# Soroban Ajo Frontend

> Decentralized rotational savings platform built on Stellar blockchain

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)](https://tailwindcss.com)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

**New to the project?** Read [FRONTEND_SETUP.md](../FRONTEND_SETUP.md) for detailed setup instructions.

---

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic understanding of React and TypeScript
- Familiarity with the [Stellar SDK](https://developers.stellar.org/docs)
- Read [../docs/architecture.md](../docs/architecture.md) for smart contract understanding

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app will open at http://localhost:5173
```

### Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server with hot reload

# Building
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types

# Testing
npm test            # Run Vitest unit tests
npm run test:ui     # Run tests with UI
npm run test:coverage # Generate coverage report
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page-level components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and Stellar SDK integration
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles and Tailwind CSS
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🛠 Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing

### State Management
- **Zustand** - Lightweight state management
- **TanStack React Query** - Server state management

### Blockchain Integration
- **Stellar SDK** - Connect to Stellar blockchain
- **Soroban JS SDK** - Smart contract interaction

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

### UI & Components
- **React Hot Toast** - Toast notifications
- **Recharts** - Data visualization

### Testing & Quality
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 🎯 Key Features to Implement

### Phase 1: Foundation (Good First Issues #19-24)
- [ ] Wallet connection component (Freighter integration)
- [ ] Responsive dashboard layout
- [ ] Group creation form
- [ ] Group card component
- [ ] Member list view
- [ ] Contribution form

### Phase 2: Core Features (Medium Issues #25-29)
- [ ] Stellar SDK integration for contract interaction
- [ ] React Query state management setup
- [ ] Group detail page with tabs
- [ ] Dashboard with groups list
- [ ] Transaction history display

### Phase 3: Advanced (High Issues #30-35)
- [ ] User authentication and session management
- [ ] Notification system
- [ ] Error boundary and error handling
- [ ] Analytics dashboard
- [ ] Mobile-responsive design
- [ ] Testing framework setup

## 📚 Component Architecture

### Folder Organization by Feature

```
src/components/
├── common/                 # Shared components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Button.tsx
│   └── Card.tsx
├── wallet/                 # Wallet connection components
│   ├── WalletConnector.tsx
│   └── WalletStatus.tsx
├── groups/                 # Group management components
│   ├── GroupCard.tsx
│   ├── GroupList.tsx
│   ├── GroupForm.tsx
│   └── GroupDetail.tsx
├── contributions/          # Contribution components
│   ├── ContributionForm.tsx
│   └── ContributionHistory.tsx
└── analytics/              # Analytics components
    ├── Dashboard.tsx
    └── Charts.tsx
```

## 🔗 Stellar/Soroban Integration

### Setting Up Contract Interaction

```typescript
// services/soroban.ts
import { Keypair, SorobanRpc, Contract } from 'stellar-sdk'

export const initializeSoroban = (publicKey: string) => {
  // Initialize Soroban client
  // Connect to testnet RPC
  // Load contract instance
}

export const invokeContract = async (
  method: string,
  params: any[]
) => {
  // Prepare transaction
  // Sign with user's wallet
  // Submit to network
}
```

### Wallet Integration (Freighter)

```typescript
// hooks/useWallet.ts
import { useCallback } from 'react'

export const useWallet = () => {
  const connectWallet = useCallback(async () => {
    // Request connection from Freighter
    // Get user's public key
    // Store in Zustand store
  }, [])

  // Return wallet state and methods
}
```

## 🎨 Styling Guidelines

### Tailwind CSS Usage

```typescript
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 className="text-lg font-bold text-gray-900">Title</h2>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
    Action
  </button>
</div>
```

### Custom Colors

The project uses custom Tailwind theme colors matching the Ajo brand:
- `primary` (blue-600): Main brand color
- `secondary` (purple-500): Secondary actions
- `success` (green-500): Success states
- `error` (red-500): Error states
- `warning` (amber-500): Warning states
- `info` (cyan-500): Information

## 🧪 Testing

### Unit Tests

```bash
# Create test file alongside component
src/components/Button.test.tsx

# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Example Test

```typescript
// src/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## 📝 Code Quality

### ESLint Configuration

Run linting:
```bash
npm run lint
npm run lint -- --fix  # Auto-fix issues
```

### TypeScript

Strict mode is enabled. All files should:
- Have proper type annotations
- Avoid `any` types
- Export types alongside components

```typescript
// Good practice
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>
}
```

## 🔐 Security Considerations

### Environment Variables

Create `.env.local` for sensitive data:

```env
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_SOROBAN_CONTRACT_ID=your_contract_id_here
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; February 2021
```

**Never commit** `.env.local` or API keys.

### Wallet Security

- Use Freighter for key management
- Never request user private keys
- Validate contract addresses before interactions
- Always show confirmation dialogs for transactions

## 🚀 Deployment

### Building for Production

```bash
npm run build
# Creates optimized `dist/` folder
```

### Deployment Platforms

The app can be deployed to:
- **Vercel** - Recommended, automatic deployments
- **Netlify** - Static hosting with forms support
- **GitHub Pages** - Free hosting
- **Stellar Deployed Apps** - Stellar ecosystem platform

## 🐛 Debugging

### Development Tools

```bash
# React Developer Tools Chrome Extension
# Redux DevTools (if using Redux)
# Vite has built-in HMR (Hot Module Reload)
```

### Common Issues

**Issue: Wallet not connecting**
- Ensure Freighter is installed
- Check network is set to Testnet
- Clear browser cache

**Issue: Contract errors**
- Verify contract ID matches deployment
- Check RPC endpoint is reachable
- Review contract error messages in logs

## 📖 Learn More

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Stellar Docs](https://developers.stellar.org/docs)
- [Soroban Docs](https://soroban.stellar.org/docs)
- [React Router](https://reactrouter.com)

## 🤝 Contributing

1. Read [../CONTRIBUTING.md](../CONTRIBUTING.md)
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow the component patterns in `src/components/`
4. Write tests for new functionality
5. Ensure all tests pass: `npm test`
6. Submit a pull request

## 📋 GitHub Issues

Pick an issue from the Wave program:
- **#19-24**: Good First Issues (frontend basics)
- **#25-29**: Medium Issues (feature implementation)
- **#30-35**: High Issues (advanced features)

Comment on an issue to get assigned:
```
I'd like to work on this! 👋
```

## 📞 Support

- Ask in issue comments
- Join community Discord
- Check existing discussions

## 📄 License

This project is licensed under the same license as the main repository. See [../LICENSE](../LICENSE).

---

**Happy coding! 🎉 We're excited to have you contribute to Soroban Ajo.**

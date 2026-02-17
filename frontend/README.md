# Soroban Ajo Frontend

Web interface for the Soroban Ajo decentralized rotational savings contract on Stellar.

## Overview

The Soroban Ajo frontend provides an intuitive interface for:
- Creating and managing savings groups
- Joining existing groups
- Contributing to cycles
- Tracking payouts
- Managing group metadata

## Status

🚧 **In Planning Phase** - See [ARCHITECTURE.md](./ARCHITECTURE.md) and [ROADMAP.md](./ROADMAP.md) for details.

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Comprehensive technical architecture
  - Technology stack
  - Component structure
  - State management
  - Security considerations
  - Performance optimization

- **[ROADMAP.md](./ROADMAP.md)** - Development roadmap
  - Phased implementation plan
  - Feature milestones
  - Success metrics
  - Resource requirements

## Quick Start (Coming Soon)

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Freighter wallet extension
- Access to Stellar testnet

### Installation

```bash
# Clone the repository
git clone https://github.com/Christopherdominic/soroban-ajo.git
cd soroban-ajo/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your contract ID and network settings

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Technology Stack

### Core
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality React components

### Stellar Integration
- **@stellar/stellar-sdk** - Stellar SDK
- **@stellar/freighter-api** - Wallet integration
- **TanStack Query** - Contract state management

### Testing
- **Vitest** - Unit tests
- **Testing Library** - Component tests
- **Playwright** - E2E tests

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete stack details.

## Features

### Phase 1 (MVP) - Planned
- ✅ Wallet connection (Freighter)
- ✅ Create savings groups
- ✅ Join existing groups
- ✅ Contribute to cycles
- ✅ Execute payouts
- ✅ View group status

### Phase 2 - Planned
- ⬜ Group metadata (name, description, rules)
- ⬜ Advanced filtering and search
- ⬜ Transaction history
- ⬜ Export functionality (CSV, PDF)
- ⬜ Accessibility improvements

### Phase 3 - Planned
- ⬜ Real-time updates
- ⬜ Push notifications
- ⬜ Social features (invites, chat)
- ⬜ Analytics dashboard

### Phase 4 - Planned
- ⬜ Multi-language support
- ⬜ Mobile app (React Native)
- ⬜ DeFi integrations
- ⬜ Fiat on/off-ramps

See [ROADMAP.md](./ROADMAP.md) for detailed timeline.

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

### Project Structure

```
frontend/
├── app/                  # Next.js App Router
│   ├── (marketing)/     # Public pages
│   ├── (dashboard)/     # Authenticated pages
│   └── api/             # API routes
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── features/        # Feature components
│   └── layout/          # Layout components
├── lib/
│   ├── stellar/         # Stellar integration
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utilities
├── types/               # TypeScript types
└── config/              # Configuration
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure.

## Contributing

We welcome contributions! This project is part of the **Drips Wave** funding program.

### Getting Started
1. Check [GitHub Issues](https://github.com/Christopherdominic/soroban-ajo/issues) for frontend tasks
2. Read [CONTRIBUTING.md](../CONTRIBUTING.md)
3. Review [ARCHITECTURE.md](./ARCHITECTURE.md)
4. Fork and create a feature branch
5. Submit PR with tests

### Wave-Ready Issues
Look for issues labeled `wave-ready` and `frontend` to earn funding:
- **Trivial** (100 pts) - UI components, documentation
- **Medium** (150 pts) - Features, integrations
- **High** (200 pts) - Complex features, architecture

See [docs/wave-ready-issues.md](../docs/wave-ready-issues.md) for details.

## Security

- Never commit private keys or sensitive data
- All transactions signed in wallet extension
- Input validation on client and server
- Regular security audits
- Responsible disclosure program

Report security issues to: Chriseze0@gmail.com

## Deployment

### Vercel (Recommended)

```bash
# Connect to Vercel
vercel link

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Required for deployment:

```bash
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ID=CXXXXX...
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
```

See [ARCHITECTURE.md](./ARCHITECTURE.md#deployment) for full deployment guide.

## Resources

### Stellar & Soroban
- [Stellar Developers](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)

### Frontend
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)

### Project
- [Smart Contract](../contracts/ajo/)
- [Architecture Docs](../docs/architecture.md)
- [Project Roadmap](../docs/roadmap.md)

## License

MIT License - see [LICENSE](../LICENSE) for details.

## Contact

- **Issues**: [GitHub Issues](https://github.com/Christopherdominic/soroban-ajo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Christopherdominic/soroban-ajo/discussions)
- **Email**: Chriseze0@gmail.com

---

**Built with ❤️ for financial inclusion on Stellar**

# Drips - Decentralized Savings Groups

A blockchain-based savings group platform built on Stellar/Soroban, enabling communities to create and manage traditional "Ajo" or "Rotating Savings and Credit Associations" (ROSCAs) with full transparency and security.

## 📖 Documentation

**Interactive documentation site**: Run `npm run dev:docs` and visit http://localhost:3000

- [Getting Started Guide](http://localhost:3000/docs/getting-started)
- [API Reference](http://localhost:3001/api-docs) - Interactive Swagger UI
- [Architecture Overview](http://localhost:3000/docs/architecture)
- [Smart Contracts](http://localhost:3000/docs/contracts)

## 🏗 Project Structure

```
drips_maintener/
├── frontend/          # Next.js web application
│   └── src/
│       ├── app/       # Next.js pages (App Router)
│       ├── components/
│       ├── hooks/
│       └── services/
├── backend/           # Node.js/Express API server
│   └── src/
│       ├── routes/    # API routes
│       ├── controllers/
│       ├── services/  # Soroban integration
│       └── middleware/
├── contracts/         # Soroban smart contracts (Rust)
│   └── ajo/          # Main Ajo contract
├── documentation/     # All project documentation
└── package.json      # Monorepo root config
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Stellar CLI
- Git

### Monorepo Setup

```bash
# Clone repository
git clone <repo-url>
cd drips_maintener

# Install all dependencies (frontend + backend)
npm run install:all

# Or install individually:
npm install           # Root dependencies
cd frontend && npm install
cd ../backend && npm install
```

### Smart Contracts (Rust/Soroban)

```bash
cd contracts/ajo

# Build contract
stellar contract build

# Run tests
cargo test

# Deploy (with Stellar CLI configured)
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/ajo.wasm
```

### Backend API (Node.js/Express)

```bash
cd backend

# Set up environment
cp .env.example .env
# Edit .env with your Stellar RPC URL and contract ID

# Run development server
npm run dev
```

Runs on http://localhost:3001

### Frontend (Next.js)

```bash
cd frontend

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Visit http://localhost:3000

### Run Everything Together

```bash
# From root directory
npm run dev
```

This starts both frontend and backend concurrently.

## 📚 Documentation

- [Frontend README](frontend/README.md) - Next.js setup and development
- [Backend README](backend/README.md) - API server setup and endpoints
- [Next.js Migration Guide](documentation/NEXTJS_MIGRATION.md) - Migration from Vite
- [Migration Summary](documentation/MIGRATION_SUMMARY.md) - Recent migration details
- [Monorepo Guide](documentation/MONOREPO_GUIDE.md) - Monorepo workflow
- [Architecture](documentation/architecture.md) - System design
- [Security](documentation/SECURITY.md) - Security considerations
- [Contributing](CONTRIBUTING.md) - Contribution guidelines

## 🛠 Technology Stack

### Smart Contracts
- **Blockchain**: Stellar (Soroban)
- **Language**: Rust
- **Testing**: Rust test framework

### Backend API
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.2
- **Blockchain SDK**: Stellar SDK 12.0
- **Security**: Helmet, CORS
- **Validation**: Zod

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.2
- **Styling**: Tailwind CSS 3.3
- **State**: React Query + Zustand
- **Blockchain SDK**: Stellar SDK 12.0
- **Charts**: Recharts

## 🎯 Features

- ✅ Create savings groups with custom rules
- ✅ Member onboarding and management
- ✅ Scheduled contributions tracking
- ✅ Transparent fund distribution
- ✅ Transaction history on-chain
- ✅ Group analytics and insights
- ✅ Wallet integration (Freighter)

## 🔧 Development

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Stellar CLI
- Git

### Setup

```bash
# Clone repository
git clone <repo-url>
cd drips_maintener

# Install all dependencies
npm run install:all

# Set up contracts
cd contracts/ajo
cargo build

# Set up backend
cd ../../backend
cp .env.example .env
# Edit .env

# Set up frontend
cd ../frontend
cp .env.example .env.local
# Edit .env.local
```

### Development Workflow

```bash
# From root - run everything
npm run dev

# Or run individually:
npm run dev:frontend    # Next.js on :3000
npm run dev:backend     # Express on :3001

# Build everything
npm run build

# Run tests
npm run test:contracts  # Rust tests
npm run type-check      # TypeScript checks
npm run lint           # ESLint
```

## 📝 Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
SOROBAN_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
SOROBAN_CONTRACT_ID=<your_contract_id>
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_SOROBAN_CONTRACT_ID=<your_contract_id>
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🧪 Testing

### Contracts
```bash
cd contracts/ajo
cargo test
```

### Backend
```bash
cd backend
npm run type-check
npm run lint
npm test  # (when tests are added)
```

### Frontend
```bash
cd frontend
npm run type-check
npm run lint
```

### All at Once
```bash
# From root
npm run type-check
npm run lint
npm run test:contracts
```

## 🚢 Deployment

### Contracts
Deploy to Stellar testnet/mainnet using Stellar CLI:
```bash
cd contracts/ajo
stellar contract build
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/ajo.wasm --network testnet
```

### Backend
Deploy to Railway, Render, Heroku, or any Node.js hosting:
```bash
cd backend
npm run build
npm start
```

Recommended platforms:
- Railway (easiest)
- Render
- DigitalOcean App Platform
- Heroku
- AWS/GCP/Azure

### Frontend
Deploy to Vercel (recommended for Next.js):
```bash
cd frontend
npm run build
npm start
```

Or one-click deploy:
- Vercel (recommended)
- Netlify
- Cloudflare Pages

### Environment Variables
Remember to set all required environment variables in your hosting platform.

## 🤝 Contributing

See [CONTRIBUTING.md](documentation/CONTRIBUTING.md) for guidelines.

## 📄 License

See [LICENSE](LICENSE) file.

## 🔗 Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Docs](https://soroban.stellar.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 📧 Support

For questions and support, please open an issue on GitHub.

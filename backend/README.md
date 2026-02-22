# Drips Backend API

Node.js/Express backend API for the Drips decentralized savings groups platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

Server runs on http://localhost:3001

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts              # Application entry point
│   ├── routes/               # API routes
│   │   ├── health.ts         # Health check endpoint
│   │   └── groups.ts         # Groups endpoints
│   ├── controllers/          # Request handlers
│   │   └── groupsController.ts
│   ├── services/             # Business logic
│   │   └── sorobanService.ts # Stellar/Soroban integration
│   ├── middleware/           # Express middleware
│   │   └── errorHandler.ts
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
├── tests/                    # Test files
├── package.json
├── tsconfig.json
└── .env.example
```

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.2
- **Blockchain**: Stellar SDK 12.0
- **Validation**: Zod 3.22
- **Security**: Helmet, CORS
- **Development**: tsx (TypeScript runner)

## 📄 Available Scripts

```bash
npm run dev         # Start development server with hot reload
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run type-check  # TypeScript type checking
npm test            # Run tests
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Server health status

### Groups
- `GET /api/groups` - List all groups
- `GET /api/groups/:id` - Get group by ID
- `POST /api/groups` - Create new group
- `POST /api/groups/:id/join` - Join a group
- `POST /api/groups/:id/contribute` - Make contribution
- `GET /api/groups/:id/members` - Get group members
- `GET /api/groups/:id/transactions` - Get group transactions

## 🔧 Configuration

Environment variables in `.env`:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
SOROBAN_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
SOROBAN_CONTRACT_ID=your_contract_id
```

## 🏗 Architecture

### Controllers
Handle HTTP requests and responses. Validate input and call services.

### Services
Business logic layer. Interact with Soroban smart contracts.

### Middleware
- Error handling
- Request logging (Morgan)
- Security headers (Helmet)
- CORS configuration

## 🔐 Security

- Helmet for security headers
- CORS with whitelist
- Input validation with Zod
- Error sanitization in production
- TypeScript strict mode

## 🧪 Development

```bash
# Start development server
npm run dev

# Test endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/groups
```

## 🚢 Deployment

```bash
# Build
npm run build

# Start production server
NODE_ENV=production npm start
```

Deploy to:
- Railway
- Render
- Heroku
- DigitalOcean App Platform
- AWS/GCP/Azure

## 📝 Adding New Endpoints

1. Create route in `src/routes/`
2. Create controller in `src/controllers/`
3. Add business logic in `src/services/`
4. Register route in `src/index.ts`

Example:
```typescript
// src/routes/analytics.ts
import { Router } from 'express'
import { AnalyticsController } from '../controllers/analyticsController'

const router = Router()
const controller = new AnalyticsController()

router.get('/stats', controller.getStats)

export const analyticsRouter = router
```

## 🤝 Contributing

Follow the existing code structure and patterns. Ensure TypeScript types are properly defined.

## 📄 License

See LICENSE in project root.

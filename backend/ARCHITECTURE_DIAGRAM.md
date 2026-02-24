# Database Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│                     http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API (Express)                         │
│                     http://localhost:3001                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Controllers                           │  │
│  │  • groupsController.ts                                    │  │
│  │  • Handle HTTP requests/responses                         │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Cache Service Layer                      │  │
│  │  • cacheService.ts                                        │  │
│  │  • Cache-first pattern                                    │  │
│  │  • Blockchain fallback                                    │  │
│  └────────┬─────────────────────────────────┬────────────────┘  │
│           │                                  │                   │
│           ▼                                  ▼                   │
│  ┌─────────────────────┐         ┌──────────────────────────┐  │
│  │  Database Service   │         │   Soroban Service        │  │
│  │  databaseService.ts │         │   sorobanService.ts      │  │
│  │  • CRUD operations  │         │   • Blockchain calls     │  │
│  │  • Caching logic    │         │   • Smart contracts      │  │
│  └──────────┬──────────┘         └────────────┬─────────────┘  │
│             │                                  │                 │
└─────────────┼──────────────────────────────────┼─────────────────┘
              │                                  │
              ▼                                  ▼
┌──────────────────────────┐      ┌──────────────────────────────┐
│   PostgreSQL Database    │      │   Stellar Blockchain         │
│   (Docker Container)     │      │   (Soroban Testnet)          │
│                          │      │                              │
│  • User                  │      │  • Smart Contracts           │
│  • Group                 │      │  • Immutable Ledger          │
│  • GroupMember           │      │  • Transaction History       │
│  • Contribution          │      │                              │
│                          │      │  RPC: soroban-testnet        │
│  Port: 5432              │      │       .stellar.org           │
└──────────────────────────┘      └──────────────────────────────┘
```

## Data Flow

### Read Operation (Cache Hit)
```
Frontend → Backend → Cache Service → Database Service → PostgreSQL
                                                           ↓
                                                      Return (5-20ms)
```

### Read Operation (Cache Miss)
```
Frontend → Backend → Cache Service → Database Service → PostgreSQL (empty)
                          ↓
                    Soroban Service → Stellar Blockchain (500-2000ms)
                          ↓
                    Database Service → PostgreSQL (cache result)
                          ↓
                    Return cached data
```

### Write Operation
```
Frontend → Backend → Controller → Soroban Service → Stellar Blockchain
                                        ↓
                                  Transaction Success
                                        ↓
                                  Database Service → PostgreSQL (cache)
                                        ↓
                                  Return result
```

## Database Schema Relationships

```
┌─────────────────┐
│      User       │
│─────────────────│
│ id (PK)         │
│ walletAddress   │◄─────────┐
│ createdAt       │          │
│ updatedAt       │          │
└─────────────────┘          │
                             │
                             │
┌─────────────────┐          │         ┌─────────────────┐
│     Group       │          │         │  GroupMember    │
│─────────────────│          │         │─────────────────│
│ id (PK)         │◄─────────┼─────────│ id (PK)         │
│ name            │          │         │ groupId (FK)    │
│ contribution    │          │         │ userId (FK)     │───┘
│ frequency       │          │         │ joinedAt        │
│ maxMembers      │          │         └─────────────────┘
│ currentRound    │          │
│ isActive        │          │
│ createdAt       │          │
│ updatedAt       │          │
└─────────────────┘          │
        ▲                    │
        │                    │
        │         ┌─────────────────┐
        │         │  Contribution   │
        │         │─────────────────│
        └─────────│ id (PK)         │
                  │ groupId (FK)    │
                  │ userId (FK)     │───┘
                  │ amount          │
                  │ round           │
                  │ txHash (unique) │
                  │ createdAt       │
                  └─────────────────┘
```

## Service Layer Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              Cache Service (Optional)                 │ │
│  │  • Implements cache-first pattern                    │ │
│  │  • Coordinates between database and blockchain       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
├────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐      ┌──────────────────────┐   │
│  │  Database Service   │      │   Soroban Service    │   │
│  │                     │      │                      │   │
│  │  • upsertUser()     │      │  • getGroupInfo()    │   │
│  │  • upsertGroup()    │      │  • contribute()      │   │
│  │  • getGroup()       │      │  • getAllGroups()    │   │
│  │  • getAllGroups()   │      │  • getMembers()      │   │
│  │  • addGroupMember() │      │  • etc.              │   │
│  │  • addContribution()│      │                      │   │
│  │  • getContributions()│     │                      │   │
│  └─────────────────────┘      └──────────────────────┘   │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  Next.js 14 • TypeScript • Tailwind CSS • React Query       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  Node.js • Express • TypeScript • Zod • JWT                 │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│       Database           │  │      Blockchain          │
│  PostgreSQL 16           │  │  Stellar (Soroban)       │
│  Prisma ORM 7            │  │  Stellar SDK 12          │
│  pg adapter              │  │  Smart Contracts (Rust)  │
└──────────────────────────┘  └──────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Production                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐    ┌────────────────┐                  │
│  │   Frontend     │    │    Backend     │                  │
│  │   (Vercel)     │───▶│   (Railway)    │                  │
│  └────────────────┘    └────────┬───────┘                  │
│                                  │                           │
│                        ┌─────────┴─────────┐                │
│                        ▼                   ▼                │
│              ┌──────────────────┐  ┌──────────────────┐    │
│              │   PostgreSQL     │  │  Stellar Testnet │    │
│              │   (Supabase/     │  │  (or Mainnet)    │    │
│              │    Neon/Railway) │  │                  │    │
│              └──────────────────┘  └──────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Performance Comparison

```
Without Database Cache:
┌─────────┐     ┌─────────┐     ┌────────────┐
│ Request │────▶│ Backend │────▶│ Blockchain │
└─────────┘     └─────────┘     └────────────┘
                                      │
                                      ▼
                                 500-2000ms ❌


With Database Cache (Hit):
┌─────────┐     ┌─────────┐     ┌──────────┐
│ Request │────▶│ Backend │────▶│ Database │
└─────────┘     └─────────┘     └──────────┘
                                      │
                                      ▼
                                   5-20ms ✅


With Database Cache (Miss):
┌─────────┐     ┌─────────┐     ┌──────────┐
│ Request │────▶│ Backend │────▶│ Database │ (empty)
└─────────┘     └─────────┘     └────┬─────┘
                                      │
                                      ▼
                                ┌────────────┐
                                │ Blockchain │
                                └──────┬─────┘
                                       │
                                       ▼
                                ┌──────────┐
                                │ Database │ (cache)
                                └────┬─────┘
                                     │
                                     ▼
                                  Result
```

## Cache Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Cache-First Pattern                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Request arrives                                          │
│     │                                                        │
│     ▼                                                        │
│  2. Check database cache                                     │
│     │                                                        │
│     ├─▶ Found? ──▶ Return (FAST) ✅                         │
│     │                                                        │
│     └─▶ Not found?                                           │
│         │                                                    │
│         ▼                                                    │
│  3. Fetch from blockchain (SLOW)                            │
│     │                                                        │
│     ▼                                                        │
│  4. Cache result in database                                 │
│     │                                                        │
│     ▼                                                        │
│  5. Return result                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
backend/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration history
│
├── src/
│   ├── config/
│   │   └── database.ts            # Prisma client
│   │
│   ├── services/
│   │   ├── databaseService.ts     # Database CRUD
│   │   ├── cacheService.ts        # Caching logic
│   │   └── sorobanService.ts      # Blockchain calls
│   │
│   ├── controllers/
│   │   └── groupsController.ts    # HTTP handlers
│   │
│   ├── routes/
│   │   └── groups.ts              # API routes
│   │
│   └── test-db*.ts                # Test scripts
│
├── docker-compose.yml             # PostgreSQL setup
├── package.json                   # Dependencies
└── [Documentation files]          # Guides
```

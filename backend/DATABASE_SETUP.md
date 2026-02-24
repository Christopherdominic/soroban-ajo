# Database Setup Guide

## Quick Start with Docker

1. **Start PostgreSQL**:
```bash
docker-compose up -d
```

2. **Set DATABASE_URL** in `.env`:
```env
DATABASE_URL=postgresql://ajo:ajo_password@localhost:5432/ajo
```

3. **Push schema to database**:
```bash
npm run db:push
```

4. **Start the backend**:
```bash
npm run dev
```

## Database Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database (dev)
- `npm run db:migrate` - Create and apply migrations (production)
- `npm run db:studio` - Open Prisma Studio (GUI)

## Schema Overview

### User
- `walletAddress` (unique) - Stellar wallet address
- Tracks user participation in groups

### Group
- `id` - Group ID from blockchain
- `name`, `contributionAmount`, `frequency`, `maxMembers`
- `currentRound`, `isActive`
- Cached from blockchain for fast queries

### GroupMember
- Links users to groups
- Tracks join date

### Contribution
- Records all contributions with `txHash`
- Indexed by `groupId` and `round` for fast queries

## Production Setup

For production, use a managed PostgreSQL service:
- AWS RDS
- Supabase
- Neon
- Railway

Update `DATABASE_URL` with your production connection string.

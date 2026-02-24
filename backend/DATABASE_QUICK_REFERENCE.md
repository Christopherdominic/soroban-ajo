# Database Quick Reference

## Setup (One-Time)

```bash
cd backend
docker-compose up -d
npm run db:push
```

## Daily Commands

```bash
npm run db:studio      # Open database GUI
npm run dev            # Start backend with database
```

## Common Operations

### Import Service
```typescript
import { dbService } from './services/databaseService';
```

### Create/Update User
```typescript
const user = await dbService.upsertUser('GABC123...');
```

### Cache Group
```typescript
await dbService.upsertGroup('group-id', {
  name: 'My Group',
  contributionAmount: BigInt(1000000),
  frequency: 7,
  maxMembers: 10,
});
```

### Get Group with Relations
```typescript
const group = await dbService.getGroup('group-id');
// Returns group with members and contributions
```

### List All Groups
```typescript
const groups = await dbService.getAllGroups();
```

### Add Member
```typescript
await dbService.addGroupMember('group-id', 'GABC123...');
```

### Record Contribution
```typescript
await dbService.addContribution({
  groupId: 'group-id',
  walletAddress: 'GABC123...',
  amount: BigInt(1000000),
  round: 1,
  txHash: 'tx-hash-123',
});
```

### Get Contributions
```typescript
// All contributions for a group
const all = await dbService.getContributions('group-id');

// Contributions for specific round
const round1 = await dbService.getContributions('group-id', 1);
```

## Cache Pattern

```typescript
// 1. Try cache
let data = await dbService.getGroup(groupId);

// 2. Fallback to blockchain
if (!data) {
  const fresh = await sorobanService.getGroupInfo(groupId);
  await dbService.upsertGroup(groupId, fresh);
  data = await dbService.getGroup(groupId);
}

// 3. Return cached data
return data;
```

## Database Schema

```
User
├── id (cuid)
├── walletAddress (unique)
├── createdAt
└── updatedAt

Group
├── id (blockchain ID)
├── name
├── contributionAmount (BigInt)
├── frequency
├── maxMembers
├── currentRound
├── isActive
├── createdAt
└── updatedAt

GroupMember
├── id (cuid)
├── groupId → Group
├── userId → User
└── joinedAt

Contribution
├── id (cuid)
├── groupId → Group
├── userId → User
├── amount (BigInt)
├── round
├── txHash (unique)
└── createdAt
```

## Environment

```env
DATABASE_URL=postgresql://ajo:ajo_password@localhost:5432/ajo
```

## Troubleshooting

### Connection Error
```bash
# Check if PostgreSQL is running
docker ps | grep ajo-postgres

# Restart if needed
docker-compose restart
```

### Schema Changes
```bash
# After modifying schema.prisma
npm run db:push
npm run db:generate
```

### View Logs
```bash
docker logs ajo-postgres
```

### Reset Database
```bash
docker-compose down -v
docker-compose up -d
npm run db:push
```

## Performance Tips

- Use `getAllGroups()` instead of fetching individually
- Cache frequently accessed data
- Use indexes (already configured)
- Monitor with `npm run db:studio`

## Production

Replace DATABASE_URL with managed PostgreSQL:
- Supabase: `postgresql://...supabase.co:5432/...`
- Neon: `postgresql://...neon.tech/...`
- Railway: `postgresql://...railway.app:5432/...`

Use migrations:
```bash
npm run db:migrate
```

## Documentation

- Setup: `DATABASE_SETUP.md`
- Full docs: `DATABASE_IMPLEMENTATION.md`
- Integration: `INTEGRATION_GUIDE.md`
- Checklist: `IMPLEMENTATION_CHECKLIST.md`

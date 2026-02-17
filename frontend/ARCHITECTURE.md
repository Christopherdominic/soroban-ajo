# Frontend Architecture

## Overview

The Soroban Ajo frontend is a modern web application built to interact with the Soroban Ajo smart contract on the Stellar network. It provides an intuitive interface for creating and managing rotational savings groups (ROSCAs).

## Technology Stack

### Core Framework
- **Next.js 14+** with App Router
  - Server-side rendering for performance
  - API routes for backend operations
  - Built-in optimization and code splitting

### Stellar Integration
- **@stellar/stellar-sdk** - Core Stellar SDK for transaction building
- **@stellar/freighter-api** - Wallet integration (primary)
- **@lobstrco/signer-extension-api** - Alternative wallet support

### UI/UX
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality React components
- **Lucide React** - Icon library
- **react-hot-toast** - User notifications

### State Management
- **TanStack Query (React Query)** - Server state management
  - Contract data caching
  - Automatic refetching
  - Optimistic updates
- **Zustand** - Client state (wallet connection, UI preferences)

### Forms & Validation
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Testing
- **Vitest** - Unit and integration testing
- **Testing Library** - Component testing
- **Playwright** - E2E testing

## Architecture Patterns

### Component Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── (marketing)/         # Landing pages
│   ├── (dashboard)/         # Authenticated app
│   ├── api/                 # API routes
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                  # Reusable UI components (shadcn)
│   ├── features/            # Feature-specific components
│   │   ├── groups/         # Group management
│   │   ├── contributions/  # Contribution tracking
│   │   └── payouts/        # Payout management
│   └── layout/             # Layout components
├── lib/
│   ├── stellar/            # Stellar/Soroban integration
│   │   ├── contract.ts    # Contract interactions
│   │   ├── wallet.ts      # Wallet management
│   │   └── transactions.ts # Transaction building
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── validations/        # Zod schemas
├── types/                   # TypeScript types
└── config/                  # Configuration files
```

### Data Flow

1. **User Action** → Component triggers action
2. **React Hook** → Custom hook processes request
3. **Contract Interaction** → Stellar SDK builds transaction
4. **Wallet Sign** → User approves in wallet
5. **Submit** → Transaction sent to network
6. **Query Invalidation** → React Query refetches data
7. **UI Update** → Components re-render with new data

### State Management Strategy

#### Server State (React Query)
- Contract data (groups, members, contributions)
- Network state (testnet/mainnet)
- Transaction status

#### Client State (Zustand)
```typescript
interface AppState {
  // Wallet
  wallet: {
    connected: boolean;
    publicKey: string | null;
    network: 'testnet' | 'mainnet';
  };
  
  // UI Preferences
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
  };
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

## Key Features & Implementation

### 1. Wallet Integration

**Wallet Providers**
- Freighter (primary)
- Lobstr (secondary)
- Abstract wallet interface for extensibility

**Connection Flow**
```typescript
async function connectWallet() {
  // 1. Check if Freighter is installed
  if (!window.freighter) {
    throw new Error('Please install Freighter wallet');
  }
  
  // 2. Request network
  const network = await freighter.getNetwork();
  
  // 3. Request public key
  const publicKey = await freighter.getPublicKey();
  
  // 4. Store in state
  setWallet({ connected: true, publicKey, network });
}
```

### 2. Group Management

**Create Group Flow**
```typescript
interface CreateGroupParams {
  contributionAmount: string;  // In XLM
  cycleDuration: number;       // In seconds
  maxMembers: number;
  metadata?: {
    name: string;
    description: string;
    rules: string;
  };
}

async function createGroup(params: CreateGroupParams) {
  // 1. Validate inputs
  const validated = createGroupSchema.parse(params);
  
  // 2. Build transaction
  const tx = await buildCreateGroupTx(validated);
  
  // 3. Sign with wallet
  const signed = await signTransaction(tx);
  
  // 4. Submit to network
  const result = await submitTransaction(signed);
  
  // 5. Wait for confirmation
  await pollTransaction(result.hash);
  
  // 6. Invalidate queries
  queryClient.invalidateQueries(['groups']);
  
  return result;
}
```

**Group Dashboard**
- List of user's groups
- Group status (active, complete, cancelled)
- Quick actions (contribute, view details)
- Filtering and sorting

### 3. Contribution Tracking

**Contribute Flow**
```typescript
async function contribute(groupId: number) {
  // 1. Get group data
  const group = await getGroup(groupId);
  
  // 2. Validate can contribute
  if (group.isComplete) throw new Error('Group complete');
  if (hasContributed(groupId, group.currentCycle)) {
    throw new Error('Already contributed this cycle');
  }
  
  // 3. Build and submit transaction
  const tx = await buildContributeTx(groupId);
  const result = await signAndSubmit(tx);
  
  // 4. Update UI
  queryClient.invalidateQueries(['group', groupId]);
  toast.success('Contribution successful!');
}
```

**Contribution Status Display**
- Visual progress bars
- Member contribution grid
- Cycle timeline
- Pending/Complete indicators

### 4. Real-time Updates

**Polling Strategy**
```typescript
const { data: group } = useQuery({
  queryKey: ['group', groupId],
  queryFn: () => getGroupFromContract(groupId),
  refetchInterval: 30000, // 30 seconds
  refetchIntervalInBackground: false,
});
```

**Event Subscription** (Future)
- Subscribe to contract events
- WebSocket connection for real-time updates
- Push notifications for important events

## Security Considerations

### 1. Transaction Signing
- Never expose private keys
- All signing happens in wallet extension
- Display transaction details before signing

### 2. Input Validation
- Client-side validation with Zod
- Server-side validation on API routes
- Sanitize user inputs

### 3. Amount Handling
- Use BigNumber for precise calculations
- Display amounts in XLM (human-readable)
- Store as stroops internally (1 XLM = 10^7 stroops)

### 4. Network Selection
- Clearly indicate testnet vs mainnet
- Warning when switching networks
- Separate contract IDs for each network

## Performance Optimization

### 1. Code Splitting
- Route-based splitting (automatic with Next.js)
- Component lazy loading
- Dynamic imports for heavy dependencies

### 2. Caching
- React Query cache (5 minutes default)
- Browser cache for static assets
- Service worker for offline support (future)

### 3. Data Fetching
- Parallel queries where possible
- Prefetch on hover for navigation
- Optimistic updates for instant feedback

### 4. Asset Optimization
- Image optimization with next/image
- Font optimization
- Bundle size monitoring

## Accessibility

- **WCAG 2.1 AA** compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
- Semantic HTML

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile-First Approach
- Design for mobile, enhance for desktop
- Touch-friendly targets (min 44x44px)
- Simplified navigation on mobile
- Progressive enhancement

## Error Handling

### Error Types
1. **Network Errors** - RPC failures, timeouts
2. **Contract Errors** - Validation failures, auth errors
3. **Wallet Errors** - User rejection, insufficient balance
4. **Validation Errors** - Form input errors

### Error Display
```typescript
function handleError(error: Error) {
  if (error instanceof ContractError) {
    toast.error(`Contract error: ${error.message}`);
  } else if (error instanceof WalletError) {
    toast.error('Please check your wallet');
  } else {
    toast.error('An unexpected error occurred');
    console.error(error);
  }
}
```

## Testing Strategy

### Unit Tests
- Utility functions
- Hooks
- Validation schemas

### Component Tests
- UI components in isolation
- User interactions
- Accessibility checks

### Integration Tests
- Feature workflows
- API route handlers
- Contract interactions (mocked)

### E2E Tests
- Critical user paths
- Group creation → contribution → payout
- Error scenarios
- Cross-browser testing

## Deployment

### Hosting
- **Vercel** (recommended) - Optimized for Next.js
- Automatic deployments from Git
- Preview deployments for PRs
- Edge network for global performance

### Environment Variables
```bash
# Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ID=CXXXXXXXXXX

# RPC Endpoints
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Build Process
1. Run tests (`npm test`)
2. Lint code (`npm run lint`)
3. Type check (`npm run type-check`)
4. Build (`npm run build`)
5. Deploy to Vercel

## Future Enhancements

### Phase 1 (MVP)
- Basic group management
- Contribution tracking
- Wallet integration
- Responsive design

### Phase 2
- Group metadata support
- Advanced filtering/search
- Transaction history
- Export functionality

### Phase 3
- Real-time updates via events
- Push notifications
- Multi-language support
- Mobile app (React Native)

### Phase 4
- Social features (invites, sharing)
- Analytics dashboard
- Integration with DeFi protocols
- Fiat on/off-ramps

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint + Prettier configuration
- Prefer functional components
- Use async/await over promises

### Git Workflow
- Feature branches from `main`
- Conventional commits
- Pull request reviews required
- Squash merge to main

### Documentation
- JSDoc for complex functions
- README for each feature module
- Storybook for component library
- API documentation for contract methods

## Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Docs](https://soroban.stellar.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

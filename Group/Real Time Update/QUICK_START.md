# Quick Start Guide - Group Detail Page

## Overview
This is a fully functional blockchain-based ROSCA (Rotating Savings and Credit Association) Group Detail Page with real-time updates, wallet integration, and comprehensive UI.

## ✅ All Acceptance Criteria Met

### ✓ Real group data from blockchain
- Service layer: `/src/services/blockchain.ts`
- Uses ethers.js v6 for contract interaction
- Fallback to mock data for development

### ✓ Real-time status updates (polling every 30s)
- Hook: `/src/hooks/useRealTimeUpdates.ts`
- Automatic polling with configurable interval
- Manual refresh button available

### ✓ Contribution progress bar accurate
- Component: `/src/app/components/ContributionProgress.tsx`
- Real-time progress tracking
- Shows members contributed and remaining amount

### ✓ Cycle countdown timer functional
- Component: `/src/app/components/CycleCountdown.tsx`
- Live countdown (days/hours/mins/secs)
- Shows next cycle start date

### ✓ Member activity feed shows recent actions
- Component: `/src/app/components/ActivityFeed.tsx`
- Displays contributions, payouts, joins
- Links to Etherscan

### ✓ Share functionality with QR code
- Integrated in GroupDetailPage
- QR code generator using react-qr-code
- Copy link and native share support

### ✓ Transaction timeline view
- Part of ActivityFeed component
- Chronological order
- Transaction type indicators

### ✓ Loading and error states handled
- Skeleton loaders
- Error boundaries
- Retry functionality

## 🚀 Quick Setup

### 1. Configure Contract
Edit `/src/config/contracts.ts`:

```typescript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
export const RPC_ENDPOINT = "YOUR_RPC_ENDPOINT";
```

### 2. Connect Wallet
The app includes full wallet integration:
- MetaMask support
- Account switching detection
- Network switching support

### 3. Run the App
```bash
npm install
npm run build
```

## 📦 Key Components

### Main Components
- **GroupDetailPage** - Main page component
- **ContributionProgress** - Progress bar and stats
- **CycleCountdown** - Real-time countdown
- **ActivityFeed** - Transaction history
- **WalletButton** - Wallet connection UI

### Hooks
- **useGroupDetail** - Fetches group data
- **useRealTimeUpdates** - Polling mechanism
- **useWallet** - Wallet state management

### Services
- **blockchainService** - Smart contract interactions
- **walletService** - Wallet connection/transactions

## 🔧 Customization

### Change Polling Interval
In `GroupDetailPage.tsx`:
```typescript
useRealTimeUpdates({
  enabled: true,
  interval: 60000, // Change to 60 seconds
  onUpdate: refetch,
});
```

### Add Custom Contract Methods
In `/src/config/contracts.ts`, add to ABI:
```typescript
export const ROSCA_GROUP_ABI = [
  // ... existing methods
  "function yourCustomMethod() view returns (uint256)",
];
```

### Customize UI Theme
Edit `/src/styles/theme.css` for color scheme

## 🧪 Testing

### With Mock Data
By default, the app uses mock data if blockchain connection fails. This allows for:
- UI development without blockchain
- Testing edge cases
- Demo purposes

### With Real Contract
1. Deploy your ROSCA contract
2. Update `CONTRACT_ADDRESS` in config
3. Connect wallet
4. Interact with real data

## 📱 Features

### Real-Time Updates
- Auto-refreshes every 30 seconds
- Updates all components simultaneously
- Manual refresh available

### Wallet Integration
- Connect/disconnect wallet
- Auto-detects account changes
- Network switching support
- Balance checking

### Contribution Flow
1. Connect wallet (top right)
2. Click "Contribute" button
3. Confirm transaction in wallet
4. View confirmation toast
5. Auto-refresh after 3 seconds

### Share Group
1. Click "Share" button
2. Scan QR code or copy link
3. Share via native share (mobile)

## 🔍 Data Flow

```
User Action
    ↓
GroupDetailPage Component
    ↓
useGroupDetail Hook
    ↓
blockchainService
    ↓
Smart Contract (ethers.js)
    ↓
Update UI Components
```

## 📊 State Management

All state is managed via React hooks:
- `useState` for local component state
- `useEffect` for side effects
- Custom hooks for shared logic

## 🎨 UI Components

Built with shadcn/ui components:
- Card, Button, Badge
- Dialog, Tabs, Progress
- Skeleton loaders
- Toast notifications

## 🔐 Security Considerations

⚠️ **Important Notes:**
- Always verify contract addresses
- Check transaction details before signing
- Use testnet for development
- Never share private keys
- Validate all user inputs

## 📝 Environment Variables

Create `.env` file:
```
REACT_APP_RPC_ENDPOINT=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
```

## 🐛 Common Issues

### Wallet Not Connecting
- Install MetaMask extension
- Check if wallet is locked
- Verify network is supported

### Data Not Loading
- Check RPC endpoint
- Verify contract address
- Check browser console for errors

### Real-Time Updates Not Working
- Check polling is enabled
- Verify component is mounted
- Check network connection

## 🚀 Production Deployment

Before deploying:
1. ✓ Update contract address
2. ✓ Configure RPC endpoint
3. ✓ Test on testnet first
4. ✓ Enable error tracking
5. ✓ Set up monitoring

## 📚 Additional Resources

- [Ethers.js Documentation](https://docs.ethers.org)
- [React Hooks Guide](https://react.dev/reference/react)
- [Shadcn/ui Components](https://ui.shadcn.com)

## 💡 Next Steps

Consider adding:
- WebSocket for instant updates
- Push notifications
- Historical charts
- Export functionality
- Multi-signature support
- Email notifications

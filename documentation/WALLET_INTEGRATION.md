# Wallet Integration Guide

This guide explains how to use the wallet connection components for Freighter and Albedo wallet integration.

## Components

### WalletConnect

The main reusable wallet connection component that handles Freighter and Albedo wallet integration.

#### Features

- ✅ Detects available wallets (Freighter & Albedo)
- ✅ Shows wallet selection UI
- ✅ Handles connection errors gracefully
- ✅ Emits wallet address on successful connection
- ✅ Persists connection state in localStorage
- ✅ Network selection support (testnet, mainnet, futurenet)
- ✅ Fully accessible with ARIA labels
- ✅ Comprehensive unit tests

#### Usage

```tsx
import { WalletConnect } from './components/WalletConnect';

function App() {
  const handleConnect = (address: string) => {
    console.log('Connected to:', address);
  };

  const handleDisconnect = () => {
    console.log('Disconnected');
  };

  const handleError = (error: string) => {
    console.error('Error:', error);
  };

  return (
    <WalletConnect
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
      onError={handleError}
      showNetworkSelector={true}
    />
  );
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onConnect` | `(address: string) => void` | No | - | Callback when wallet connects successfully |
| `onDisconnect` | `() => void` | No | - | Callback when wallet disconnects |
| `onError` | `(error: string) => void` | No | - | Callback when an error occurs |
| `className` | `string` | No | `''` | Additional CSS classes |
| `showNetworkSelector` | `boolean` | No | `false` | Show network selection dropdown |

### useWallet Hook

A custom React hook that manages wallet connection state and provides wallet operations.

#### Features

- Wallet detection (Freighter & Albedo)
- Connection management
- State persistence
- Error handling
- Network selection

#### Usage

```tsx
import { useWallet } from './hooks/useWallet';

function MyComponent() {
  const {
    walletState,
    isLoading,
    error,
    availableWallets,
    connect,
    disconnect,
    isConnected,
    address,
    walletType,
    network,
  } = useWallet();

  const handleConnect = async () => {
    const result = await connect({
      walletType: 'freighter',
      network: 'testnet',
    });

    if (result.success) {
      console.log('Connected:', result.address);
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect</button>
      )}
    </div>
  );
}
```

#### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `walletState` | `WalletState` | Complete wallet state object |
| `isLoading` | `boolean` | Loading state during connection |
| `error` | `WalletError \| null` | Current error if any |
| `availableWallets` | `WalletInfo[]` | List of detected wallets |
| `connect` | `(params: ConnectWalletParams) => Promise<WalletConnectionResult>` | Connect to a wallet |
| `disconnect` | `() => void` | Disconnect current wallet |
| `detectWallets` | `() => WalletInfo[]` | Detect available wallets |
| `isConnected` | `boolean` | Connection status |
| `address` | `string \| null` | Connected wallet address |
| `walletType` | `WalletType \| null` | Type of connected wallet |
| `network` | `'testnet' \| 'mainnet' \| 'futurenet'` | Current network |

## Types

### WalletType

```typescript
type WalletType = 'freighter' | 'albedo';
```

### WalletState

```typescript
interface WalletState {
  isConnected: boolean;
  address: string | null;
  walletType: WalletType | null;
  network: 'testnet' | 'mainnet' | 'futurenet';
  publicKey: string | null;
}
```

### WalletError

```typescript
interface WalletError {
  code: string;
  message: string;
  walletType?: WalletType;
}
```

### WalletInfo

```typescript
interface WalletInfo {
  name: string;
  type: WalletType;
  icon?: string;
  isInstalled: boolean;
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `WALLET_NOT_INSTALLED` | The selected wallet is not installed |
| `CONNECTION_FAILED` | Failed to connect to the wallet |
| `INVALID_WALLET_TYPE` | Invalid wallet type specified |

## Testing

The wallet integration includes comprehensive unit tests:

```bash
# Run all wallet tests
npm test -- useWallet.test.ts WalletConnect.test.tsx --run

# Run hook tests only
npm test -- useWallet.test.ts --run

# Run component tests only
npm test -- WalletConnect.test.tsx --run
```

### Test Coverage

- ✅ Initial state
- ✅ Wallet detection
- ✅ Freighter connection
- ✅ Albedo connection
- ✅ Disconnection
- ✅ State persistence
- ✅ Network selection
- ✅ Error handling
- ✅ UI interactions
- ✅ Accessibility

## Wallet Installation

### Freighter

Freighter is a browser extension wallet for Stellar.

- [Chrome Web Store](https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/freighter/)
- [Official Website](https://www.freighter.app/)

### Albedo

Albedo is a web-based wallet for Stellar that doesn't require installation.

- [Official Website](https://albedo.link/)
- [Documentation](https://albedo.link/docs)

## Best Practices

1. **Always check wallet availability** before attempting to connect
2. **Handle errors gracefully** and provide clear feedback to users
3. **Persist connection state** to improve user experience
4. **Use network selection** when supporting multiple networks
5. **Test with both wallets** to ensure compatibility
6. **Provide installation links** when wallets are not detected

## Example: Full Integration

```tsx
import React from 'react';
import { WalletConnect } from './components/WalletConnect';
import { useWallet } from './hooks/useWallet';

function App() {
  const { isConnected, address, walletType } = useWallet();

  return (
    <div className="app">
      <header>
        <h1>Soroban Ajo</h1>
        <WalletConnect
          onConnect={(addr) => console.log('Connected:', addr)}
          onDisconnect={() => console.log('Disconnected')}
          onError={(err) => console.error('Error:', err)}
          showNetworkSelector={true}
        />
      </header>

      {isConnected && (
        <main>
          <p>Welcome! Your wallet is connected.</p>
          <p>Address: {address}</p>
          <p>Wallet: {walletType}</p>
        </main>
      )}
    </div>
  );
}

export default App;
```

## Troubleshooting

### Wallet not detected

- Ensure the wallet extension is installed and enabled
- Refresh the page after installing the wallet
- Check browser console for errors

### Connection fails

- Make sure the wallet is unlocked
- Check that you're on the correct network
- Verify the wallet has permission to connect to the site

### State not persisting

- Check that localStorage is enabled in the browser
- Verify that the domain is not blocking localStorage
- Clear browser cache and try again

## Contributing

When contributing to the wallet integration:

1. Add tests for new features
2. Update type definitions
3. Document new props/methods
4. Test with both Freighter and Albedo
5. Ensure accessibility compliance

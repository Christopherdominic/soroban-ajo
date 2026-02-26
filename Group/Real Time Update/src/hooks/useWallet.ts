import { useState, useEffect } from 'react';
import { walletService, WalletState } from '../services/wallet';

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            const network = await (window as any).ethereum.request({
              method: 'eth_chainId',
            });
            
            setWalletState({
              address: accounts[0],
              isConnected: true,
              chainId: parseInt(network, 16),
            });
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      }
    };

    checkConnection();

    // Set up event listeners
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletState({
          address: null,
          isConnected: false,
          chainId: null,
        });
      } else {
        setWalletState((prev) => ({
          ...prev,
          address: accounts[0],
          isConnected: true,
        }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      setWalletState((prev) => ({
        ...prev,
        chainId: parseInt(chainId, 16),
      }));
      // Reload page on chain change (recommended by MetaMask)
      window.location.reload();
    };

    walletService.onAccountsChanged(handleAccountsChanged);
    walletService.onChainChanged(handleChainChanged);

    return () => {
      walletService.removeListeners();
    };
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const state = await walletService.connectWallet();
      setWalletState(state);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Error connecting wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    await walletService.disconnectWallet();
    setWalletState({
      address: null,
      isConnected: false,
      chainId: null,
    });
  };

  return {
    ...walletState,
    isConnecting,
    error,
    connect,
    disconnect,
  };
}

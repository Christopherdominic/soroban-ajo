import { useState, useEffect, useCallback } from 'react';
import {
    WalletState,
    WalletError,
    ConnectWalletParams,
    WalletConnectionResult,
    WalletInfo,
} from '../types/wallet';

const STORAGE_KEY = 'soroban_ajo_wallet';

const initialState: WalletState = {
    isConnected: false,
    address: null,
    walletType: null,
    network: 'testnet',
    publicKey: null,
};

export const useWallet = () => {
    const [walletState, setWalletState] = useState<WalletState>(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<WalletError | null>(null);

    // Check if wallets are installed
    const detectWallets = useCallback((): WalletInfo[] => {
        const wallets: WalletInfo[] = [
            {
                name: 'Freighter',
                type: 'freighter',
                isInstalled: typeof window !== 'undefined' && !!window.freighter,
            },
            {
                name: 'Albedo',
                type: 'albedo',
                isInstalled: typeof window !== 'undefined' && !!window.albedo,
            },
        ];
        return wallets;
    }, []);

    // Load saved wallet connection from localStorage
    useEffect(() => {
        const savedWallet = localStorage.getItem(STORAGE_KEY);
        if (savedWallet) {
            try {
                const parsed = JSON.parse(savedWallet);
                setWalletState(parsed);
            } catch (err) {
                console.error('Failed to parse saved wallet state:', err);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    // Save wallet state to localStorage
    const saveWalletState = useCallback((state: WalletState) => {
        if (state.isConnected) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    // Connect to Freighter wallet
    const connectFreighter = useCallback(
        async (): Promise<WalletConnectionResult> => {
            if (!window.freighter) {
                return {
                    success: false,
                    error: {
                        code: 'WALLET_NOT_INSTALLED',
                        message: 'Freighter wallet is not installed. Please install it from the Chrome Web Store.',
                        walletType: 'freighter',
                    },
                };
            }

            try {
                const publicKey = await window.freighter.getPublicKey();
                const walletNetwork = await window.freighter.getNetwork();

                const newState: WalletState = {
                    isConnected: true,
                    address: publicKey,
                    walletType: 'freighter',
                    network: walletNetwork as 'testnet' | 'mainnet' | 'futurenet',
                    publicKey,
                };

                setWalletState(newState);
                saveWalletState(newState);

                return {
                    success: true,
                    address: publicKey,
                    publicKey,
                };
            } catch (err: any) {
                const walletError: WalletError = {
                    code: err.code || 'CONNECTION_FAILED',
                    message: err.message || 'Failed to connect to Freighter wallet',
                    walletType: 'freighter',
                };
                return {
                    success: false,
                    error: walletError,
                };
            }
        },
        [saveWalletState]
    );

    // Connect to Albedo wallet
    const connectAlbedo = useCallback(
        async (network: string = 'testnet'): Promise<WalletConnectionResult> => {
            if (!window.albedo) {
                return {
                    success: false,
                    error: {
                        code: 'WALLET_NOT_INSTALLED',
                        message: 'Albedo wallet is not available. Please ensure you have access to Albedo.',
                        walletType: 'albedo',
                    },
                };
            }

            try {
                const result = await window.albedo.publicKey({ require_existing: false });
                const publicKey = result.pubkey;

                const newState: WalletState = {
                    isConnected: true,
                    address: publicKey,
                    walletType: 'albedo',
                    network: network as 'testnet' | 'mainnet' | 'futurenet',
                    publicKey,
                };

                setWalletState(newState);
                saveWalletState(newState);

                return {
                    success: true,
                    address: publicKey,
                    publicKey,
                };
            } catch (err: any) {
                const walletError: WalletError = {
                    code: err.code || 'CONNECTION_FAILED',
                    message: err.message || 'Failed to connect to Albedo wallet',
                    walletType: 'albedo',
                };
                return {
                    success: false,
                    error: walletError,
                };
            }
        },
        [saveWalletState]
    );

    // Main connect function
    const connect = useCallback(
        async ({ walletType, network = 'testnet' }: ConnectWalletParams): Promise<WalletConnectionResult> => {
            setIsLoading(true);
            setError(null);

            let result: WalletConnectionResult;

            if (walletType === 'freighter') {
                result = await connectFreighter();
            } else if (walletType === 'albedo') {
                result = await connectAlbedo(network);
            } else {
                result = {
                    success: false,
                    error: {
                        code: 'INVALID_WALLET_TYPE',
                        message: 'Invalid wallet type specified',
                    },
                };
            }

            if (!result.success && result.error) {
                setError(result.error);
            }

            setIsLoading(false);
            return result;
        },
        [connectFreighter, connectAlbedo]
    );

    // Disconnect wallet
    const disconnect = useCallback(() => {
        setWalletState(initialState);
        setError(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // Get available wallets
    const availableWallets = detectWallets();

    return {
        // State
        walletState,
        isLoading,
        error,
        availableWallets,

        // Actions
        connect,
        disconnect,
        detectWallets,

        // Computed
        isConnected: walletState.isConnected,
        address: walletState.address,
        walletType: walletState.walletType,
        network: walletState.network,
    };
};

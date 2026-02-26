'use client'
import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { WalletType } from '../types/wallet';
import Image from 'next/image';

interface WalletConnectProps {
    onConnect?: (address: string) => void;
    onDisconnect?: () => void;
    onError?: (error: string) => void;
    className?: string;
    showNetworkSelector?: boolean;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
    onConnect,
    onDisconnect,
    onError,
    className = '',
    showNetworkSelector = false,
}) => {
    const {
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

    const [showWalletSelection, setShowWalletSelection] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState<'testnet' | 'mainnet' | 'futurenet'>('testnet');

    // Notify parent component on connection
    useEffect(() => {
        if (isConnected && address && onConnect) {
            onConnect(address);
        }
    }, [isConnected, address, onConnect]);

    // Notify parent component on error
    useEffect(() => {
        if (error && onError) {
            onError(error.message);
        }
    }, [error, onError]);

    const handleWalletSelect = async (selectedWalletType: WalletType) => {
        const result = await connect({
            walletType: selectedWalletType,
            network: selectedNetwork,
        });

        if (result.success) {
            setShowWalletSelection(false);
        }
    };

    const handleDisconnect = () => {
        disconnect();
        if (onDisconnect) {
            onDisconnect();
        }
    };

    const formatAddress = (addr: string): string => {
        if (!addr) return '';
        return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    };

    const installedWallets = availableWallets.filter((w) => w.isInstalled);
    const hasInstalledWallets = installedWallets.length > 0;

    if (isConnected && address) {
        return (
            <div className={`wallet-connect-container ${className}`}>
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-sm font-medium text-green-800 dark:text-green-300">
                                Connected via {walletType === 'freighter' ? 'Freighter' : 'Albedo'}
                            </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 font-mono" title={address}>
                            {formatAddress(address)}
                        </div>
                        {showNetworkSelector && (
                            <div className="text-xs text-gray-500 mt-1">
                                Network: <span className="font-medium">{network}</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleDisconnect}
                        className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        aria-label="Disconnect wallet"
                    >
                        Disconnect
                    </button>
                </div>
            </div>
        );
    }

    return (
    <div className={`wallet-connect-container ${className}`}>
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
            <Image
                src="/logo-icon.svg"
                alt="Soroban Ajo"
                width={60}
                height={60}
                className="transition-transform duration-300 hover:scale-105"
                priority
            />
        </div>

        {!showWalletSelection ? (
                <div className="space-y-3">
                    <button
                        onClick={() => setShowWalletSelection(true)}
                        disabled={isLoading || !hasInstalledWallets}
                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        aria-label="Connect wallet"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Connecting...
                            </span>
                        ) : (
                            'Connect Wallet'
                        )}
                    </button>

                    {!hasInstalledWallets && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800 mb-2">No wallet detected</p>
                            <p className="text-xs text-yellow-700 mb-3">
                                Please install a Stellar wallet to continue:
                            </p>
                            <div className="space-y-2">
                                <a
                                    href="https://www.freighter.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-xs text-blue-600 hover:text-blue-700 underline"
                                >
                                    Install Freighter Wallet →
                                </a>
                                <a
                                    href="https://albedo.link/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-xs text-blue-600 hover:text-blue-700 underline"
                                >
                                    Learn about Albedo →
                                </a>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div
                            className="p-3 bg-red-50 border border-red-200 rounded-lg"
                            role="alert"
                            aria-live="polite"
                        >
                            <p className="text-sm text-red-800 font-medium mb-1">Connection Error</p>
                            <p className="text-xs text-red-700">{error.message}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Wallet</h3>
                        <button
                            onClick={() => setShowWalletSelection(false)}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Close wallet selection"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {showNetworkSelector && (
                        <div className="mb-4">
                            <label htmlFor="network-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Network
                            </label>
                            <select
                                id="network-select"
                                value={selectedNetwork}
                                onChange={(e) => setSelectedNetwork(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="testnet">Testnet</option>
                                <option value="mainnet">Mainnet</option>
                                <option value="futurenet">Futurenet</option>
                            </select>
                        </div>
                    )}

                    <div className="space-y-2">
                        {availableWallets.map((wallet) => (
                            <button
                                key={wallet.type}
                                onClick={() => handleWalletSelect(wallet.type)}
                                disabled={!wallet.isInstalled || isLoading}
                                className={`w-full p-4 border rounded-lg text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${wallet.isInstalled
                                    ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                    }`}
                                aria-label={`Connect with ${wallet.name}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{wallet.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {wallet.isInstalled ? 'Ready to connect' : 'Not installed'}
                                        </p>
                                    </div>
                                    {wallet.isInstalled && (
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWallet } from '../hooks/useWallet';
import type { FreighterAPI, AlbedoAPI } from '../types/wallet';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useWallet', () => {
    beforeEach(() => {
        localStorageMock.clear();
        delete (window as any).freighter;
        delete (window as any).albedo;
        vi.clearAllMocks();
    });

    describe('Initial State', () => {
        it('should initialize with disconnected state', () => {
            const { result } = renderHook(() => useWallet());

            expect(result.current.isConnected).toBe(false);
            expect(result.current.address).toBeNull();
            expect(result.current.walletType).toBeNull();
            expect(result.current.network).toBe('testnet');
        });

        it('should detect no wallets when none are installed', () => {
            const { result } = renderHook(() => useWallet());

            expect(result.current.availableWallets).toHaveLength(2);
            expect(result.current.availableWallets[0].isInstalled).toBe(false);
            expect(result.current.availableWallets[1].isInstalled).toBe(false);
        });
    });

    describe('Wallet Detection', () => {
        it('should detect Freighter wallet when installed', () => {
            (window as any).freighter = {
                isConnected: vi.fn(),
                getPublicKey: vi.fn(),
            };

            const { result } = renderHook(() => useWallet());
            const freighterWallet = result.current.availableWallets.find((w) => w.type === 'freighter');

            expect(freighterWallet?.isInstalled).toBe(true);
        });

        it('should detect Albedo wallet when available', () => {
            (window as any).albedo = {
                publicKey: vi.fn(),
            };

            const { result } = renderHook(() => useWallet());
            const albedoWallet = result.current.availableWallets.find((w) => w.type === 'albedo');

            expect(albedoWallet?.isInstalled).toBe(true);
        });

        it('should detect both wallets when both are installed', () => {
            (window as any).freighter = { getPublicKey: vi.fn() };
            (window as any).albedo = { publicKey: vi.fn() };

            const { result } = renderHook(() => useWallet());

            const installedWallets = result.current.availableWallets.filter((w) => w.isInstalled);
            expect(installedWallets).toHaveLength(2);
        });
    });

    describe('Freighter Connection', () => {
        const mockPublicKey = 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

        beforeEach(() => {
            const mockFreighter: Partial<FreighterAPI> = {
                getPublicKey: vi.fn().mockResolvedValue(mockPublicKey),
                getNetwork: vi.fn().mockResolvedValue('testnet'),
                isConnected: vi.fn().mockResolvedValue(true),
            };
            (window as any).freighter = mockFreighter;
        });

        it('should successfully connect to Freighter', async () => {
            const { result } = renderHook(() => useWallet());

            let connectionResult;
            await act(async () => {
                connectionResult = await result.current.connect({ walletType: 'freighter' });
            });

            expect(connectionResult).toEqual({
                success: true,
                address: mockPublicKey,
                publicKey: mockPublicKey,
            });
            expect(result.current.isConnected).toBe(true);
            expect(result.current.address).toBe(mockPublicKey);
            expect(result.current.walletType).toBe('freighter');
        });

        it('should save connection state to localStorage', async () => {
            const { result } = renderHook(() => useWallet());

            await act(async () => {
                await result.current.connect({ walletType: 'freighter' });
            });

            const savedState = localStorageMock.getItem('soroban_ajo_wallet');
            expect(savedState).toBeTruthy();

            const parsed = JSON.parse(savedState!);
            expect(parsed.isConnected).toBe(true);
            expect(parsed.address).toBe(mockPublicKey);
            expect(parsed.walletType).toBe('freighter');
        });

        it('should handle Freighter connection error', async () => {
            const errorMessage = 'User rejected connection';
            (window as any).freighter.getPublicKey = vi.fn().mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useWallet());

            let connectionResult;
            await act(async () => {
                connectionResult = await result.current.connect({ walletType: 'freighter' });
            });

            expect(connectionResult).toMatchObject({
                success: false,
                error: {
                    message: errorMessage,
                    walletType: 'freighter',
                },
            });
            expect(result.current.isConnected).toBe(false);
            expect(result.current.error).toBeTruthy();
        });

        it('should return error when Freighter is not installed', async () => {
            delete (window as any).freighter;

            const { result } = renderHook(() => useWallet());

            let connectionResult;
            await act(async () => {
                connectionResult = await result.current.connect({ walletType: 'freighter' });
            });

            expect(connectionResult).toMatchObject({
                success: false,
                error: {
                    code: 'WALLET_NOT_INSTALLED',
                    walletType: 'freighter',
                },
            });
        });
    });

    describe('Albedo Connection', () => {
        const mockPublicKey = 'GYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY';

        beforeEach(() => {
            const mockAlbedo: Partial<AlbedoAPI> = {
                publicKey: vi.fn().mockResolvedValue({ pubkey: mockPublicKey }),
            };
            (window as any).albedo = mockAlbedo;
        });

        it('should successfully connect to Albedo', async () => {
            const { result } = renderHook(() => useWallet());

            let connectionResult;
            await act(async () => {
                connectionResult = await result.current.connect({ walletType: 'albedo' });
            });

            expect(connectionResult).toEqual({
                success: true,
                address: mockPublicKey,
                publicKey: mockPublicKey,
            });
            expect(result.current.isConnected).toBe(true);
            expect(result.current.address).toBe(mockPublicKey);
            expect(result.current.walletType).toBe('albedo');
        });

        it('should handle Albedo connection error', async () => {
            const errorMessage = 'User cancelled';
            (window as any).albedo.publicKey = vi.fn().mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useWallet());

            let connectionResult;
            await act(async () => {
                connectionResult = await result.current.connect({ walletType: 'albedo' });
            });

            expect(connectionResult).toMatchObject({
                success: false,
                error: {
                    message: errorMessage,
                    walletType: 'albedo',
                },
            });
            expect(result.current.isConnected).toBe(false);
        });

        it('should return error when Albedo is not available', async () => {
            delete (window as any).albedo;

            const { result } = renderHook(() => useWallet());

            let connectionResult;
            await act(async () => {
                connectionResult = await result.current.connect({ walletType: 'albedo' });
            });

            expect(connectionResult).toMatchObject({
                success: false,
                error: {
                    code: 'WALLET_NOT_INSTALLED',
                    walletType: 'albedo',
                },
            });
        });
    });

    describe('Disconnect', () => {
        const mockPublicKey = 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

        beforeEach(() => {
            const mockFreighter: Partial<FreighterAPI> = {
                getPublicKey: vi.fn().mockResolvedValue(mockPublicKey),
                getNetwork: vi.fn().mockResolvedValue('testnet'),
            };
            (window as any).freighter = mockFreighter;
        });

        it('should disconnect wallet and clear state', async () => {
            const { result } = renderHook(() => useWallet());

            await act(async () => {
                await result.current.connect({ walletType: 'freighter' });
            });

            expect(result.current.isConnected).toBe(true);

            act(() => {
                result.current.disconnect();
            });

            expect(result.current.isConnected).toBe(false);
            expect(result.current.address).toBeNull();
            expect(result.current.walletType).toBeNull();
            expect(result.current.error).toBeNull();
        });

        it('should remove wallet state from localStorage on disconnect', async () => {
            const { result } = renderHook(() => useWallet());

            await act(async () => {
                await result.current.connect({ walletType: 'freighter' });
            });

            expect(localStorageMock.getItem('soroban_ajo_wallet')).toBeTruthy();

            act(() => {
                result.current.disconnect();
            });

            expect(localStorageMock.getItem('soroban_ajo_wallet')).toBeNull();
        });
    });

    describe('Persistence', () => {
        it('should restore wallet state from localStorage on mount', () => {
            const savedState = {
                isConnected: true,
                address: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                walletType: 'freighter',
                network: 'testnet',
                publicKey: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            };

            localStorageMock.setItem('soroban_ajo_wallet', JSON.stringify(savedState));

            const { result } = renderHook(() => useWallet());

            expect(result.current.isConnected).toBe(true);
            expect(result.current.address).toBe(savedState.address);
            expect(result.current.walletType).toBe('freighter');
        });

        it('should handle corrupted localStorage data gracefully', () => {
            localStorageMock.setItem('soroban_ajo_wallet', 'invalid json');

            const { result } = renderHook(() => useWallet());

            expect(result.current.isConnected).toBe(false);
            expect(localStorageMock.getItem('soroban_ajo_wallet')).toBeNull();
        });
    });

    describe('Network Selection', () => {
        const mockPublicKey = 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

        beforeEach(() => {
            const mockFreighter: Partial<FreighterAPI> = {
                getPublicKey: vi.fn().mockResolvedValue(mockPublicKey),
                getNetwork: vi.fn().mockResolvedValue('mainnet'),
            };
            (window as any).freighter = mockFreighter;
        });

        it('should connect with specified network', async () => {
            const { result } = renderHook(() => useWallet());

            await act(async () => {
                await result.current.connect({ walletType: 'freighter', network: 'mainnet' });
            });

            expect(result.current.network).toBe('mainnet');
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid wallet type', async () => {
            const { result } = renderHook(() => useWallet());

            let connectionResult;
            await act(async () => {
                connectionResult = await result.current.connect({ walletType: 'invalid' as any });
            });

            expect(connectionResult).toMatchObject({
                success: false,
                error: {
                    code: 'INVALID_WALLET_TYPE',
                },
            });
        });

        it('should clear error on successful connection', async () => {
            const mockFreighter: Partial<FreighterAPI> = {
                getPublicKey: vi.fn()
                    .mockRejectedValueOnce(new Error('First attempt failed'))
                    .mockResolvedValueOnce('GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
                getNetwork: vi.fn().mockResolvedValue('testnet'),
            };
            (window as any).freighter = mockFreighter;

            const { result } = renderHook(() => useWallet());

            // First attempt - should fail
            await act(async () => {
                await result.current.connect({ walletType: 'freighter' });
            });
            expect(result.current.error).toBeTruthy();

            // Second attempt - should succeed and clear error
            await act(async () => {
                await result.current.connect({ walletType: 'freighter' });
            });
            expect(result.current.error).toBeNull();
            expect(result.current.isConnected).toBe(true);
        });
    });
});

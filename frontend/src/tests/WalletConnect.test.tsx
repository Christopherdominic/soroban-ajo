import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WalletConnect } from '../components/WalletConnect';
import * as walletHook from '../hooks/useWallet';

// Mock the useWallet hook
vi.mock('../hooks/useWallet');

describe('WalletConnect Component', () => {
    const mockConnect = vi.fn();
    const mockDisconnect = vi.fn();
    const mockDetectWallets = vi.fn();

    const defaultMockWalletState = {
        walletState: {
            isConnected: false,
            address: null,
            walletType: null,
            network: 'testnet' as const,
            publicKey: null,
        },
        isLoading: false,
        error: null,
        availableWallets: [
            { name: 'Freighter', type: 'freighter' as const, isInstalled: true },
            { name: 'Albedo', type: 'albedo' as const, isInstalled: true },
        ],
        connect: mockConnect,
        disconnect: mockDisconnect,
        detectWallets: mockDetectWallets,
        isConnected: false,
        address: null,
        walletType: null,
        network: 'testnet' as const,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(walletHook.useWallet).mockReturnValue(defaultMockWalletState);
    });

    describe('Disconnected State', () => {
        it('should render connect button when disconnected', () => {
            render(<WalletConnect />);
            expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
        });

        it('should show wallet selection when connect button is clicked', () => {
            render(<WalletConnect />);

            const connectButton = screen.getByRole('button', { name: /connect wallet/i });
            fireEvent.click(connectButton);

            expect(screen.getByText('Select Wallet')).toBeInTheDocument();
            expect(screen.getByText('Freighter')).toBeInTheDocument();
            expect(screen.getByText('Albedo')).toBeInTheDocument();
        });

        it('should display available wallets with installation status', () => {
            render(<WalletConnect />);

            fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));

            expect(screen.getAllByText('Ready to connect')).toHaveLength(2);
        });

        it('should call connect with correct wallet type when wallet is selected', async () => {
            mockConnect.mockResolvedValue({ success: true, address: 'GXXX...XXX' });

            render(<WalletConnect />);

            fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));
            fireEvent.click(screen.getByRole('button', { name: /connect with freighter/i }));

            await waitFor(() => {
                expect(mockConnect).toHaveBeenCalledWith({
                    walletType: 'freighter',
                    network: 'testnet',
                });
            });
        });

        it('should show loading state during connection', () => {
            vi.mocked(walletHook.useWallet).mockReturnValue({
                ...defaultMockWalletState,
                isLoading: true,
            });

            render(<WalletConnect />);

            expect(screen.getByText('Connecting...')).toBeInTheDocument();
        });

        it('should disable connect button when no wallets are installed', () => {
            vi.mocked(walletHook.useWallet).mockReturnValue({
                ...defaultMockWalletState,
                availableWallets: [
                    { name: 'Freighter', type: 'freighter' as const, isInstalled: false },
                    { name: 'Albedo', type: 'albedo' as const, isInstalled: false },
                ],
            });

            render(<WalletConnect />);

            const connectButton = screen.getByRole('button', { name: /connect wallet/i });
            expect(connectButton).toBeDisabled();
        });

        it('should show installation instructions when no wallets are detected', () => {
            vi.mocked(walletHook.useWallet).mockReturnValue({
                ...defaultMockWalletState,
                availableWallets: [
                    { name: 'Freighter', type: 'freighter' as const, isInstalled: false },
                    { name: 'Albedo', type: 'albedo' as const, isInstalled: false },
                ],
            });

            render(<WalletConnect />);

            expect(screen.getByText('No wallet detected')).toBeInTheDocument();
            expect(screen.getByText(/install a stellar wallet/i)).toBeInTheDocument();
        });
    });

    describe('Connected State', () => {
        const mockAddress = 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

        beforeEach(() => {
            vi.mocked(walletHook.useWallet).mockReturnValue({
                ...defaultMockWalletState,
                walletState: {
                    isConnected: true,
                    address: mockAddress,
                    walletType: 'freighter',
                    network: 'testnet',
                    publicKey: mockAddress,
                },
                isConnected: true,
                address: mockAddress,
                walletType: 'freighter',
            });
        });

        it('should display connected state with formatted address', () => {
            render(<WalletConnect />);

            expect(screen.getByText(/connected via freighter/i)).toBeInTheDocument();
            expect(screen.getByText('GXXX...XXXX')).toBeInTheDocument();
        });

        it('should show disconnect button when connected', () => {
            render(<WalletConnect />);

            expect(screen.getByRole('button', { name: /disconnect wallet/i })).toBeInTheDocument();
        });

        it('should call disconnect when disconnect button is clicked', () => {
            render(<WalletConnect />);

            const disconnectButton = screen.getByRole('button', { name: /disconnect wallet/i });
            fireEvent.click(disconnectButton);

            expect(mockDisconnect).toHaveBeenCalled();
        });

        it('should display full address in title attribute', () => {
            render(<WalletConnect />);

            const addressElement = screen.getByTitle(mockAddress);
            expect(addressElement).toBeInTheDocument();
        });

        it('should call onConnect callback when connected', () => {
            const onConnect = vi.fn();

            render(<WalletConnect onConnect={onConnect} />);

            expect(onConnect).toHaveBeenCalledWith(mockAddress);
        });

        it('should call onDisconnect callback when disconnected', () => {
            const onDisconnect = vi.fn();

            render(<WalletConnect onDisconnect={onDisconnect} />);

            const disconnectButton = screen.getByRole('button', { name: /disconnect wallet/i });
            fireEvent.click(disconnectButton);

            expect(onDisconnect).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        it('should display error message when connection fails', () => {
            const errorMessage = 'User rejected connection';
            vi.mocked(walletHook.useWallet).mockReturnValue({
                ...defaultMockWalletState,
                error: {
                    code: 'CONNECTION_FAILED',
                    message: errorMessage,
                    walletType: 'freighter',
                },
            });

            render(<WalletConnect />);

            expect(screen.getByText('Connection Error')).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        it('should call onError callback when error occurs', () => {
            const onError = vi.fn();
            const errorMessage = 'Connection failed';

            vi.mocked(walletHook.useWallet).mockReturnValue({
                ...defaultMockWalletState,
                error: {
                    code: 'CONNECTION_FAILED',
                    message: errorMessage,
                },
            });

            render(<WalletConnect onError={onError} />);

            expect(onError).toHaveBeenCalledWith(errorMessage);
        });

        it('should show error with proper ARIA attributes', () => {
            vi.mocked(walletHook.useWallet).mockReturnValue({
                ...defaultMockWalletState,
                error: {
                    code: 'CONNECTION_FAILED',
                    message: 'Error occurred',
                },
            });

            render(<WalletConnect />);

            const errorAlert = screen.getByRole('alert');
            expect(errorAlert).toHaveAttribute('aria-live', 'polite');
        });
    });

    describe('Network Selection', () => {
        it('should show network selector when showNetworkSelector is true', () => {
            render(<WalletConnect showNetworkSelector={true} />);

            fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));

            expect(screen.getByLabelText('Network')).toBeInTheDocument();
        });

        it('should not show network selector by default', () => {
            render(<WalletConnect />);

            fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));

            expect(screen.queryByLabelText('Network')).not.toBeInTheDocument();
        });

        it('should allow network selection before connecting', async () => {
            mockConnect.mockResolvedValue({ success: true });

            render(<WalletConnect showNetworkSelector={true} />);

            fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));

            const networkSelect = screen.getByLabelText('Network');
            fireEvent.change(networkSelect, { target: { value: 'mainnet' } });

            fireEvent.click(screen.getByRole('button', { name: /connect with freighter/i }));

            await waitFor(() => {
                expect(mockConnect).toHaveBeenCalledWith({
                    walletType: 'freighter',
                    network: 'mainnet',
                });
            });
        });

        it('should display current network when connected and showNetworkSelector is true', () => {
            vi.mocked(walletHook.useWallet).mockReturnValue({
                ...defaultMockWalletState,
                walletState: {
                    isConnected: true,
                    address: 'GXXX',
                    walletType: 'freighter',
                    network: 'mainnet',
                    publicKey: 'GXXX',
                },
                isConnected: true,
                address: 'GXXX',
                network: 'mainnet',
            });

            render(<WalletConnect showNetworkSelector={true} />);

            expect(screen.getByText('mainnet')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels on buttons', () => {
            render(<WalletConnect />);

            expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
        });

        it('should have proper ARIA label on close button', () => {
            render(<WalletConnect />);

            fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));

            expect(screen.getByRole('button', { name: /close wallet selection/i })).toBeInTheDocument();
        });

        it('should disable wallet buttons that are not installed', () => {
            vi.mocked(walletHook.useWallet).mockReturnValue({
                ...defaultMockWalletState,
                availableWallets: [
                    { name: 'Freighter', type: 'freighter' as const, isInstalled: true },
                    { name: 'Albedo', type: 'albedo' as const, isInstalled: false },
                ],
            });

            render(<WalletConnect />);

            fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));

            const albedoButton = screen.getByRole('button', { name: /connect with albedo/i });
            expect(albedoButton).toBeDisabled();
        });
    });

    describe('Custom Styling', () => {
        it('should apply custom className', () => {
            const { container } = render(<WalletConnect className="custom-class" />);

            expect(container.querySelector('.custom-class')).toBeInTheDocument();
        });
    });

    describe('Wallet Selection UI', () => {
        it('should close wallet selection when close button is clicked', () => {
            render(<WalletConnect />);

            fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));
            expect(screen.getByText('Select Wallet')).toBeInTheDocument();

            fireEvent.click(screen.getByRole('button', { name: /close wallet selection/i }));
            expect(screen.queryByText('Select Wallet')).not.toBeInTheDocument();
        });

        it('should close wallet selection after successful connection', async () => {
            mockConnect.mockResolvedValue({ success: true, address: 'GXXX' });

            render(<WalletConnect />);

            fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));
            fireEvent.click(screen.getByRole('button', { name: /connect with freighter/i }));

            await waitFor(() => {
                expect(screen.queryByText('Select Wallet')).not.toBeInTheDocument();
            });
        });

        it('should show installation links for uninstalled wallets', () => {
            vi.mocked(walletHook.useWallet).mockReturnValue({
                ...defaultMockWalletState,
                availableWallets: [
                    { name: 'Freighter', type: 'freighter' as const, isInstalled: false },
                    { name: 'Albedo', type: 'albedo' as const, isInstalled: false },
                ],
            });

            render(<WalletConnect />);

            expect(screen.getByText(/install freighter wallet/i)).toBeInTheDocument();
            expect(screen.getByText(/learn about albedo/i)).toBeInTheDocument();
        });
    });
});

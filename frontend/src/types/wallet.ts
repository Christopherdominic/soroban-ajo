// Wallet type definitions for Freighter and Albedo integration

export type WalletType = 'freighter' | 'albedo';

export interface WalletInfo {
    name: string;
    type: WalletType;
    icon?: string;
    isInstalled: boolean;
}

export interface WalletState {
    isConnected: boolean;
    address: string | null;
    walletType: WalletType | null;
    network: 'testnet' | 'mainnet' | 'futurenet';
    publicKey: string | null;
}

export interface WalletError {
    code: string;
    message: string;
    walletType?: WalletType;
}

export interface ConnectWalletParams {
    walletType: WalletType;
    network?: 'testnet' | 'mainnet' | 'futurenet';
}

export interface WalletConnectionResult {
    success: boolean;
    address?: string;
    publicKey?: string;
    error?: WalletError;
}

// Freighter API types
export interface FreighterAPI {
    isConnected: () => Promise<boolean>;
    getPublicKey: () => Promise<string>;
    getNetwork: () => Promise<string>;
    signTransaction: (xdr: string, opts?: { network?: string; networkPassphrase?: string }) => Promise<string>;
}

// Albedo API types
export interface AlbedoAPI {
    publicKey: (params: { require_existing?: boolean }) => Promise<{ pubkey: string; signed_message?: string }>;
    tx: (params: { xdr: string; network?: string; submit?: boolean }) => Promise<{ signed_envelope_xdr: string; tx_hash?: string }>;
    trust: (params: { asset_code: string; asset_issuer: string; limit?: string }) => Promise<{ pubkey: string }>;
}

declare global {
    interface Window {
        freighter?: FreighterAPI;
        albedo?: AlbedoAPI;
    }
}

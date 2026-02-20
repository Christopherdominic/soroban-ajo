/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Vite Environment
  readonly MODE: 'development' | 'staging' | 'production' | 'test';
  
  // Application
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;

  // Stellar Network
  readonly VITE_STELLAR_NETWORK: 'testnet' | 'mainnet' | 'futurenet';
  readonly VITE_SOROBAN_RPC_URL: string;
  readonly VITE_HORIZON_URL: string;
  readonly VITE_STELLAR_NETWORK_PASSPHRASE: string;

  // Contract
  readonly VITE_SOROBAN_CONTRACT_ID: string;
  readonly VITE_CONTRACT_NETWORK: 'testnet' | 'mainnet' | 'futurenet';

  // Wallet
  readonly VITE_DEFAULT_WALLET: 'freighter' | 'albedo';
  readonly VITE_WALLET_AUTO_CONNECT: string;

  // API
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;

  // Feature Flags
  readonly VITE_DEBUG: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_ERROR_REPORTING: string;
  readonly VITE_MAINTENANCE_MODE: string;

  // UI
  readonly VITE_DEFAULT_THEME: 'light' | 'dark' | 'system';
  readonly VITE_ENABLE_ANIMATIONS: string;
  readonly VITE_ITEMS_PER_PAGE: string;

  // Transactions
  readonly VITE_TX_TIMEOUT: string;
  readonly VITE_MAX_TX_FEE: string;
  readonly VITE_DEFAULT_SLIPPAGE: string;

  // Monitoring
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_GA_ID?: string;
  readonly VITE_MIXPANEL_TOKEN?: string;

  // Development
  readonly VITE_ENABLE_DEVTOOLS: string;
  readonly VITE_ENABLE_REDUX_DEVTOOLS: string;
  readonly VITE_LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';

  // Security
  readonly VITE_HTTPS: string;
  readonly VITE_CORS_ORIGINS: string;

  // Performance
  readonly VITE_ENABLE_SW: string;
  readonly VITE_CACHE_DURATION: string;
  
  // Caching
  readonly VITE_CACHE_ENABLED?: string;
  readonly VITE_CACHE_DEFAULT_TTL?: string;
  readonly VITE_CACHE_MAX_SIZE?: string;
  readonly VITE_CACHE_STALE_WHILE_REVALIDATE?: string;

  // Links
  readonly VITE_GITHUB_URL?: string;
  readonly VITE_DISCORD_URL?: string;
  readonly VITE_TWITTER_URL?: string;
  readonly VITE_DOCS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global type declarations
declare const __APP_ENV__: string;
declare const __APP_VERSION__: string;

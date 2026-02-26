// Polling and update intervals
export const POLLING_INTERVAL = 30000; // 30 seconds
export const COUNTDOWN_UPDATE_INTERVAL = 1000; // 1 second
export const REFRESH_DELAY_AFTER_TX = 3000; // 3 seconds

// Display constants
export const MAX_ACTIVITY_ITEMS = 10;
export const SHORT_ADDRESS_LENGTH = 4;
export const QR_CODE_SIZE = 200;

// Time constants
export const SECONDS_PER_DAY = 86400;
export const MILLISECONDS_PER_SECOND = 1000;

// Status constants
export const GROUP_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const TRANSACTION_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  FAILED: 'failed',
} as const;

export const TRANSACTION_TYPE = {
  CONTRIBUTION: 'contribution',
  PAYOUT: 'payout',
  JOIN: 'join',
  CREATE: 'create',
} as const;

// Chain IDs
export const CHAIN_IDS = {
  ETHEREUM_MAINNET: 1,
  GOERLI: 5,
  SEPOLIA: 11155111,
  POLYGON: 137,
  MUMBAI: 80001,
  BSC: 56,
  BSC_TESTNET: 97,
  ARBITRUM: 42161,
  ARBITRUM_GOERLI: 421613,
  OPTIMISM: 10,
  OPTIMISM_GOERLI: 420,
} as const;

// Progress thresholds
export const PROGRESS_THRESHOLDS = {
  ALMOST_COMPLETE: 75,
  COMPLETE: 100,
} as const;

// Time thresholds
export const TIME_THRESHOLDS = {
  ENDING_SOON_HOURS: 24,
  RECENT_MINUTES: 60,
  RECENT_HOURS: 24,
} as const;

// UI Messages
export const MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  ALREADY_CONTRIBUTED: 'You have already contributed this cycle',
  CONTRIBUTION_SUCCESS: 'Contribution submitted successfully',
  CONTRIBUTION_FAILED: 'Failed to submit contribution',
  DATA_REFRESHED: 'Group data refreshed',
  LINK_COPIED: 'Link copied to clipboard',
  ADDRESS_COPIED: 'Address copied to clipboard',
  WALLET_CONNECTED: 'Wallet connected successfully',
  WALLET_DISCONNECTED: 'Wallet disconnected',
  WALLET_CONNECTION_FAILED: 'Failed to connect wallet',
} as const;

// Blockchain explorer URLs
export const EXPLORER_URLS: Record<number, string> = {
  [CHAIN_IDS.ETHEREUM_MAINNET]: 'https://etherscan.io',
  [CHAIN_IDS.GOERLI]: 'https://goerli.etherscan.io',
  [CHAIN_IDS.SEPOLIA]: 'https://sepolia.etherscan.io',
  [CHAIN_IDS.POLYGON]: 'https://polygonscan.com',
  [CHAIN_IDS.MUMBAI]: 'https://mumbai.polygonscan.com',
  [CHAIN_IDS.BSC]: 'https://bscscan.com',
  [CHAIN_IDS.BSC_TESTNET]: 'https://testnet.bscscan.com',
  [CHAIN_IDS.ARBITRUM]: 'https://arbiscan.io',
  [CHAIN_IDS.OPTIMISM]: 'https://optimistic.etherscan.io',
};

export function getExplorerUrl(chainId: number, type: 'tx' | 'address', hash: string): string {
  const baseUrl = EXPLORER_URLS[chainId] || EXPLORER_URLS[CHAIN_IDS.ETHEREUM_MAINNET];
  return `${baseUrl}/${type}/${hash}`;
}

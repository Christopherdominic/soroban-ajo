/** Supported Stellar wallet providers */
export type WalletProvider = 'freighter' | 'albedo' | 'xbull'

/** Network the wallet is connected to */
export type StellarNetwork = 'testnet' | 'mainnet'

/** Represents an authenticated user session */
export interface AuthSession {
  /** Stellar public key (address) */
  address: string
  /** Wallet provider used for authentication */
  provider: WalletProvider
  /** Network the session is connected to */
  network: StellarNetwork
  /** ISO timestamp when the session was created */
  createdAt: string
  /** ISO timestamp when the session expires */
  expiresAt: string
  /** Opaque session token (encrypted before storage) */
  token: string
  /** Refresh token for session renewal */
  refreshToken: string
  /** Whether the user opted for persistent login */
  rememberMe: boolean
}

/** Stored session data shape (encrypted payload in storage) */
export interface StoredSession {
  /** Encrypted session payload */
  payload: string
  /** Initialization vector for decryption */
  iv: string
  /** Timestamp of last activity (for idle timeout) */
  lastActivity: number
  /** Device fingerprint for multi-device tracking */
  deviceId: string
}

/** Auth state exposed to the application */
export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  address: string | null
  network: StellarNetwork
  provider: WalletProvider | null
  session: AuthSession | null
  error: string | null
}

/** Actions available on the auth store */
export interface AuthActions {
  login: (params: LoginParams) => Promise<void>
  logout: () => Promise<void>
  logoutAllDevices: () => Promise<void>
  refreshSession: () => Promise<boolean>
  setNetwork: (network: StellarNetwork) => void
  setRememberMe: (remember: boolean) => void
  clearError: () => void
  checkSession: () => Promise<void>
}

/** Parameters required to initiate login */
export interface LoginParams {
  provider: WalletProvider
  rememberMe?: boolean
}

/** Result from a wallet signature request */
export interface WalletSignatureResult {
  address: string
  signature: string
  network: StellarNetwork
}

/** Configuration for session management */
export interface SessionConfig {
  /** Session duration in milliseconds (default: 30 min) */
  sessionDuration: number
  /** Extended session duration when "remember me" is checked (default: 7 days) */
  rememberMeDuration: number
  /** Idle timeout before session is invalidated (default: 15 min) */
  idleTimeout: number
  /** How often to check session validity in ms (default: 60s) */
  checkInterval: number
  /** Storage key prefix */
  storagePrefix: string
}

/** Token pair returned after authentication */
export interface TokenPair {
  token: string
  refreshToken: string
  expiresAt: string
}

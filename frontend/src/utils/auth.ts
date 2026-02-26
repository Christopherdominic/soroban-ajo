/**
 * Authentication utilities for wallet-based authentication
 * 
 * In a blockchain app, the wallet address serves as the user's identity.
 * Authentication is verified through wallet signatures.
 */

export interface AuthSession {
  address: string
  isAuthenticated: boolean
  connectedAt: string
  network: 'testnet' | 'mainnet'
}

const SESSION_KEY = 'soroban_ajo_auth_session'

export class AuthService {
  /**
   * Create authentication session
   */
  static createSession(address: string, network: 'testnet' | 'mainnet' = 'testnet'): AuthSession {
    const session: AuthSession = {
      address,
      isAuthenticated: true,
      connectedAt: new Date().toISOString(),
      network,
    }

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch (error) {
      console.error('Failed to save session:', error)
    }

    return session
  }

  /**
   * Get current session
   */
  static getSession(): AuthSession | null {
    try {
      const data = localStorage.getItem(SESSION_KEY)
      if (!data) return null

      const session = JSON.parse(data) as AuthSession
      
      // Validate session (could add expiry check here)
      if (!session.address || !session.isAuthenticated) {
        return null
      }

      return session
    } catch (error) {
      console.error('Failed to load session:', error)
      return null
    }
  }

  /**
   * Clear session (logout)
   */
  static clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.error('Failed to clear session:', error)
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const session = this.getSession()
    return session !== null && session.isAuthenticated
  }

  /**
   * Get authenticated user address
   */
  static getAuthenticatedAddress(): string | null {
    const session = this.getSession()
    return session?.address || null
  }

  /**
   * Verify wallet ownership (simplified)
   * In production, this would verify a signature from the wallet
   */
  static async verifyWalletOwnership(address: string): Promise<boolean> {
    try {
      // In production, you would:
      // 1. Generate a challenge message
      // 2. Request wallet to sign the message
      // 3. Verify the signature matches the address
      
      // For now, we assume wallet connection = verified
      return address.length > 0 && address.startsWith('G')
    } catch (error) {
      console.error('Wallet verification failed:', error)
      return false
    }
  }

  /**
   * Require authentication middleware
   * Throws error if not authenticated
   */
  static requireAuth(): string {
    const address = this.getAuthenticatedAddress()
    
    if (!address) {
      throw new Error('Authentication required. Please connect your wallet.')
    }

    return address
  }

  /**
   * Update session network
   */
  static updateNetwork(network: 'testnet' | 'mainnet'): void {
    const session = this.getSession()
    
    if (session) {
      session.network = network
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }
  }
}

/**
 * React hook for authentication
 */
export const useAuthSession = () => {
  const session = AuthService.getSession()

  const login = (address: string, network: 'testnet' | 'mainnet' = 'testnet') => {
    return AuthService.createSession(address, network)
  }

  const logout = () => {
    AuthService.clearSession()
  }

  return {
    session,
    isAuthenticated: session?.isAuthenticated || false,
    address: session?.address || null,
    network: session?.network || 'testnet',
    login,
    logout,
  }
}

export default AuthService

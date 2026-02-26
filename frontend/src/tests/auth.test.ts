/**
 * Authentication Service Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { AuthService } from '../utils/auth'

describe('AuthService', () => {
  const testAddress = 'GABC123TEST456ADDRESS789'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Session Management', () => {
    it('should create authentication session', () => {
      const session = AuthService.createSession(testAddress, 'testnet')

      expect(session.address).toBe(testAddress)
      expect(session.isAuthenticated).toBe(true)
      expect(session.network).toBe('testnet')
      expect(session.connectedAt).toBeDefined()
    })

    it('should persist session to localStorage', () => {
      AuthService.createSession(testAddress, 'testnet')

      const stored = localStorage.getItem('soroban_ajo_auth_session')
      expect(stored).not.toBeNull()

      const session = JSON.parse(stored!)
      expect(session.address).toBe(testAddress)
    })

    it('should retrieve existing session', () => {
      AuthService.createSession(testAddress, 'testnet')

      const session = AuthService.getSession()
      expect(session).not.toBeNull()
      expect(session?.address).toBe(testAddress)
    })

    it('should return null for non-existent session', () => {
      const session = AuthService.getSession()
      expect(session).toBeNull()
    })

    it('should clear session', () => {
      AuthService.createSession(testAddress, 'testnet')
      expect(AuthService.getSession()).not.toBeNull()

      AuthService.clearSession()
      expect(AuthService.getSession()).toBeNull()
    })

    it('should update network', () => {
      AuthService.createSession(testAddress, 'testnet')

      AuthService.updateNetwork('mainnet')

      const session = AuthService.getSession()
      expect(session?.network).toBe('mainnet')
    })
  })

  describe('Authentication Checks', () => {
    it('should return false when not authenticated', () => {
      expect(AuthService.isAuthenticated()).toBe(false)
    })

    it('should return true when authenticated', () => {
      AuthService.createSession(testAddress, 'testnet')
      expect(AuthService.isAuthenticated()).toBe(true)
    })

    it('should return null address when not authenticated', () => {
      expect(AuthService.getAuthenticatedAddress()).toBeNull()
    })

    it('should return address when authenticated', () => {
      AuthService.createSession(testAddress, 'testnet')
      expect(AuthService.getAuthenticatedAddress()).toBe(testAddress)
    })

    it('should require authentication', () => {
      AuthService.createSession(testAddress, 'testnet')

      const address = AuthService.requireAuth()
      expect(address).toBe(testAddress)
    })

    it('should throw error when authentication required but not authenticated', () => {
      expect(() => AuthService.requireAuth()).toThrow('Authentication required')
    })
  })

  describe('Wallet Verification', () => {
    it('should verify valid Stellar address', async () => {
      const isValid = await AuthService.verifyWalletOwnership('GABC123TEST')
      expect(isValid).toBe(true)
    })

    it('should reject invalid address', async () => {
      const isValid = await AuthService.verifyWalletOwnership('invalid')
      expect(isValid).toBe(false)
    })

    it('should reject empty address', async () => {
      const isValid = await AuthService.verifyWalletOwnership('')
      expect(isValid).toBe(false)
    })
  })

  describe('Session Validation', () => {
    it('should validate session structure', () => {
      AuthService.createSession(testAddress, 'testnet')

      const session = AuthService.getSession()
      expect(session).toHaveProperty('address')
      expect(session).toHaveProperty('isAuthenticated')
      expect(session).toHaveProperty('connectedAt')
      expect(session).toHaveProperty('network')
    })

    it('should reject invalid session data', () => {
      // Store invalid session
      localStorage.setItem('soroban_ajo_auth_session', JSON.stringify({
        address: '',
        isAuthenticated: false,
      }))

      const session = AuthService.getSession()
      expect(session).toBeNull()
    })

    it('should handle corrupted session data', () => {
      localStorage.setItem('soroban_ajo_auth_session', 'invalid-json')

      const session = AuthService.getSession()
      expect(session).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage errors on save', () => {
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = () => {
        throw new Error('Storage full')
      }

      // Should not throw, but log error
      expect(() => AuthService.createSession(testAddress)).not.toThrow()

      Storage.prototype.setItem = originalSetItem
    })

    it('should handle localStorage errors on read', () => {
      const originalGetItem = Storage.prototype.getItem
      Storage.prototype.getItem = () => {
        throw new Error('Storage error')
      }

      const session = AuthService.getSession()
      expect(session).toBeNull()

      Storage.prototype.getItem = originalGetItem
    })

    it('should handle localStorage errors on clear', () => {
      const originalRemoveItem = Storage.prototype.removeItem
      Storage.prototype.removeItem = () => {
        throw new Error('Storage error')
      }

      // Should not throw
      expect(() => AuthService.clearSession()).not.toThrow()

      Storage.prototype.removeItem = originalRemoveItem
    })
  })

  describe('Multiple Sessions', () => {
    it('should replace existing session', () => {
      const address1 = 'GABC111'
      const address2 = 'GABC222'

      AuthService.createSession(address1, 'testnet')
      AuthService.createSession(address2, 'mainnet')

      const session = AuthService.getSession()
      expect(session?.address).toBe(address2)
      expect(session?.network).toBe('mainnet')
    })
  })
})

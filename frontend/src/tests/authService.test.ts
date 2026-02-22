import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { authService, AuthError } from '../services/authService'
import type { WalletSignatureResult } from '../types/auth'

// Mock crypto.subtle for Node/jsdom environment
const mockEncrypt = vi.fn().mockResolvedValue(new ArrayBuffer(32))
const mockDecrypt = vi.fn().mockResolvedValue(new TextEncoder().encode('{}'))
const mockDeriveKey = vi.fn().mockResolvedValue({})
const mockImportKey = vi.fn().mockResolvedValue({})

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()

  Object.defineProperty(globalThis, 'crypto', {
    value: {
      getRandomValues: (arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256)
        return arr
      },
      subtle: {
        encrypt: mockEncrypt,
        decrypt: mockDecrypt,
        deriveKey: mockDeriveKey,
        importKey: mockImportKey,
      },
    },
    writable: true,
    configurable: true,
  })
})

afterEach(() => {
  authService.stopSessionMonitoring()
  vi.restoreAllMocks()
})

describe('AuthService', () => {
  describe('generateTokenPair', () => {
    it('generates unique tokens for each call', () => {
      const pair1 = authService.generateTokenPair(false)
      const pair2 = authService.generateTokenPair(false)

      expect(pair1.token).toBeTruthy()
      expect(pair1.refreshToken).toBeTruthy()
      expect(pair1.token).not.toBe(pair2.token)
      expect(pair1.refreshToken).not.toBe(pair2.refreshToken)
    })

    it('sets shorter expiration for non-remember-me sessions', () => {
      const shortSession = authService.generateTokenPair(false)
      const longSession = authService.generateTokenPair(true)

      const shortExpiry = new Date(shortSession.expiresAt).getTime()
      const longExpiry = new Date(longSession.expiresAt).getTime()

      expect(longExpiry).toBeGreaterThan(shortExpiry)
    })

    it('sets expiration in the future', () => {
      const pair = authService.generateTokenPair(false)
      const expiresAt = new Date(pair.expiresAt).getTime()

      expect(expiresAt).toBeGreaterThan(Date.now())
    })

    it('generates tokens of expected length', () => {
      const pair = authService.generateTokenPair(false)

      // 64 bytes => 128 hex chars
      expect(pair.token.length).toBe(128)
      expect(pair.refreshToken.length).toBe(128)
    })
  })

  describe('createSession', () => {
    it('builds a valid session from wallet result and tokens', () => {
      const walletResult: WalletSignatureResult = {
        address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV',
        signature: 'test-sig',
        network: 'testnet',
      }
      const tokens = authService.generateTokenPair(false)

      const session = authService.createSession(walletResult, tokens, false, 'freighter')

      expect(session.address).toBe(walletResult.address)
      expect(session.provider).toBe('freighter')
      expect(session.network).toBe('testnet')
      expect(session.token).toBe(tokens.token)
      expect(session.refreshToken).toBe(tokens.refreshToken)
      expect(session.rememberMe).toBe(false)
      expect(session.createdAt).toBeTruthy()
      expect(session.expiresAt).toBe(tokens.expiresAt)
    })

    it('respects rememberMe flag', () => {
      const walletResult: WalletSignatureResult = {
        address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV',
        signature: 'test-sig',
        network: 'mainnet',
      }
      const tokens = authService.generateTokenPair(true)

      const session = authService.createSession(walletResult, tokens, true, 'freighter')

      expect(session.rememberMe).toBe(true)
      expect(session.network).toBe('mainnet')
    })
  })

  describe('clearStoredSession', () => {
    it('removes all auth keys from both storage types', () => {
      localStorage.setItem('ajo_auth_session', 'data')
      localStorage.setItem('ajo_auth_address', 'addr')
      localStorage.setItem('ajo_auth_token_hint', 'hint')
      localStorage.setItem('ajo_auth_storage_type', 'local')
      sessionStorage.setItem('ajo_auth_session', 'data')

      authService.clearStoredSession()

      expect(localStorage.getItem('ajo_auth_session')).toBeNull()
      expect(localStorage.getItem('ajo_auth_address')).toBeNull()
      expect(localStorage.getItem('ajo_auth_token_hint')).toBeNull()
      expect(localStorage.getItem('ajo_auth_storage_type')).toBeNull()
      expect(sessionStorage.getItem('ajo_auth_session')).toBeNull()
    })
  })

  describe('loadSession', () => {
    it('returns null when no session is stored', async () => {
      const session = await authService.loadSession()
      expect(session).toBeNull()
    })

    it('returns null when address is missing', async () => {
      localStorage.setItem('ajo_auth_token_hint', 'hint')
      const session = await authService.loadSession()
      expect(session).toBeNull()
    })

    it('returns null when token hint is missing', async () => {
      localStorage.setItem('ajo_auth_address', 'GABCDEF')
      const session = await authService.loadSession()
      expect(session).toBeNull()
    })

    it('returns null and clears data on corrupted session', async () => {
      localStorage.setItem('ajo_auth_address', 'GABCDEF')
      localStorage.setItem('ajo_auth_token_hint', 'hint')
      localStorage.setItem('ajo_auth_storage_type', 'local')
      localStorage.setItem('ajo_auth_session', 'not-valid-json')

      const session = await authService.loadSession()

      expect(session).toBeNull()
      expect(localStorage.getItem('ajo_auth_session')).toBeNull()
    })
  })

  describe('requestWalletSignature', () => {
    it('throws AuthError for unsupported providers', async () => {
      await expect(
        authService.requestWalletSignature('albedo'),
      ).rejects.toThrow(AuthError)

      await expect(
        authService.requestWalletSignature('xbull'),
      ).rejects.toThrow(AuthError)
    })

    it('throws AuthError when Freighter is not installed', async () => {
      // Ensure no freighterApi on window
      delete (window as any).freighterApi

      await expect(
        authService.requestWalletSignature('freighter'),
      ).rejects.toThrow('Freighter wallet extension is not installed')
    })

    it('throws AuthError with correct code for missing wallet', async () => {
      delete (window as any).freighterApi

      try {
        await authService.requestWalletSignature('freighter')
      } catch (err) {
        expect(err).toBeInstanceOf(AuthError)
        expect((err as AuthError).code).toBe('WALLET_NOT_FOUND')
      }
    })

    it('throws AuthError with PROVIDER_NOT_SUPPORTED for unknown providers', async () => {
      try {
        await authService.requestWalletSignature('unknown' as any)
      } catch (err) {
        expect(err).toBeInstanceOf(AuthError)
        expect((err as AuthError).code).toBe('PROVIDER_NOT_SUPPORTED')
      }
    })

    it('connects to Freighter when available', async () => {
      const mockAddress = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV'
      ;(window as any).freighterApi = {
        isAllowed: vi.fn().mockResolvedValue(true),
        setAllowed: vi.fn().mockResolvedValue(undefined),
        getPublicKey: vi.fn().mockResolvedValue(mockAddress),
        getNetworkDetails: vi.fn().mockResolvedValue({ network: 'TESTNET' }),
        signAuthEntry: vi.fn().mockResolvedValue('signed-challenge'),
      }

      const result = await authService.requestWalletSignature('freighter')

      expect(result.address).toBe(mockAddress)
      expect(result.network).toBe('testnet')
      expect(result.signature).toBe('signed-challenge')
    })

    it('requests permission when Freighter is not yet allowed', async () => {
      const mockAddress = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV'
      const setAllowed = vi.fn().mockResolvedValue(undefined)

      ;(window as any).freighterApi = {
        isAllowed: vi.fn().mockResolvedValue(false),
        setAllowed,
        getPublicKey: vi.fn().mockResolvedValue(mockAddress),
        getNetworkDetails: vi.fn().mockResolvedValue({ network: 'TESTNET' }),
        signAuthEntry: vi.fn().mockResolvedValue('sig'),
      }

      await authService.requestWalletSignature('freighter')

      expect(setAllowed).toHaveBeenCalled()
    })

    it('detects mainnet from Freighter network details', async () => {
      const mockAddress = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV'
      ;(window as any).freighterApi = {
        isAllowed: vi.fn().mockResolvedValue(true),
        getPublicKey: vi.fn().mockResolvedValue(mockAddress),
        getNetworkDetails: vi.fn().mockResolvedValue({ network: 'PUBLIC' }),
        signAuthEntry: vi.fn().mockResolvedValue('sig'),
      }

      const result = await authService.requestWalletSignature('freighter')
      expect(result.network).toBe('mainnet')
    })

    it('falls back gracefully when signAuthEntry is unavailable', async () => {
      const mockAddress = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV'
      ;(window as any).freighterApi = {
        isAllowed: vi.fn().mockResolvedValue(true),
        getPublicKey: vi.fn().mockResolvedValue(mockAddress),
        getNetworkDetails: vi.fn().mockResolvedValue({ network: 'TESTNET' }),
        signAuthEntry: vi.fn().mockRejectedValue(new Error('not supported')),
      }

      const result = await authService.requestWalletSignature('freighter')

      expect(result.address).toBe(mockAddress)
      expect(result.signature).toBeTruthy()
    })

    it('rejects invalid Stellar addresses from wallet', async () => {
      ;(window as any).freighterApi = {
        isAllowed: vi.fn().mockResolvedValue(true),
        getPublicKey: vi.fn().mockResolvedValue('not-a-valid-address'),
        getNetworkDetails: vi.fn().mockResolvedValue({ network: 'TESTNET' }),
        signAuthEntry: vi.fn().mockResolvedValue('sig'),
      }

      await expect(
        authService.requestWalletSignature('freighter'),
      ).rejects.toThrow('Invalid Stellar address')
    })
  })

  describe('logoutAllDevices', () => {
    it('clears device list and session data', async () => {
      const address = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV'
      localStorage.setItem('ajo_auth_devices_' + address, '["device1"]')
      localStorage.setItem('ajo_auth_session', 'data')
      localStorage.setItem('ajo_auth_address', address)

      await authService.logoutAllDevices(address)

      expect(localStorage.getItem('ajo_auth_devices_' + address)).toBeNull()
      expect(localStorage.getItem('ajo_auth_session')).toBeNull()
      expect(localStorage.getItem('ajo_auth_address')).toBeNull()
    })
  })

  describe('session monitoring', () => {
    it('starts and stops without errors', () => {
      const onExpired = vi.fn()
      const onActivity = vi.fn()

      expect(() => {
        authService.startSessionMonitoring(onExpired, onActivity)
      }).not.toThrow()

      expect(() => {
        authService.stopSessionMonitoring()
      }).not.toThrow()
    })

    it('can be called multiple times safely', () => {
      const onExpired = vi.fn()
      const onActivity = vi.fn()

      authService.startSessionMonitoring(onExpired, onActivity)
      authService.startSessionMonitoring(onExpired, onActivity)
      authService.stopSessionMonitoring()
      authService.stopSessionMonitoring()
    })
  })

  describe('getConfig', () => {
    it('returns a frozen copy of the configuration', () => {
      const config = authService.getConfig()

      expect(config.sessionDuration).toBe(30 * 60 * 1000)
      expect(config.rememberMeDuration).toBe(7 * 24 * 60 * 60 * 1000)
      expect(config.idleTimeout).toBe(15 * 60 * 1000)
      expect(config.storagePrefix).toBe('ajo_auth')
    })
  })
})

describe('AuthError', () => {
  it('has the correct name and code', () => {
    const err = new AuthError('test message', 'TEST_CODE')

    expect(err.name).toBe('AuthError')
    expect(err.code).toBe('TEST_CODE')
    expect(err.message).toBe('test message')
    expect(err).toBeInstanceOf(Error)
  })
})

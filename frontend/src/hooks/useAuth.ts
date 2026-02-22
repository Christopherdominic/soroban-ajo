import { useCallback, useEffect, useRef } from 'react'
import { create } from 'zustand'
import { authService, AuthError } from '../services/authService'
import { analytics, trackUserAction } from '../services/analytics'
import type {
  AuthState,
  AuthActions,
  AuthSession,
  LoginParams,
  StellarNetwork,
  WalletProvider,
} from '../types/auth'

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>((set, get) => ({
  // --- State ---
  isAuthenticated: false,
  isLoading: false,
  address: null,
  network: 'testnet' as StellarNetwork,
  provider: null as WalletProvider | null,
  session: null as AuthSession | null,
  error: null as string | null,

  // --- Actions ---

  login: async ({ provider, rememberMe = false }: LoginParams) => {
    set({ isLoading: true, error: null })

    try {
      const walletResult = await authService.requestWalletSignature(provider)
      const tokens = authService.generateTokenPair(rememberMe)
      const session = authService.createSession(
        walletResult,
        tokens,
        rememberMe,
        provider,
      )

      await authService.saveSession(session)

      analytics.setUserId(session.address)
      trackUserAction.walletConnected(provider)

      set({
        isAuthenticated: true,
        isLoading: false,
        address: session.address,
        network: session.network,
        provider: session.provider,
        session,
        error: null,
      })
    } catch (err) {
      const message =
        err instanceof AuthError
          ? err.message
          : 'Failed to connect wallet. Please try again.'

      analytics.trackError(
        err instanceof Error ? err : new Error(String(err)),
        { provider },
        'high',
      )

      set({
        isAuthenticated: false,
        isLoading: false,
        address: null,
        provider: null,
        session: null,
        error: message,
      })

      throw err
    }
  },

  logout: async () => {
    const { address } = get()
    authService.stopSessionMonitoring()
    authService.clearStoredSession()

    if (address) {
      trackUserAction.walletDisconnected()
    }

    set({
      isAuthenticated: false,
      isLoading: false,
      address: null,
      provider: null,
      session: null,
      error: null,
    })
  },

  logoutAllDevices: async () => {
    const { address } = get()
    if (address) {
      await authService.logoutAllDevices(address)
      trackUserAction.walletDisconnected()
    }

    authService.stopSessionMonitoring()

    set({
      isAuthenticated: false,
      isLoading: false,
      address: null,
      provider: null,
      session: null,
      error: null,
    })
  },

  refreshSession: async (): Promise<boolean> => {
    const { session } = get()
    if (!session) return false

    try {
      const refreshed = await authService.refreshSession(session)
      if (!refreshed) {
        await get().logout()
        return false
      }

      set({ session: refreshed, error: null })
      return true
    } catch {
      await get().logout()
      return false
    }
  },

  setNetwork: (network: StellarNetwork) => {
    set({ network })
  },

  setRememberMe: (remember: boolean) => {
    const { session } = get()
    if (session) {
      const updated = { ...session, rememberMe: remember }
      set({ session: updated })
      authService.saveSession(updated)
    }
  },

  clearError: () => {
    set({ error: null })
  },

  checkSession: async () => {
    // Silent check - don't show loading UI on mount
    try {
      const session = await authService.loadSession()
      if (session) {
        analytics.setUserId(session.address)

        set({
          isAuthenticated: true,
          isLoading: false,
          address: session.address,
          network: session.network,
          provider: session.provider,
          session,
          error: null,
        })
      } else {
        set({
          isAuthenticated: false,
          isLoading: false,
          address: null,
          provider: null,
          session: null,
        })
      }
    } catch {
      set({
        isAuthenticated: false,
        isLoading: false,
        address: null,
        provider: null,
        session: null,
      })
    }
  },
}))

/**
 * Primary hook for accessing authentication state and actions.
 * Automatically restores persisted sessions on mount and starts
 * session monitoring (idle timeout, periodic validity checks).
 */
export function useAuth() {
  const store = useAuthStore()
  const monitoringStarted = useRef(false)

  const handleSessionExpired = useCallback(() => {
    useAuthStore.getState().logout()
  }, [])

  const handleActivity = useCallback(() => {
    // Activity is tracked inside authService.touchSession
  }, [])

  useEffect(() => {
    store.checkSession()
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (store.isAuthenticated && !monitoringStarted.current) {
      authService.startSessionMonitoring(handleSessionExpired, handleActivity)
      monitoringStarted.current = true
    }

    if (!store.isAuthenticated && monitoringStarted.current) {
      authService.stopSessionMonitoring()
      monitoringStarted.current = false
    }

    return () => {
      if (monitoringStarted.current) {
        authService.stopSessionMonitoring()
        monitoringStarted.current = false
      }
    }
  }, [store.isAuthenticated, handleSessionExpired, handleActivity])

  return {
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    address: store.address,
    network: store.network,
    provider: store.provider,
    session: store.session,
    error: store.error,
    login: store.login,
    logout: store.logout,
    logoutAllDevices: store.logoutAllDevices,
    refreshSession: store.refreshSession,
    setNetwork: store.setNetwork,
    setRememberMe: store.setRememberMe,
    clearError: store.clearError,
  }
}

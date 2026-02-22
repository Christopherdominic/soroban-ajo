import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { AuthProvider, useAuthContext } from '../context/AuthContext'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Login } from '../pages/Login'
import { useAuthStore } from '../hooks/useAuth'
import { authService } from '../services/authService'

// Mock authService to avoid real crypto/wallet calls
vi.mock('../services/authService', () => {
  const AuthError = class extends Error {
    code: string
    constructor(message: string, code: string) {
      super(message)
      this.name = 'AuthError'
      this.code = code
    }
  }

  return {
    AuthError,
    authService: {
      requestWalletSignature: vi.fn(),
      generateTokenPair: vi.fn().mockReturnValue({
        token: 'mock-token-abc123',
        refreshToken: 'mock-refresh-abc123',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      }),
      createSession: vi.fn().mockImplementation((walletResult, tokens, rememberMe, provider) => ({
        address: walletResult.address,
        provider,
        network: walletResult.network,
        createdAt: new Date().toISOString(),
        expiresAt: tokens.expiresAt,
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        rememberMe,
      })),
      saveSession: vi.fn().mockResolvedValue(undefined),
      loadSession: vi.fn().mockResolvedValue(null),
      refreshSession: vi.fn(),
      clearStoredSession: vi.fn(),
      logoutAllDevices: vi.fn().mockResolvedValue(undefined),
      touchSession: vi.fn().mockResolvedValue(undefined),
      startSessionMonitoring: vi.fn(),
      stopSessionMonitoring: vi.fn(),
      getConfig: vi.fn().mockReturnValue({
        sessionDuration: 30 * 60 * 1000,
        rememberMeDuration: 7 * 24 * 60 * 60 * 1000,
        idleTimeout: 15 * 60 * 1000,
        checkInterval: 60 * 1000,
        storagePrefix: 'ajo_auth',
      }),
    },
  }
})

// Mock analytics to prevent side effects
vi.mock('../services/analytics', () => ({
  analytics: {
    setUserId: vi.fn(),
    trackEvent: vi.fn(),
    trackError: vi.fn(),
    trackMetric: vi.fn(),
  },
  trackUserAction: {
    walletConnected: vi.fn(),
    walletDisconnected: vi.fn(),
  },
}))

function resetAuthStore() {
  useAuthStore.setState({
    isAuthenticated: false,
    isLoading: false,
    address: null,
    network: 'testnet',
    provider: null,
    session: null,
    error: null,
  })
}

function renderWithAuth(ui: React.ReactElement) {
  return render(<AuthProvider>{ui}</AuthProvider>)
}

/** Helper component that displays auth state for testing */
function AuthStateDisplay() {
  const { isAuthenticated, address, network, error } = useAuthContext()
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</span>
      <span data-testid="auth-address">{address ?? 'none'}</span>
      <span data-testid="auth-network">{network}</span>
      {error && <span data-testid="auth-error">{error}</span>}
    </div>
  )
}

beforeEach(() => {
  resetAuthStore()
  vi.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
})

describe('AuthContext & useAuthContext', () => {
  it('provides default unauthenticated state', async () => {
    renderWithAuth(<AuthStateDisplay />)

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('unauthenticated')
    })
    expect(screen.getByTestId('auth-address').textContent).toBe('none')
    expect(screen.getByTestId('auth-network').textContent).toBe('testnet')
  })

  it('throws when useAuthContext is used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<AuthStateDisplay />)).toThrow(
      'useAuthContext must be used within an AuthProvider',
    )

    spy.mockRestore()
  })

  it('checks for existing session on mount', async () => {
    renderWithAuth(<AuthStateDisplay />)

    await waitFor(() => {
      expect(authService.loadSession).toHaveBeenCalled()
    })
  })

  it('restores session from storage on mount', async () => {
    const mockSession = {
      address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV',
      provider: 'freighter' as const,
      network: 'testnet' as const,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      token: 'restored-token',
      refreshToken: 'restored-refresh',
      rememberMe: true,
    }

    vi.mocked(authService.loadSession).mockResolvedValueOnce(mockSession)

    renderWithAuth(<AuthStateDisplay />)

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('authenticated')
    })
    expect(screen.getByTestId('auth-address').textContent).toBe(mockSession.address)
  })
})

describe('ProtectedRoute', () => {
  it('shows loading state while auth is being checked', () => {
    useAuthStore.setState({ isLoading: true, isAuthenticated: false })

    renderWithAuth(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    )

    expect(screen.getByText('Checking authentication…')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('shows unauthenticated fallback when not logged in', async () => {
    useAuthStore.setState({ isLoading: false, isAuthenticated: false })

    renderWithAuth(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    )

    expect(screen.getByText('Authentication Required')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders children when authenticated', async () => {
    useAuthStore.setState({ isLoading: false, isAuthenticated: true, address: 'GABC' })

    renderWithAuth(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('accepts custom loading fallback', () => {
    useAuthStore.setState({ isLoading: true })

    renderWithAuth(
      <ProtectedRoute loadingFallback={<div>Custom Loading…</div>}>
        <div>Content</div>
      </ProtectedRoute>,
    )

    expect(screen.getByText('Custom Loading…')).toBeInTheDocument()
  })

  it('accepts custom unauthenticated fallback', () => {
    useAuthStore.setState({ isLoading: false, isAuthenticated: false })

    renderWithAuth(
      <ProtectedRoute unauthenticatedFallback={<div>Please log in</div>}>
        <div>Content</div>
      </ProtectedRoute>,
    )

    expect(screen.getByText('Please log in')).toBeInTheDocument()
  })
})

describe('Login page', () => {
  it('renders wallet connection options', () => {
    useAuthStore.setState({ isLoading: false, isAuthenticated: false })

    renderWithAuth(<Login />)

    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
    expect(screen.getByText('Freighter')).toBeInTheDocument()
    expect(screen.getByText('Albedo')).toBeInTheDocument()
    expect(screen.getByText('xBull')).toBeInTheDocument()
  })

  it('shows remember me checkbox', () => {
    useAuthStore.setState({ isLoading: false, isAuthenticated: false })

    renderWithAuth(<Login />)

    expect(screen.getByText('Remember me')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('toggles remember me checkbox', () => {
    useAuthStore.setState({ isLoading: false, isAuthenticated: false })

    renderWithAuth(<Login />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('displays error message when login fails', async () => {
    useAuthStore.setState({
      isLoading: false,
      isAuthenticated: false,
      error: 'Freighter wallet extension is not installed',
    })

    renderWithAuth(<Login />)

    expect(screen.getByText('Connection failed')).toBeInTheDocument()
    expect(screen.getByText('Freighter wallet extension is not installed')).toBeInTheDocument()
  })

  it('dismisses error when close button is clicked', async () => {
    useAuthStore.setState({
      isLoading: false,
      isAuthenticated: false,
      error: 'Some error',
    })

    renderWithAuth(<Login />)

    expect(screen.getByText('Some error')).toBeInTheDocument()

    const dismissButton = screen.getByLabelText('Dismiss error')
    fireEvent.click(dismissButton)

    await waitFor(() => {
      expect(screen.queryByText('Some error')).not.toBeInTheDocument()
    })
  })

  it('shows security note about private keys', () => {
    useAuthStore.setState({ isLoading: false, isAuthenticated: false })

    renderWithAuth(<Login />)

    expect(
      screen.getByText(/Your private keys never leave your wallet/),
    ).toBeInTheDocument()
  })
})

describe('useAuthStore', () => {
  it('starts with default state', () => {
    const state = useAuthStore.getState()

    expect(state.isAuthenticated).toBe(false)
    expect(state.address).toBeNull()
    expect(state.network).toBe('testnet')
    expect(state.provider).toBeNull()
    expect(state.session).toBeNull()
    expect(state.error).toBeNull()
  })

  it('clears error via clearError', () => {
    useAuthStore.setState({ error: 'some error' })
    useAuthStore.getState().clearError()

    expect(useAuthStore.getState().error).toBeNull()
  })

  it('sets network via setNetwork', () => {
    useAuthStore.getState().setNetwork('mainnet')
    expect(useAuthStore.getState().network).toBe('mainnet')

    useAuthStore.getState().setNetwork('testnet')
    expect(useAuthStore.getState().network).toBe('testnet')
  })

  it('logout clears all auth state', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      address: 'GABC',
      provider: 'freighter',
      session: {} as any,
    })

    await useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.address).toBeNull()
    expect(state.provider).toBeNull()
    expect(state.session).toBeNull()
    expect(authService.clearStoredSession).toHaveBeenCalled()
    expect(authService.stopSessionMonitoring).toHaveBeenCalled()
  })

  it('logoutAllDevices clears state and calls service', async () => {
    const address = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV'
    useAuthStore.setState({
      isAuthenticated: true,
      address,
      provider: 'freighter',
      session: {} as any,
    })

    await useAuthStore.getState().logoutAllDevices()

    expect(authService.logoutAllDevices).toHaveBeenCalledWith(address)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('refreshSession returns false when no session exists', async () => {
    useAuthStore.setState({ session: null })

    const result = await useAuthStore.getState().refreshSession()
    expect(result).toBe(false)
  })

  it('refreshSession updates session on success', async () => {
    const currentSession = {
      address: 'GABC',
      provider: 'freighter' as const,
      network: 'testnet' as const,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      token: 'old-token',
      refreshToken: 'old-refresh',
      rememberMe: false,
    }

    const refreshedSession = {
      ...currentSession,
      token: 'new-token',
      refreshToken: 'new-refresh',
    }

    useAuthStore.setState({ session: currentSession, isAuthenticated: true })
    vi.mocked(authService.refreshSession).mockResolvedValueOnce(refreshedSession)

    const result = await useAuthStore.getState().refreshSession()

    expect(result).toBe(true)
    expect(useAuthStore.getState().session?.token).toBe('new-token')
  })

  it('refreshSession logs out when service returns null', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      session: {
        address: 'GABC',
        provider: 'freighter',
        network: 'testnet',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 1000).toISOString(),
        token: 'tok',
        refreshToken: 'ref',
        rememberMe: false,
      } as any,
    })

    vi.mocked(authService.refreshSession).mockResolvedValueOnce(null)

    const result = await useAuthStore.getState().refreshSession()

    expect(result).toBe(false)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('login sets authenticated state on success', async () => {
    const mockAddress = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUV'

    vi.mocked(authService.requestWalletSignature).mockResolvedValueOnce({
      address: mockAddress,
      signature: 'sig',
      network: 'testnet',
    })

    await useAuthStore.getState().login({ provider: 'freighter', rememberMe: false })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.address).toBe(mockAddress)
    expect(state.provider).toBe('freighter')
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('login sets error state on failure', async () => {
    const { AuthError } = await import('../services/authService')
    vi.mocked(authService.requestWalletSignature).mockRejectedValueOnce(
      new AuthError('Wallet not found', 'WALLET_NOT_FOUND'),
    )

    await expect(
      useAuthStore.getState().login({ provider: 'freighter' }),
    ).rejects.toThrow()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBe('Wallet not found')
    expect(state.isLoading).toBe(false)
  })
})

import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import App from '@/App'
import { AuthProvider } from '@/context/AuthContext'

vi.mock('@/services/authService', () => ({
  AuthError: class extends Error {
    code: string
    constructor(message: string, code: string) {
      super(message)
      this.name = 'AuthError'
      this.code = code
    }
  },
  authService: {
    loadSession: vi.fn().mockResolvedValue(null),
    requestWalletSignature: vi.fn(),
    generateTokenPair: vi.fn(),
    createSession: vi.fn(),
    saveSession: vi.fn(),
    refreshSession: vi.fn(),
    clearStoredSession: vi.fn(),
    logoutAllDevices: vi.fn(),
    touchSession: vi.fn(),
    startSessionMonitoring: vi.fn(),
    stopSessionMonitoring: vi.fn(),
    getConfig: vi.fn().mockReturnValue({
      sessionDuration: 1800000,
      rememberMeDuration: 604800000,
      idleTimeout: 900000,
      checkInterval: 60000,
      storagePrefix: 'ajo_auth',
    }),
  },
}))

vi.mock('@/services/analytics', () => ({
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

describe('App', () => {
  it('renders the app header', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>,
    )
    await waitFor(() => {
      expect(screen.getByText('Soroban Ajo')).toBeInTheDocument()
    })
  })
})

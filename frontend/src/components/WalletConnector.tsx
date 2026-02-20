// Issue #19: Create wallet connection component
// Complexity: Trivial (100 pts)
// Status: Placeholder

import React, { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

export const WalletConnector: React.FC = () => {
  const { resolvedTheme } = useTheme()
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')

  const handleConnect = async () => {
    // TODO: Integrate with Freighter wallet
    // Steps:
    // 1. Check if Freighter is installed
    // 2. Request user to connect wallet
    // 3. Get user's public key
    // 4. Store in Zustand store
    // 5. Update connected state
    setConnected(true)
    setAddress('GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
  }

  return (
    <div className="theme-surface p-4" data-theme={resolvedTheme}>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
        Wallet Connection
      </h2>
      {connected ? (
        <div>
          <p style={{ color: 'var(--color-success)' }} className="mb-2">
            Connected ✓
          </p>
          <p className="text-sm break-all" style={{ color: 'var(--color-text-muted)' }}>
            {address}
          </p>
        </div>
      ) : (
        <button onClick={handleConnect} className="theme-btn">
          Connect Wallet
        </button>
      )}
    </div>
  )
}

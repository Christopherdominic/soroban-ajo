'use client'

import { useState, useEffect } from 'react'

export default function TestWalletPage() {
  const [freighterInstalled, setFreighterInstalled] = useState(false)
  const [freighterAllowed, setFreighterAllowed] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Freighter injects its API asynchronously, so we need to wait for it
    const checkFreighter = async () => {
      setChecking(true)
      
      // Wait up to 3 seconds for Freighter to load
      for (let i = 0; i < 30; i++) {
        if (typeof window !== 'undefined' && (window as any).freighterApi) {
          setFreighterInstalled(true)
          await checkFreighterPermission()
          setChecking(false)
          return
        }
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // After 3 seconds, assume it's not installed
      setFreighterInstalled(false)
      setChecking(false)
    }

    checkFreighter()
  }, [])

  const checkFreighterPermission = async () => {
    try {
      const freighter = (window as any).freighterApi
      const allowed = await freighter.isAllowed()
      setFreighterAllowed(allowed)
    } catch (err) {
      console.error('Error checking Freighter permission:', err)
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    
    try {
      if (!(window as any).freighterApi) {
        throw new Error('Freighter wallet is not installed')
      }

      const freighter = (window as any).freighterApi
      
      // Request permission if not already allowed
      const isAllowed = await freighter.isAllowed()
      if (!isAllowed) {
        await freighter.setAllowed()
      }

      // Get public key
      const key = await freighter.getPublicKey()
      setPublicKey(key)
      setFreighterAllowed(true)
      
      console.log('Successfully connected:', key)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      console.error('Connection error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Wallet Connection Test</h1>
          
          {checking ? (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-blue-700">Checking for Freighter wallet...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Status Checks */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${freighterInstalled ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-700">
                    Freighter Installed: {freighterInstalled ? 'Yes ✓' : 'No ✗'}
                  </span>
                </div>
                
                {freighterInstalled && (
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${freighterAllowed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-gray-700">
                      Permission Granted: {freighterAllowed ? 'Yes ✓' : 'Not yet'}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">Error:</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}

              {/* Public Key Display */}
              {publicKey && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium mb-2">Connected! ✓</p>
                  <p className="text-xs text-gray-600 mb-1">Public Key:</p>
                  <p className="font-mono text-sm text-gray-800 break-all">{publicKey}</p>
                </div>
              )}

              {/* Connect Button */}
              <button
                onClick={handleConnect}
                disabled={loading || !freighterInstalled}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? 'Connecting...' : publicKey ? 'Reconnect' : 'Connect Wallet'}
              </button>

              {/* Instructions */}
              {!freighterInstalled && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium mb-2">Freighter Not Detected</p>
                  <p className="text-yellow-700 text-sm mb-3">
                    If you just installed Freighter, try these steps:
                  </p>
                  <ol className="text-yellow-700 text-sm space-y-2 mb-4 list-decimal list-inside">
                    <li>Refresh this page (F5 or Cmd+R)</li>
                    <li>Make sure the extension is enabled in your browser</li>
                    <li>Try restarting your browser</li>
                    <li>Check if Freighter icon appears in your browser toolbar</li>
                  </ol>
                  <a
                    href="https://freighter.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Install/Reinstall Freighter
                  </a>
                </div>
              )}

              {/* Debug Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-gray-700 mb-2">Debug Information:</p>
                <p className="text-xs font-mono text-gray-600">
                  freighterApi exists: {typeof window !== 'undefined' && (window as any).freighterApi ? 'true' : 'false'}
                </p>
                <p className="text-xs font-mono text-gray-600">
                  Browser: {typeof window !== 'undefined' ? navigator.userAgent.split(' ').slice(-2).join(' ') : 'unknown'}
                </p>
                <p className="text-xs font-mono text-gray-600">
                  Window loaded: {typeof window !== 'undefined' ? 'true' : 'false'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

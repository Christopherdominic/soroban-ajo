import React, { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'

export const WalletConnector: React.FC = () => {
  const { isAuthenticated, isLoading, address, network, login, logout, logoutAllDevices } = useAuthContext()
  const [showMenu, setShowMenu] = useState(false)

  const handleConnect = async () => {
    try {
      await login({ provider: 'freighter', rememberMe: false })
    } catch {
      // Error is surfaced via auth context
    }
  }

  const truncatedAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : ''

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-sm text-gray-500">Loading…</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleConnect}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
      >
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-gray-800">{truncatedAddress}</span>
        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{network}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs text-gray-500">Connected as</p>
              <p className="text-sm font-mono text-gray-800 break-all mt-0.5">{address}</p>
            </div>
            <button
              onClick={async () => { setShowMenu(false); await logout() }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Disconnect
            </button>
            <button
              onClick={async () => { setShowMenu(false); await logoutAllDevices() }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Sign out all devices
            </button>
          </div>
        </>
      )}
    </div>
  );
};

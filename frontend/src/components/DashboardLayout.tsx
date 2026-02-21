// Issue #20: Design responsive dashboard layout
// Complexity: Trivial (100 pts)
// Status: Placeholder
// TASK: Issue #62 Added progressive loading states, spinners, and skeletons

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GroupCard } from './GroupCard' // Importing the card we just updated
import { WalletConnector } from './WalletConnector'
import { useAuthContext } from '@/context/AuthContext'

export const DashboardLayout: React.FC = () => {
  // --- NEW: Progressive Loading State (#62) ---
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, address } = useAuthContext()
  const pathname = usePathname()

  // Simulating a network request (e.g., fetching from Soroban smart contract)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500) // Show loaders for 2.5 seconds, then reveal the real data

    return () => clearTimeout(timer)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/dashboard', label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { href: '/groups', label: 'Groups', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { href: '/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-blue-600">Soroban Ajo</h1>
              </Link>
              <p className="text-gray-600 text-sm">Decentralized Rotational Savings</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* TASK: State Indicator Spinner (#62) */}
              {isLoading && (
                <div className="flex items-center space-x-3 text-blue-600">
                  <span className="text-sm font-semibold animate-pulse">Syncing...</span>
                  <div className="spinner"></div>
                </div>
              )}
              
              {/* Wallet Connector */}
              <WalletConnector />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 -mb-px">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            {isAuthenticated ? `Welcome back!` : 'Welcome to Soroban Ajo'}
          </h2>
          <p className="text-blue-100 text-lg">
            {isAuthenticated 
              ? 'Manage your savings groups and track your contributions.'
              : 'Connect your wallet to get started with community savings.'}
          </p>
          {!isAuthenticated && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <p className="text-sm text-blue-50 mb-3">
                To start saving with your community, connect your Stellar wallet
              </p>
              <WalletConnector />
            </div>
          )}
        </div>

        {isAuthenticated && (
          <>
            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Active Groups</h3>
                {/* TASK: Stat Card Skeleton (#62) */}
                {isLoading ? (
                  <div className="skeleton h-9 w-12 rounded mt-1"></div>
                ) : (
                  <p className="text-3xl font-bold text-blue-600">0</p>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Total Saved</h3>
                {isLoading ? (
                  <div className="skeleton h-9 w-24 rounded mt-1"></div>
                ) : (
                  <p className="text-3xl font-bold text-green-600">$0.00</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Next Payout</h3>
                {isLoading ? (
                  <div className="skeleton h-6 w-32 rounded mt-2"></div>
                ) : (
                  <p className="text-gray-600">None scheduled</p>
                )}
              </div>
            </div>

            {/* Groups List Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Groups</h2>
                <Link
                  href="/groups/create"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Group
                </Link>
              </div>
              
              {/* TASK: GroupCard Skeleton Loaders (#62) */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <GroupCard isLoading={true} />
                  <GroupCard isLoading={true} />
                  <GroupCard isLoading={true} />
                </div>
              ) : (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No groups yet</h3>
                  <p className="text-gray-600 mb-6">Create your first savings group to get started</p>
                  <Link
                    href="/groups/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Group
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
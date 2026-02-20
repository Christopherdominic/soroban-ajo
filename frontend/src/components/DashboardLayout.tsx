// Issue #20: Design responsive dashboard layout
// Complexity: Trivial (100 pts)
// Status: Placeholder
// TASK: Issue #62 Added progressive loading states, spinners, and skeletons

import React, { useState, useEffect } from 'react'
import { GroupCard } from './GroupCard' // Importing the card we just updated

export const DashboardLayout: React.FC = () => {
  // --- NEW: Progressive Loading State (#62) ---
  const [isLoading, setIsLoading] = useState(true)

  // Simulating a network request (e.g., fetching from Soroban smart contract)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500) // Show loaders for 2.5 seconds, then reveal the real data

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Soroban Ajo</h1>
            <p className="text-gray-600">Decentralized Rotational Savings</p>
          </div>
          
          {/* TASK: State Indicator Spinner (#62) */}
          {isLoading && (
            <div className="flex items-center space-x-3 text-blue-600">
              <span className="text-sm font-semibold animate-pulse">Syncing...</span>
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          
          <div className="theme-surface p-6">
            <h3 className="text-lg font-semibold mb-2">Total Saved</h3>
            {isLoading ? (
              <div className="skeleton h-9 w-24 rounded mt-1"></div>
            ) : (
              <p className="text-3xl font-bold text-green-600">$0.00</p>
            )}
          </div>

          <div className="theme-surface p-6">
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
          <h2 className="text-2xl font-bold mb-4">Your Groups</h2>
          
          {/* TASK: GroupCard Skeleton Loaders (#62) */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GroupCard isLoading={true} />
              <GroupCard isLoading={true} />
              <GroupCard isLoading={true} />
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-600">No groups yet. Create one to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
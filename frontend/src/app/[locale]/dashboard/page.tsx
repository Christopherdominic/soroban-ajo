'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GroupCard } from '@/components/GroupCard'
import { useAuthContext } from '@/context/AuthContext'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuthContext()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 md:p-8 mb-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {isAuthenticated ? `Welcome back!` : 'Welcome to Ajo'}
        </h2>
        <p className="text-blue-100 text-base md:text-lg">
          {isAuthenticated 
            ? 'Manage your savings groups and track your contributions.'
            : 'Connect your wallet to get started with community savings.'}
        </p>
      </div>

      {isAuthenticated ? (
        <>
          {/* Stat Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Active Groups</h3>
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
          <div>
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
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          <svg className="w-20 h-20 text-blue-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            To access your dashboard and manage your savings groups, please connect your Stellar wallet using the button in the header.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Back to Home
            </Link>
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get Freighter Wallet
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

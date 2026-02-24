// Issue #27: Create group detail page with tabs
// Complexity: Medium (150 pts)
// Status: Enhanced with real member data integration and invitation system

import React, { useState } from 'react'
import { ContributionForm } from './ContributionForm'
import { MemberList } from './MemberList'
import { TransactionHistory } from './TransactionHistory'
import InviteModal from './InviteModal'

type TabKey = 'overview' | 'members' | 'history' | 'settings'

interface GroupDetailPageProps {
  groupId: string
  groupName?: string
  onShareLink?: () => void
  onCopyLink?: () => void
}

export const GroupDetailPage: React.FC<GroupDetailPageProps> = ({
  groupId,
  groupName = 'Market Women Ajo',
  onShareLink,
  onCopyLink,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  // TODO: Fetch group details from smart contract
  // TODO: Fetch member list and transaction history

  const handleShareLink = () => {
    setIsInviteModalOpen(true)
    if (onShareLink) {
      onShareLink()
    }
  }

  const handleCopyLink = () => {
    if (onCopyLink) {
      onCopyLink()
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/50 p-6 border border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
              {groupName}
            </h2>
            <p className="text-gray-600 dark:text-slate-400">Group ID: {groupId}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareLink}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Invite Members
            </button>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-emerald-900/40 text-green-800 dark:text-emerald-300">
              Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded border border-gray-100 dark:border-slate-600">
            <p className="text-sm text-gray-600 dark:text-slate-400">Members</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">8/10</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded border border-gray-100 dark:border-slate-600">
            <p className="text-sm text-gray-600 dark:text-slate-400">Cycle Length</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">30 days</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded border border-gray-100 dark:border-slate-600">
            <p className="text-sm text-gray-600 dark:text-slate-400">Contribution</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">$500</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded border border-gray-100 dark:border-slate-600">
            <p className="text-sm text-gray-600 dark:text-slate-400">Total Collected</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">$4,000</p>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteModal
        groupId={groupId}
        groupName={groupName}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700">
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="flex gap-4 px-6">
            {(['overview', 'members', 'history', 'settings'] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-semibold transition ${activeTab === tab
                  ? 'border-blue-600 dark:border-indigo-400 text-blue-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded border border-gray-100 dark:border-slate-600">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-slate-100">
                    Next Payout
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-indigo-400">
                    Feb 28, 2026
                  </p>
                </div>
                <TransactionHistory groupId={groupId} />
              </div>
              <ContributionForm groupId={groupId} contributionAmount={500} />
            </div>
          )}

          {activeTab === 'members' && (
            <>
              {/* MemberList now fetches its own data via useGroupMembers hook */}
              <MemberList groupId={groupId} />
            </>
          )}

          {activeTab === 'history' && <TransactionHistory groupId={groupId} />}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                Group Settings
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                TODO: Add settings for group creator (pause group, update metadata, cancel group)
              </p>
              <button className="bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white px-4 py-2 rounded transition-colors">
                Cancel Group (Creator Only)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

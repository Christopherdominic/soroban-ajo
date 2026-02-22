// Issue #27: Create group detail page with tabs
// Complexity: Medium (150 pts)
// Status: Placeholder

import React, { useState } from 'react'
import { MemberList } from './MemberList'
import { ContributionForm } from './ContributionForm'
import { TransactionHistory } from './TransactionHistory'
import { EmptyMemberState } from './EmptyMemberState'

type TabKey = 'overview' | 'members' | 'history' | 'settings'

interface Member {
  id: string
  address: string
}

interface GroupDetailPageProps {
  groupId: string
  members?: Member[]
  onShareLink?: () => void
  onCopyLink?: () => void
}

export const GroupDetailPage: React.FC<GroupDetailPageProps> = ({
  groupId,
  members = [],
  onShareLink,
  onCopyLink,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  // TODO: Fetch group details from smart contract
  // TODO: Fetch member list and transaction history

  const handleShareLink = () => {
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Market Women Ajo</h2>
            <p className="text-gray-600">Group ID: {groupId}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Members</p>
            <p className="text-2xl font-bold">8/10</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Cycle Length</p>
            <p className="text-2xl font-bold">30 days</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Contribution</p>
            <p className="text-2xl font-bold">$500</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Total Collected</p>
            <p className="text-2xl font-bold">$4,000</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex gap-4 px-6">
            {(['overview', 'members', 'history', 'settings'] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-semibold transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
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
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-2">Next Payout</h3>
                  <p className="text-2xl font-bold text-blue-600">Feb 28, 2026</p>
                </div>
                <TransactionHistory groupId={groupId} transactions={[]} />
              </div>
              <ContributionForm groupId={groupId} contributionAmount={500} />
            </div>
          )}

          {activeTab === 'members' && (
            <>
              {members.length === 0 ? (
                <EmptyMemberState onShareLink={handleShareLink} onCopyLink={handleCopyLink} />
              ) : (
                <MemberList groupId={groupId} members={members} />
              )}
            </>
          )}

          {activeTab === 'history' && <TransactionHistory groupId={groupId} transactions={[]} />}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Group Settings</h3>
              <p className="text-gray-600">
                TODO: Add settings for group creator (pause group, update metadata, cancel group)
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Cancel Group (Creator Only)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

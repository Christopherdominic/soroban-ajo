// Issue #23: Build member list view
// Complexity: Trivial (100 pts)
// Status: Implemented with real blockchain data

import React from 'react'
import { useGroupMembers } from '../hooks/useContractData'
import { generateAvatarColor, getAddressInitials, shortenAddress, formatDate } from '../utils/avatarUtils'

interface Member {
  address: string
  joinedDate: string
  contributions: number
  totalContributed: number
  cyclesCompleted: number
  status: 'active' | 'inactive' | 'completed'
}

interface MemberListProps {
  groupId: string
}

export const MemberList: React.FC<MemberListProps> = ({ groupId }) => {
  const { data: members = [], isLoading, error } = useGroupMembers(groupId)

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-2xl font-bold mb-4">Group Members</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading members...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-2xl font-bold mb-4">Group Members</h3>
        <div className="text-red-600 py-4">
          Failed to load members. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6" data-group-id={groupId}>
      <h3 className="text-2xl font-bold mb-4">Group Members ({members.length})</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Member</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Joined</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Contributions</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Total Contributed</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Cycles</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => (
              <tr key={member.address} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: generateAvatarColor(member.address) }}
                      title={member.address}
                    >
                      {getAddressInitials(member.address)}
                    </div>
                    <div>
                      <div className="text-sm font-mono text-gray-900 font-medium">
                        {shortenAddress(member.address)}
                      </div>
                      {idx === 0 && (
                        <div className="text-xs text-blue-600 font-semibold">Creator</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(member.joinedDate)}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  {member.contributions}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-green-600">
                  {member.totalContributed.toFixed(2)} XLM
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {member.cyclesCompleted}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${member.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : member.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                      }`}
                  >
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {members.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No members found in this group.
          </div>
        )}
      </div>
    </div>
  )
}

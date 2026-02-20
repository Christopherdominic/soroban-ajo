// Issue #23: Build member list view
// Complexity: Trivial (100 pts)
// Status: Placeholder

import React from 'react'

interface Member {
  address: string
  joinedDate: string
  contributions: number
  status: 'active' | 'inactive' | 'completed'
}

interface MemberListProps {
  members: Member[]
  groupId: string
}

export const MemberList: React.FC<MemberListProps> = ({ members, groupId }) => {
  // TODO: Fetch members from smart contract
  // TODO: Display real member data with avatars
  // TODO: Add ability to remove members (creator only)
  
  const mockMembers: Member[] = [
    {
      address: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      joinedDate: '2024-01-15',
      contributions: 1500,
      status: 'active',
    },
  ]

  const displayMembers = members.length > 0 ? members : mockMembers

  return (
      <div className="bg-white rounded-lg shadow p-6" data-group-id={groupId}>
      <h3 className="text-2xl font-bold mb-4">Group Members ({displayMembers.length})</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Address</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Joined</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Contributions</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayMembers.map((member, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-gray-900 truncate">
                  {member.address.substring(0, 10)}...
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{member.joinedDate}</td>
                <td className="px-4 py-3 text-sm font-semibold">${member.contributions}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      member.status === 'active'
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
      </div>
    </div>
  )
}

// Issue #20: Design responsive dashboard layout
// Complexity: Trivial (100 pts)
// Status: Complete

import React from 'react'

export const DashboardLayout: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Active Groups</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Saved</h3>
          <p className="text-3xl font-bold text-green-600">$0.00</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Next Payout</h3>
          <p className="text-gray-600">None scheduled</p>
        </div>
      </div>

      {/* Groups Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Your Groups</h2>
        <p className="text-gray-600">No groups yet. Create one to get started!</p>
      </div>
    </div>
  )
}

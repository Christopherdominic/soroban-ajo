// Issue #21: Build group creation form
// Complexity: Trivial (100 pts)
// Status: Placeholder

import React, { useState } from 'react'

interface GroupFormData {
  groupName: string
  description: string
  cycleLength: number
  contributionAmount: number
  maxMembers: number
  frequency: 'weekly' | 'monthly'
  duration: number
  invitedMembers: string[]
}

export const GroupCreationForm: React.FC = () => {
  const [formData, setFormData] = useState<GroupFormData>({
    groupName: '',
    description: '',
    cycleLength: 30,
    contributionAmount: 100,
    maxMembers: 10,
    frequency: 'monthly',
    duration: 12,
    invitedMembers: [],
  })
  const [memberInput, setMemberInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit form data to smart contract
    // Steps:
    // 1. Validate form data
    // 2. Call create_group on Soroban contract
    // 3. Show success notification
    // 4. Redirect to group detail page
    console.log('Create group:', formData)
  }

  const handleAddMember = () => {
    if (memberInput.trim() && !formData.invitedMembers.includes(memberInput.trim())) {
      setFormData({ ...formData, invitedMembers: [...formData.invitedMembers, memberInput.trim()] })
      setMemberInput('')
    }
  }

  const handleRemoveMember = (member: string) => {
    setFormData({ ...formData, invitedMembers: formData.invitedMembers.filter(m => m !== member) })
  }

  return (
    <div className="theme-surface p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Create a New Group</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="group-name" className="block text-sm font-semibold mb-2">Group Name</label>
          <input
            id="group-name"
            type="text"
            value={formData.groupName}
            onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
            placeholder="e.g., Market Women Ajo"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="group-description" className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            id="group-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your group's purpose..."
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cycle-length" className="block text-sm font-semibold mb-2">Cycle Length (days)</label>
            <input
              id="cycle-length"
              type="number"
              value={formData.cycleLength}
              onChange={(e) => setFormData({ ...formData, cycleLength: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="contribution-amount" className="block text-sm font-semibold mb-2">Contribution Amount ($)</label>
            <input
              id="contribution-amount"
              type="number"
              step="0.01"
              value={formData.contributionAmount}
              onChange={(e) => setFormData({ ...formData, contributionAmount: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="max-members" className="block text-sm font-semibold mb-2">Max Members</label>
          <input
            id="max-members"
            type="number"
            value={formData.maxMembers}
            onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
            min="2"
            max="50"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="frequency" className="block text-sm font-semibold mb-2">Frequency</label>
            <select
              id="frequency"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'weekly' | 'monthly' })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-semibold mb-2">Duration (cycles)</label>
            <input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              min="1"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="invite-members" className="block text-sm font-semibold mb-2">Invite Members</label>
          <div className="flex gap-2 mb-2">
            <input
              id="invite-members"
              type="text"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
              placeholder="Enter wallet address, email, or username"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddMember}
              className="theme-btn-secondary px-4 py-2"
            >
              Add
            </button>
          </div>
          {formData.invitedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.invitedMembers.map((member) => (
                <span
                  key={member}
                  className="inline-flex items-center gap-1 px-3 py-1 theme-surface-muted theme-primary rounded-full text-sm"
                >
                  {member}
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member)}
                    className="hover:opacity-80"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="theme-surface-muted p-4">
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="theme-muted">Group Name:</span>
              <span className="font-medium">{formData.groupName || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="theme-muted">Frequency:</span>
              <span className="font-medium capitalize">{formData.frequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="theme-muted">Duration:</span>
              <span className="font-medium">{formData.duration} cycles</span>
            </div>
            <div className="flex justify-between">
              <span className="theme-muted">Contribution:</span>
              <span className="font-medium">${formData.contributionAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="theme-muted">Max Members:</span>
              <span className="font-medium">{formData.maxMembers}</span>
            </div>
            <div className="flex justify-between">
              <span className="theme-muted">Invited Members:</span>
              <span className="font-medium">{formData.invitedMembers.length}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full theme-btn font-semibold py-2"
        >
          Create Group
        </button>
      </form>
    </div>
  )
}

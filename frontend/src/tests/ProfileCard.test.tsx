import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProfileCard } from '../components/ProfileCard'
import type { UserProfile } from '../types/profile'

const mockProfile: UserProfile = {
  address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  displayName: 'Test User',
  email: 'test@example.com',
  bio: 'This is a test bio',
  joinedAt: '2024-01-01T00:00:00.000Z',
  preferences: {
    notifications: {
      email: true,
      push: true,
      groupUpdates: true,
      payoutReminders: true,
      contributionReminders: true,
    },
    privacy: {
      showProfile: true,
      showActivity: true,
      showStats: true,
    },
    display: {
      theme: 'auto',
      language: 'en',
      currency: 'USD',
    },
  },
  stats: {
    totalGroups: 5,
    activeGroups: 3,
    completedGroups: 2,
    totalContributions: 1500,
    totalPayouts: 1200,
    successRate: 95,
  },
}

describe('ProfileCard', () => {
  it('renders profile information correctly', () => {
    render(<ProfileCard profile={mockProfile} />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('This is a test bio')).toBeInTheDocument()
  })

  it('displays user statistics', () => {
    render(<ProfileCard profile={mockProfile} />)
    
    expect(screen.getByText('5')).toBeInTheDocument() // Total Groups
    expect(screen.getByText('$1500.00')).toBeInTheDocument() // Contributions
    expect(screen.getByText('95%')).toBeInTheDocument() // Success Rate
  })

  it('shows loading skeleton when isLoading is true', () => {
    const { container } = render(<ProfileCard profile={mockProfile} isLoading={true} />)
    
    const skeletons = container.querySelectorAll('.skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('formats wallet address correctly', () => {
    render(<ProfileCard profile={mockProfile} />)
    
    // Should show truncated address
    expect(screen.getByText(/GABCDE\.\.\.7890/)).toBeInTheDocument()
  })

  it('displays avatar initials when no avatar image', () => {
    render(<ProfileCard profile={mockProfile} />)
    
    expect(screen.getByText('TE')).toBeInTheDocument() // First 2 letters of "Test User"
  })

  it('shows joined date', () => {
    render(<ProfileCard profile={mockProfile} />)
    
    expect(screen.getByText(/Joined/)).toBeInTheDocument()
  })
})

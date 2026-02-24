/**
 * Example Integration: Group Detail Page with Status
 * 
 * This file demonstrates how to integrate the GroupStatus component
 * into a real group detail page. Copy and adapt as needed.
 * 
 * Features demonstrated:
 * - Group status display
 * - Member list integration
 * - Transaction history
 * - Contribution form
 * - Cache management
 */

'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { GroupStatus } from '@/components/GroupStatus'
import { MemberList } from '@/components/MemberList'
import { TransactionHistory } from '@/components/TransactionHistory'
import { ContributionForm } from '@/components/ContributionForm'
import { 
  useGroupDetail, 
  useGroupMembers,
  useGroupStatus,
  useCacheInvalidation 
} from '@/hooks/useContractData'

export default function GroupDetailPageExample() {
  const params = useParams()
  const groupId = params.id as string

  // Fetch all group data
  const { data: group, isLoading: groupLoading } = useGroupDetail(groupId)
  const { data: status, isLoading: statusLoading } = useGroupStatus(groupId)
  const { data: members, isLoading: membersLoading } = useGroupMembers(groupId)

  // Cache management
  const { invalidateGroup } = useCacheInvalidation()

  // Handle contribution success
  const handleContributionSuccess = () => {
    // Cache is automatically invalidated by the mutation
    // But you can manually trigger if needed
    invalidateGroup(groupId)
  }

  // Loading state
  if (groupLoading || statusLoading || membersLoading) {
    return (
      <div className="container">
        <div className="loading-skeleton">
          <div className="skeleton-header" />
          <div className="skeleton-content" />
        </div>
      </div>
    )
  }

  // Error state
  if (!group || !status) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Group not found</h2>
          <p>The group you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Page Header */}
      <header className="page-header">
        <h1>{group.name}</h1>
        {group.description && (
          <p className="description">{group.description}</p>
        )}
      </header>

      {/* Main Content Grid */}
      <div className="content-grid">
        
        {/* Left Column: Status and Actions */}
        <aside className="sidebar">
          
          {/* Group Status - The star of the show! */}
          <GroupStatus 
            groupId={groupId}
            showRefreshButton={true}
            className="status-card"
          />

          {/* Contribution Form */}
          {status.pendingContributions > 0 && (
            <ContributionForm
              groupId={groupId}
              requiredAmount={group.contributionAmount}
              onSuccess={handleContributionSuccess}
            />
          )}

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat">
              <span className="label">Members</span>
              <span className="value">{group.currentMembers}/{group.maxMembers}</span>
            </div>
            <div className="stat">
              <span className="label">Contribution</span>
              <span className="value">{group.contributionAmount} XLM</span>
            </div>
            <div className="stat">
              <span className="label">Cycle Length</span>
              <span className="value">{group.cycleLength} days</span>
            </div>
          </div>
        </aside>

        {/* Right Column: Members and Transactions */}
        <main className="main-content">
          
          {/* Member List */}
          <section className="section">
            <h2>Members</h2>
            <MemberList 
              members={members || []}
              groupId={groupId}
            />
          </section>

          {/* Transaction History */}
          <section className="section">
            <h2>Transaction History</h2>
            <TransactionHistory 
              groupId={groupId}
              limit={10}
            />
          </section>

          {/* Cycle Information */}
          <section className="section">
            <h2>Cycle Information</h2>
            <div className="cycle-info">
              <p>
                <strong>Current Cycle:</strong> {status.currentCycle}
              </p>
              <p>
                <strong>Next Recipient:</strong>{' '}
                {status.nextRecipient === 'N/A' 
                  ? 'Group Complete' 
                  : status.nextRecipient
                }
              </p>
              <p>
                <strong>Contributions Received:</strong>{' '}
                {group.currentMembers - status.pendingContributions} / {group.currentMembers}
              </p>
              <p>
                <strong>Days Until Payout:</strong> {status.daysUntilPayout}
              </p>
            </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .description {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .content-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .status-card {
          position: sticky;
          top: 2rem;
        }

        .quick-stats {
          background: var(--surface-primary);
          border: 1px solid var(--border-primary);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat .label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .stat .value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .main-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section {
          background: var(--surface-primary);
          border: 1px solid var(--border-primary);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .section h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .cycle-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .cycle-info p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .cycle-info strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        .loading-skeleton {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .skeleton-header,
        .skeleton-content {
          height: 100px;
          background: linear-gradient(
            90deg,
            var(--surface-secondary) 25%,
            var(--surface-tertiary) 50%,
            var(--surface-secondary) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        .skeleton-content {
          height: 400px;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .error-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .error-state h2 {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .error-state p {
          color: var(--text-secondary);
        }

        @media (max-width: 968px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .status-card {
            position: static;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Alternative: Minimal Integration
 * 
 * If you just want to add status to an existing page:
 */
export function MinimalIntegration({ groupId }: { groupId: string }) {
  return (
    <div>
      <h1>Group Details</h1>
      
      {/* Just drop in the component */}
      <GroupStatus groupId={groupId} />
      
      {/* Rest of your existing page */}
    </div>
  )
}

/**
 * Alternative: Custom Status Display
 * 
 * If you want to build your own UI:
 */
export function CustomStatusDisplay({ groupId }: { groupId: string }) {
  const { data, isLoading, error, refetch } = useGroupStatus(groupId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return null

  return (
    <div className="custom-status">
      <h2>Group Status</h2>
      
      <div className="status-grid">
        <div>Cycle: {data.currentCycle}</div>
        <div>Pending: {data.pendingContributions}</div>
        <div>Collected: {data.totalCollected} XLM</div>
        <div>Days Left: {data.daysUntilPayout}</div>
      </div>

      <button onClick={() => refetch()}>
        Refresh
      </button>
    </div>
  )
}

/**
 * Alternative: Status with Auto-refresh
 * 
 * Automatically refresh every minute:
 */
export function AutoRefreshStatus({ groupId }: { groupId: string }) {
  const { data, refetch } = useGroupStatus(groupId)

  // Auto-refresh every 60 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 60000)

    return () => clearInterval(interval)
  }, [refetch])

  return <GroupStatus groupId={groupId} />
}

/**
 * GroupStatus Component
 * 
 * Displays real-time group status information fetched from the blockchain:
 * - Current cycle number
 * - Next payout recipient
 * - Pending contributions count
 * - Total collected in current cycle
 * - Days until next payout
 * 
 * Features:
 * - Real blockchain data via useGroupStatus hook
 * - Intelligent caching (30s TTL)
 * - Loading and error states
 * - Auto-refresh capability
 * - Responsive design
 */

'use client'

import React from 'react'
import { useGroupStatus } from '@/hooks/useContractData'
import { Icon } from './Icon'

interface GroupStatusProps {
  groupId: string
  className?: string
  showRefreshButton?: boolean
}

export const GroupStatus: React.FC<GroupStatusProps> = ({
  groupId,
  className = '',
  showRefreshButton = true,
}) => {
  const { data: status, isLoading, error, refetch } = useGroupStatus(groupId)

  if (isLoading) {
    return (
      <div className={`group-status loading ${className}`}>
        <div className="status-skeleton">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`group-status error ${className}`}>
        <div className="error-message">
          <Icon name="alert-circle" size={20} />
          <span>Failed to load group status</span>
        </div>
        <button onClick={() => refetch()} className="retry-button">
          Retry
        </button>
      </div>
    )
  }

  if (!status) {
    return null
  }

  return (
    <div className={`group-status ${className}`}>
      <div className="status-header">
        <h3>Group Status</h3>
        {showRefreshButton && (
          <button
            onClick={() => refetch()}
            className="refresh-button"
            aria-label="Refresh status"
          >
            <Icon name="refresh-cw" size={16} />
          </button>
        )}
      </div>

      <div className="status-grid">
        <div className="status-item">
          <div className="status-label">
            <Icon name="calendar" size={16} />
            <span>Current Cycle</span>
          </div>
          <div className="status-value">{status.currentCycle}</div>
        </div>

        <div className="status-item">
          <div className="status-label">
            <Icon name="user" size={16} />
            <span>Next Recipient</span>
          </div>
          <div className="status-value address">
            {status.nextRecipient === 'N/A' 
              ? 'Group Complete' 
              : `${status.nextRecipient.slice(0, 8)}...${status.nextRecipient.slice(-4)}`
            }
          </div>
        </div>

        <div className="status-item">
          <div className="status-label">
            <Icon name="clock" size={16} />
            <span>Pending Contributions</span>
          </div>
          <div className="status-value">
            {status.pendingContributions}
            {status.pendingContributions === 0 && (
              <span className="badge success">All paid</span>
            )}
          </div>
        </div>

        <div className="status-item">
          <div className="status-label">
            <Icon name="dollar-sign" size={16} />
            <span>Total Collected</span>
          </div>
          <div className="status-value">{status.totalCollected.toFixed(2)} XLM</div>
        </div>

        <div className="status-item highlight">
          <div className="status-label">
            <Icon name="calendar-check" size={16} />
            <span>Days Until Payout</span>
          </div>
          <div className="status-value large">
            {status.daysUntilPayout}
            <span className="unit">days</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .group-status {
          background: var(--surface-primary);
          border: 1px solid var(--border-primary);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .status-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .refresh-button {
          background: transparent;
          border: 1px solid var(--border-primary);
          border-radius: 8px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .refresh-button:hover {
          background: var(--surface-secondary);
          border-color: var(--border-hover);
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .status-item {
          background: var(--surface-secondary);
          border-radius: 8px;
          padding: 1rem;
        }

        .status-item.highlight {
          background: linear-gradient(135deg, var(--primary-light), var(--primary));
          color: white;
        }

        .status-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .status-item.highlight .status-label {
          color: rgba(255, 255, 255, 0.9);
        }

        .status-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-item.highlight .status-value {
          color: white;
        }

        .status-value.large {
          font-size: 2rem;
        }

        .status-value.address {
          font-size: 1rem;
          font-family: monospace;
        }

        .status-value .unit {
          font-size: 0.875rem;
          font-weight: 400;
          opacity: 0.8;
        }

        .badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .badge.success {
          background: var(--success-light);
          color: var(--success);
        }

        .loading .status-skeleton {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .skeleton-line {
          height: 60px;
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

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .error {
          text-align: center;
          padding: 2rem;
        }

        .error-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--error);
          margin-bottom: 1rem;
        }

        .retry-button {
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .retry-button:hover {
          background: var(--primary-dark);
        }

        @media (max-width: 768px) {
          .status-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default GroupStatus

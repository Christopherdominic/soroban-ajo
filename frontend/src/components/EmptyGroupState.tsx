import React from 'react'
import { EmptyState } from './EmptyState'

interface EmptyGroupStateProps {
  onCreateGroup: () => void
  onLearnMore?: () => void
}

export const EmptyGroupState: React.FC<EmptyGroupStateProps> = ({ onCreateGroup, onLearnMore }) => {
  return (
    <EmptyState
      icon="social-users"
      illustrationSize="lg"
      heading="Start Your First Savings Group"
      message="Create a group to save together with friends, family, or community members. Everyone contributes, and members take turns receiving the pool."
      primaryAction={{
        label: 'Create Your First Group',
        onClick: onCreateGroup,
        icon: 'action-add',
      }}
      secondaryAction={
        onLearnMore
          ? {
              label: 'Learn How Ajo Works',
              onClick: onLearnMore,
            }
          : undefined
      }
    />
  )
}

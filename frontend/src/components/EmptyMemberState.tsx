import React from 'react'
import { EmptyState } from './EmptyState'

interface EmptyMemberStateProps {
  onShareLink: () => void
  onCopyLink?: () => void
}

export const EmptyMemberState: React.FC<EmptyMemberStateProps> = ({ onShareLink, onCopyLink }) => {
  return (
    <EmptyState
      icon="action-add"
      illustrationSize="md"
      heading="Invite Members to Join"
      message="Share your group link with friends and family. You need at least 2 members to start the first cycle."
      primaryAction={{
        label: 'Share Group Link',
        onClick: onShareLink,
      }}
      secondaryAction={
        onCopyLink
          ? {
              label: 'Copy Invite Link',
              onClick: onCopyLink,
            }
          : undefined
      }
    />
  )
}

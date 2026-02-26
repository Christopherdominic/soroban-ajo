import React from 'react'
import { getErrorMessage } from '../utils/errorMessages'
import { RetryButton } from './RetryButton'

interface ErrorDisplayProps {
  error: unknown
  onRetry?: () => void
  isRetrying?: boolean
  attempt?: number
  maxAttempts?: number
  compact?: boolean
}

const CATEGORY_ICONS: Record<string, string> = {
  wallet: '👛',
  transaction: '💸',
  network: '🌐',
  contract: '📄',
  auth: '🔐',
  unknown: '⚠️',
}

export function ErrorDisplay({
  error,
  onRetry,
  isRetrying,
  attempt,
  maxAttempts,
  compact = false,
}: ErrorDisplayProps) {
  const friendlyError = getErrorMessage(error)
  const icon = CATEGORY_ICONS[friendlyError.category]

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
        <span>{icon}</span>
        <p className="text-red-700 flex-1">{friendlyError.message}</p>
        {onRetry && friendlyError.retryable && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="text-red-600 hover:text-red-800 underline text-xs"
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
      <div className="text-4xl">{icon}</div>
      <div>
        <h3 className="font-semibold text-red-800 text-lg">{friendlyError.title}</h3>
        <p className="text-red-600 mt-1 text-sm">{friendlyError.message}</p>
      </div>
      {onRetry && friendlyError.retryable && (
        <RetryButton
          onRetry={onRetry}
          isRetrying={isRetrying}
          attempt={attempt}
          maxAttempts={maxAttempts}
        />
      )}
    </div>
  )
}

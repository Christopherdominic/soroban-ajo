import React from 'react'

interface RetryButtonProps {
  onRetry: () => void
  isRetrying?: boolean
  attempt?: number
  maxAttempts?: number
  label?: string
  className?: string
}

export function RetryButton({
  onRetry,
  isRetrying = false,
  attempt = 0,
  maxAttempts = 3,
  label = 'Try Again',
  className = '',
}: RetryButtonProps) {
  const attemptsLeft = maxAttempts - attempt

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={onRetry}
        disabled={isRetrying || attemptsLeft <= 0}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {isRetrying ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Retrying...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {label}
          </>
        )}
      </button>
      {attempt > 0 && attemptsLeft > 0 && (
        <p className="text-xs text-gray-500">
          {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining
        </p>
      )}
      {attemptsLeft <= 0 && (
        <p className="text-xs text-red-500">Maximum retry attempts reached</p>
      )}
    </div>
  )
}

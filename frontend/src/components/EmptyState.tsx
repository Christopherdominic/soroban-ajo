import React from 'react'
import { Icon } from './Icon'

interface Action {
  label: string
  onClick: () => void
  icon?: string
}

interface EmptyStateProps {
  icon: string
  heading: string
  message: string
  primaryAction?: Action
  secondaryAction?: Action
  illustrationSize?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 100,
  md: 120,
  lg: 160,
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  heading,
  message,
  primaryAction,
  secondaryAction,
  illustrationSize = 'md',
}) => {
  const size = sizeMap[illustrationSize]

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-6 text-gray-300" style={{ width: size, height: size }} aria-hidden="true">
        <Icon name={icon} size={48} variant="disabled" className="w-full h-full" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{heading}</h3>
      <p className="text-base text-gray-600 max-w-md mb-6">{message}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            {primaryAction.icon && <Icon name={primaryAction.icon} size={20} />}
            {primaryAction.label}
          </button>
        )}

        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="inline-flex items-center gap-1 px-6 py-3 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            {secondaryAction.label}
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  )
}

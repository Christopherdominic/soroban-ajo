// TableDensitySelector component for toggling table density
// Features: Compact, comfortable, and spacious density options with visual indicators

import React from 'react'
import { DensityOption } from './DataTable'

export interface TableDensitySelectorProps {
  density: DensityOption
  onDensityChange: (density: DensityOption) => void
  showLabels?: boolean
  variant?: 'buttons' | 'dropdown'
}

export const TableDensitySelector: React.FC<TableDensitySelectorProps> = ({
  density,
  onDensityChange,
  showLabels = true,
  variant = 'buttons',
}) => {
  const densityOptions: { value: DensityOption; label: string; icon: string }[] = [
    { value: 'compact', label: 'Compact', icon: '▤' },
    { value: 'comfortable', label: 'Comfortable', icon: '☰' },
    { value: 'spacious', label: 'Spacious', icon: '≡' },
  ]

  if (variant === 'dropdown') {
    return (
      <div className="relative inline-block">
        <label htmlFor="density-select" className="sr-only">
          Table density
        </label>
        <select
          id="density-select"
          value={density}
          onChange={(e) => onDensityChange(e.target.value as DensityOption)}
          className="px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          {densityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {densityOptions.map((option) => {
        const isActive = density === option.value

        return (
          <button
            key={option.value}
            onClick={() => onDensityChange(option.value)}
            className={`px-3 py-1.5 rounded-md font-medium text-sm transition-all ${
              isActive
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            aria-label={`Set ${option.label} density`}
            aria-pressed={isActive}
            title={option.label}
          >
            <span className="flex items-center space-x-1.5">
              <span className="text-base">{option.icon}</span>
              {showLabels && <span>{option.label}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// Standalone density icon button for toolbars
export const TableDensityIconButton: React.FC<{
  density: DensityOption
  onDensityChange: (density: DensityOption) => void
}> = ({ density, onDensityChange }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const densityOptions: { value: DensityOption; label: string; icon: string; description: string }[] = [
    { value: 'compact', label: 'Compact', icon: '▤', description: 'Minimal spacing' },
    { value: 'comfortable', label: 'Comfortable', icon: '☰', description: 'Balanced spacing' },
    { value: 'spacious', label: 'Spacious', icon: '≡', description: 'Maximum spacing' },
  ]

  const currentOption = densityOptions.find((opt) => opt.value === density)

  const handleSelect = (value: DensityOption) => {
    onDensityChange(value)
    setIsOpen(false)
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-density-menu]')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" data-density-menu>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Change table density"
        aria-expanded={isOpen}
        title={`Density: ${currentOption?.label}`}
      >
        <span className="text-xl">{currentOption?.icon}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-3 py-2 border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase">Table Density</span>
          </div>
          {densityOptions.map((option) => {
            const isActive = density === option.value

            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                  isActive ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{option.icon}</span>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                  {isActive && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

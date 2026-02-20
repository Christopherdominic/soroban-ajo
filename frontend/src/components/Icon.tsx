import React from 'react'
import { clsx } from 'clsx'

export type IconSize = 16 | 20 | 24 | 32 | 48
export type IconVariant = 'default' | 'active' | 'disabled' | 'error' | 'success' | 'warning' | 'info'

interface IconProps {
  name: string
  size?: IconSize
  variant?: IconVariant
  className?: string
  ariaHidden?: boolean
  ariaLabel?: string
  title?: string
}

const sizeMap: Record<IconSize, string> = {
  16: 'w-4 h-4',
  20: 'w-5 h-5',
  24: 'w-6 h-6',
  32: 'w-8 h-8',
  48: 'w-12 h-12',
}

const variantMap: Record<IconVariant, string> = {
  default: 'text-gray-700',
  active: 'text-blue-600',
  disabled: 'text-gray-300',
  error: 'text-red-600',
  success: 'text-green-600',
  warning: 'text-amber-600',
  info: 'text-cyan-600',
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  variant = 'default',
  className,
  ariaHidden = true,
  ariaLabel,
  title,
}) => {
  const sizeClass = sizeMap[size]
  const variantClass = variantMap[variant]
  const combinedClass = clsx(sizeClass, variantClass, className)

  return (
    <svg
      className={combinedClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      data-icon={name}
    >
      {title && <title>{title}</title>}
      <use href={`#icon-${name}`} />
    </svg>
  )
}

export default Icon

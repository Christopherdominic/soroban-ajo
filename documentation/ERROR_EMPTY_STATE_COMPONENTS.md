# Error & Empty State Components Specification

## Overview
Reusable React components for all error states, empty states, loading states, and edge cases with TypeScript interfaces and implementation examples.

---

## 1. ErrorState Component

### Purpose
Display error messages with icon, heading, description, and action buttons.

### TypeScript Interface

```typescript
interface ErrorStateProps {
  // Visual
  variant: 'error' | 'warning' | 'info'
  icon?: IconName
  illustration?: React.ReactNode
  
  // Content
  heading: string
  message: string
  errorCode?: string
  details?: string
  
  // Actions
  primaryAction?: {
    label: string
    onClick: () => void
    loading?: boolean
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  
  // Accessibility
  ariaLabel?: string
  role?: 'alert' | 'status'
  
  // Styling
  className?: string
  fullPage?: boolean
}
```

### Implementation

```tsx
import React from 'react'
import { Icon, IconName } from './Icon'
import { Button } from './Button'

export const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'error',
  icon,
  heading,
  message,
  errorCode,
  details,
  primaryAction,
  secondaryAction,
  ariaLabel,
  role = 'alert',
  className = '',
  fullPage = false,
}) => {
  const variantStyles = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  }

  const iconVariants = {
    error: 'error' as const,
    warning: 'warning' as const,
    info: 'info' as const,
  }

  const containerClass = fullPage
    ? 'min-h-screen flex items-center justify-center p-4'
    : 'w-full'

  return (
    <div className={containerClass}>
      <div
        role={role}
        aria-label={ariaLabel || heading}
        className={`
          ${variantStyles[variant]}
          border rounded-xl p-8
          text-center max-w-md mx-auto
          ${className}
        `}
      >
        {icon && (
          <div className="flex justify-center mb-4">
            <Icon
              name={icon}
              size={64}
              variant={iconVariants[variant]}
            />
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {heading}
        </h2>

        <p className="text-base text-gray-600 mb-6">
          {message}
        </p>

        {details && (
          <details className="text-left mb-6">
            <summary className="text-sm text-gray-500 cursor-pointer">
              Technical Details
            </summary>
            <pre className="text-xs text-gray-600 mt-2 p-3 bg-white rounded border">
              {details}
            </pre>
          </details>
        )}

        {errorCode && (
          <p className="text-xs text-gray-400 mb-6 font-mono">
            {errorCode}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {primaryAction && (
            <Button
              variant="primary"
              onClick={primaryAction.onClick}
              loading={primaryAction.loading}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
```

### Usage Examples

```tsx
// Network error
<ErrorState
  variant="error"
  icon="status-error"
  heading="Connection Lost"
  message="Check your internet connection and try again."
  primaryAction={{
    label: "Retry",
    onClick: handleRetry,
  }}
/>

// Server error with details
<ErrorState
  variant="error"
  icon="status-error"
  heading="Server Error"
  message="We encountered an unexpected error."
  errorCode="Error Code: 500-1234567890"
  details={JSON.stringify(errorDetails, null, 2)}
  primaryAction={{
    label: "Go to Dashboard",
    onClick: () => navigate('/dashboard'),
  }}
  secondaryAction={{
    label: "Contact Support",
    onClick: openSupport,
  }}
/>

// Full page error
<ErrorState
  variant="error"
  icon="status-error"
  heading="Page Not Found"
  message="The page you're looking for doesn't exist."
  fullPage={true}
  primaryAction={{
    label: "Go Home",
    onClick: () => navigate('/'),
  }}
/>
```

---

## 2. EmptyState Component

### Purpose
Display empty states with illustration, heading, description, and call-to-action.

### TypeScript Interface

```typescript
interface EmptyStateProps {
  // Visual
  icon?: IconName
  illustration?: React.ReactNode
  illustrationSize?: 'sm' | 'md' | 'lg'
  
  // Content
  heading: string
  message: string
  
  // Actions
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: IconName
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  
  // Styling
  className?: string
  compact?: boolean
}
```

### Implementation

```tsx
import React from 'react'
import { Icon, IconName } from './Icon'
import { Button } from './Button'

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  illustration,
  illustrationSize = 'md',
  heading,
  message,
  primaryAction,
  secondaryAction,
  className = '',
  compact = false,
}) => {
  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 160,
  }

  const iconSize = sizeMap[illustrationSize]
  const padding = compact ? 'p-6' : 'p-12'

  return (
    <div
      className={`
        ${padding}
        text-center max-w-lg mx-auto
        ${className}
      `}
    >
      {illustration ? (
        <div className="flex justify-center mb-6">
          {illustration}
        </div>
      ) : icon ? (
        <div className="flex justify-center mb-6">
          <Icon
            name={icon}
            size={iconSize}
            variant="default"
            className="text-gray-300"
          />
        </div>
      ) : null}

      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        {heading}
      </h2>

      <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {primaryAction && (
          <Button
            variant="primary"
            onClick={primaryAction.onClick}
            icon={primaryAction.icon}
          >
            {primaryAction.label}
          </Button>
        )}
        {secondaryAction && (
          <Button
            variant="secondary"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}
```

### Usage Examples

```tsx
// No groups created
<EmptyState
  icon="social-users"
  heading="Start Your First Savings Group"
  message="Create a group to save together with friends and family."
  primaryAction={{
    label: "Create Group",
    onClick: () => navigate('/create'),
    icon: "action-add",
  }}
  secondaryAction={{
    label: "Learn More",
    onClick: openTutorial,
  }}
/>

// No search results
<EmptyState
  icon="ui-search"
  heading="No Groups Found"
  message="Try different keywords or browse all groups."
  compact={true}
  primaryAction={{
    label: "Clear Search",
    onClick: clearSearch,
  }}
/>

// Custom illustration
<EmptyState
  illustration={<CustomIllustration />}
  heading="No Transactions Yet"
  message="Your transaction history will appear here."
/>
```

---

## 3. LoadingState Component

### Purpose
Display loading indicators with optional message and progress.

### TypeScript Interface

```typescript
interface LoadingStateProps {
  // Visual
  variant: 'spinner' | 'skeleton' | 'progress'
  size?: 'sm' | 'md' | 'lg'
  
  // Content
  message?: string
  progress?: number // 0-100
  
  // Styling
  className?: string
  fullPage?: boolean
}
```

### Implementation

```tsx
import React from 'react'
import { Spinner } from './Spinner'
import { ProgressBar } from './ProgressBar'

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  size = 'md',
  message,
  progress,
  className = '',
  fullPage = false,
}) => {
  const sizeMap = {
    sm: 24,
    md: 48,
    lg: 64,
  }

  const spinnerSize = sizeMap[size]

  const containerClass = fullPage
    ? 'min-h-screen flex items-center justify-center'
    : 'w-full py-12'

  if (variant === 'skeleton') {
    return <SkeletonLoader className={className} />
  }

  return (
    <div className={containerClass}>
      <div className={`text-center ${className}`}>
        {variant === 'spinner' && (
          <div className="flex justify-center mb-4">
            <Spinner size={spinnerSize} />
          </div>
        )}

        {message && (
          <p className="text-base text-gray-600 mb-4">
            {message}
          </p>
        )}

        {variant === 'progress' && progress !== undefined && (
          <div className="max-w-xs mx-auto">
            <ProgressBar value={progress} />
            <p className="text-sm text-gray-500 mt-2">
              {progress}% complete
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 4. Toast Component

### Purpose
Display temporary notifications for success, error, warning, and info messages.

### TypeScript Interface

```typescript
interface ToastProps {
  // Visual
  variant: 'success' | 'error' | 'warning' | 'info'
  icon?: IconName
  
  // Content
  message: string
  description?: string
  
  // Behavior
  duration?: number // milliseconds
  onClose?: () => void
  
  // Actions
  action?: {
    label: string
    onClick: () => void
  }
}
```

### Implementation

```tsx
import React, { useEffect, useState } from 'react'
import { Icon, IconName } from './Icon'
import { Button } from './Button'

export const Toast: React.FC<ToastProps> = ({
  variant,
  icon,
  message,
  description,
  duration = 4000,
  onClose,
  action,
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 200)
  }

  if (!isVisible) return null

  const variantStyles = {
    success: 'bg-green-50 border-green-200 border-l-green-600',
    error: 'bg-red-50 border-red-200 border-l-red-600',
    warning: 'bg-amber-50 border-amber-200 border-l-amber-600',
    info: 'bg-blue-50 border-blue-200 border-l-blue-600',
  }

  const iconMap: Record<string, IconName> = {
    success: 'validation-check',
    error: 'status-error',
    warning: 'status-warning',
    info: 'status-active',
  }

  const iconVariants = {
    success: 'success' as const,
    error: 'error' as const,
    warning: 'warning' as const,
    info: 'info' as const,
  }

  return (
    <div
      role="alert"
      className={`
        ${variantStyles[variant]}
        border border-l-4 rounded-lg p-4
        shadow-lg max-w-md
        transition-all duration-200
        ${isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
      `}
    >
      <div className="flex items-start gap-3">
        <Icon
          name={icon || iconMap[variant]}
          size={20}
          variant={iconVariants[variant]}
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {message}
          </p>
          {description && (
            <p className="text-sm text-gray-600 mt-1">
              {description}
            </p>
          )}
          {action && (
            <Button
              variant="link"
              size="sm"
              onClick={action.onClick}
              className="mt-2"
            >
              {action.label}
            </Button>
          )}
        </div>

        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close notification"
        >
          <Icon name="ui-close" size={16} />
        </button>
      </div>
    </div>
  )
}
```

### Toast Manager Hook

```typescript
import { useState, useCallback } from 'react'

interface ToastOptions {
  variant: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>([])

  const showToast = useCallback((options: ToastOptions) => {
    const id = Date.now()
    setToasts(prev => [...prev, { ...options, id }])
  }, [])

  const success = useCallback((message: string, description?: string) => {
    showToast({ variant: 'success', message, description })
  }, [showToast])

  const error = useCallback((message: string, description?: string) => {
    showToast({ variant: 'error', message, description })
  }, [showToast])

  const warning = useCallback((message: string, description?: string) => {
    showToast({ variant: 'warning', message, description })
  }, [showToast])

  const info = useCallback((message: string, description?: string) => {
    showToast({ variant: 'info', message, description })
  }, [showToast])

  return { success, error, warning, info, toasts }
}
```

### Usage

```tsx
const { success, error } = useToast()

// Show success toast
success("Group created successfully!")

// Show error toast
error("Failed to create group", "Please try again later")
```

---

## 5. ConfirmDialog Component

### Purpose
Modal dialog for confirming actions with customizable content and buttons.

### TypeScript Interface

```typescript
interface ConfirmDialogProps {
  // State
  isOpen: boolean
  onClose: () => void
  
  // Visual
  variant: 'destructive' | 'warning' | 'info' | 'success'
  icon?: IconName
  
  // Content
  title: string
  message: string
  details?: React.ReactNode
  
  // Actions
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  
  // State
  isLoading?: boolean
  
  // Accessibility
  ariaLabel?: string
}
```

### Implementation

```tsx
import React, { useEffect, useRef } from 'react'
import { Icon, IconName } from './Icon'
import { Button } from './Button'

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  variant,
  icon,
  title,
  message,
  details,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isLoading = false,
  ariaLabel,
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      cancelButtonRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const variantStyles = {
    destructive: 'border-t-red-600',
    warning: 'border-t-amber-600',
    info: 'border-t-blue-600',
    success: 'border-t-green-600',
  }

  const iconVariants = {
    destructive: 'error' as const,
    warning: 'warning' as const,
    info: 'info' as const,
    success: 'success' as const,
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-2xl shadow-2xl
          max-w-md w-full p-8
          border-t-4 ${variantStyles[variant]}
        `}
      >
        {icon && (
          <div className="flex justify-center mb-4">
            <Icon
              name={icon}
              size={48}
              variant={iconVariants[variant]}
            />
          </div>
        )}

        <h2
          id="dialog-title"
          className="text-xl font-bold text-gray-900 text-center mb-3"
        >
          {title}
        </h2>

        <p
          id="dialog-description"
          className="text-base text-gray-600 text-center mb-6"
        >
          {message}
        </p>

        {details && (
          <div className="mb-6">
            {details}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

## 6. PermissionState Component

### Purpose
Display permission-denied or locked feature states.

### TypeScript Interface

```typescript
interface PermissionStateProps {
  // Visual
  icon: IconName
  variant: 'locked' | 'restricted' | 'unavailable'
  
  // Content
  heading: string
  message: string
  requirement?: string
  
  // Actions
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  
  // Styling
  className?: string
}
```

### Implementation

```tsx
import React from 'react'
import { Icon, IconName } from './Icon'
import { Button } from './Button'

export const PermissionState: React.FC<PermissionStateProps> = ({
  icon,
  variant,
  heading,
  message,
  requirement,
  action,
  secondaryAction,
  className = '',
}) => {
  const variantStyles = {
    locked: 'bg-gray-50 border-gray-300 border-dashed',
    restricted: 'bg-amber-50 border-amber-200',
    unavailable: 'bg-blue-50 border-blue-200',
  }

  return (
    <div
      className={`
        ${variantStyles[variant]}
        border-2 rounded-xl p-8
        text-center max-w-md mx-auto
        ${className}
      `}
    >
      <div className="flex justify-center mb-4">
        <Icon
          name={icon}
          size={64}
          variant="default"
          className="text-gray-400"
        />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {heading}
      </h2>

      <p className="text-base text-gray-600 mb-4">
        {message}
      </p>

      {requirement && (
        <div className="bg-white rounded-lg p-3 mb-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-700">
            {requirement}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {action && (
          <Button
            variant="primary"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button
            variant="secondary"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}
```

---

**Version**: 1.0  
**Last Updated**: February 20, 2026

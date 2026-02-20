// Issue #32: Implement error boundary and error handling
// Complexity: High (200 pts)
// Status: Placeholder

import React from 'react'
import { analytics } from '../services/analytics'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error in analytics
    analytics.trackError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    }, 'critical')

    console.error('ErrorBoundary caught error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-md theme-surface p-6">
            <h2 className="text-2xl font-bold theme-danger mb-2">Something went wrong</h2>
            <p className="theme-muted mb-4">
              An unexpected error occurred. Please reload the page or contact support.
            </p>
            {this.state.error && (
              <pre className="text-xs theme-muted theme-surface-muted p-2 rounded mb-4 overflow-auto">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="theme-btn px-4 py-2"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

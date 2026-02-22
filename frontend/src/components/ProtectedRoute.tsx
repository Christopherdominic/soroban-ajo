import React from 'react'
import { useAuthContext } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** Optional fallback UI shown while auth state is loading */
  loadingFallback?: React.ReactNode
  /** Optional component rendered when the user is not authenticated */
  unauthenticatedFallback?: React.ReactNode
}

/**
 * Wraps child components so they are only rendered when the user
 * is authenticated. While the session is being restored it shows
 * a loading indicator; if the user is not logged in it renders
 * the unauthenticated fallback (defaults to a redirect prompt).
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  loadingFallback,
  unauthenticatedFallback,
}) => {
  const { isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <>
        {loadingFallback ?? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-gray-600 text-sm">Checking authentication…</p>
            </div>
          </div>
        )}
      </>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        {unauthenticatedFallback ?? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-5">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Authentication Required
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Please connect your Stellar wallet to access this page.
                Your session may have expired.
              </p>
            </div>
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}

'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '../hooks/useAuth'
import type { AuthState, AuthActions } from '../types/auth'

type AuthContextValue = AuthState & AuthActions

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuthStore()

  useEffect(() => {
    // Silently restore session in background without blocking UI
    authState.checkSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  
  return context
}

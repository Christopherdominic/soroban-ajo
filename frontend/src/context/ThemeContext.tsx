'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'soroban-ajo-theme'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setThemeState(getStoredTheme())
  }, [])

  useEffect(() => {
    if (!mounted) return

    const resolved = theme === 'system' ? getSystemTheme() : theme
    setResolvedTheme(resolved)

    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme, mounted])

  useEffect(() => {
    if (theme !== 'system' || !mounted) return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const resolved = media.matches ? 'dark' : 'light'
      setResolvedTheme(resolved)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(resolved)
    }
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [theme, mounted])

  const setTheme = (next: Theme) => {
    setThemeState(next)
  }

  const toggleTheme = () => {
    setThemeState((prev) => {
      const resolved = prev === 'system' ? getSystemTheme() : prev
      return resolved === 'light' ? 'dark' : 'light'
    })
  }

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

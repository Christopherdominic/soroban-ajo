import { createContext, useEffect, useMemo, useState } from 'react'

export type ThemeMode = 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

type ThemeContextValue = {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const MODE_KEY = 'theme:mode'

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  try {
    const val = localStorage.getItem(MODE_KEY)
    return val === 'light' || val === 'dark' ? val : 'light'
  } catch {
    return 'light'
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getStoredMode)
  const resolvedTheme: ResolvedTheme = mode

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.setAttribute('data-theme', resolvedTheme)
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(MODE_KEY, mode)
    } catch {
      // ignore storage failures
    }
  }, [mode])

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
      toggleTheme: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [mode, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
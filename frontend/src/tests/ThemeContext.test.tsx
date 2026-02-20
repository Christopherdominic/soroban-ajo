import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '../context/ThemeContext'
import { useTheme } from '@/hooks/useTheme'

function Harness() {
  const { mode, resolvedTheme, setMode, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setMode('dark')}>set-dark</button>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

function mockMatchMedia(isDark = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: isDark,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    mockMatchMedia(false)
  })

  it('defaults to light mode', () => {
    render(
      <ThemeProvider>
        <Harness />
      </ThemeProvider>
    )
    expect(screen.getByTestId('mode').textContent).toBe('light')
    expect(screen.getByTestId('resolved').textContent).toBe('light')
  })

  it('supports manual switching and persists preference', () => {
    render(
      <ThemeProvider>
        <Harness />
      </ThemeProvider>
    )
    fireEvent.click(screen.getByText('set-dark'))
    expect(screen.getByTestId('mode').textContent).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('theme:mode')).toBe('dark')
  })
})
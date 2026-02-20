import { describe, expect, it } from 'vitest'
import { render, within } from '@testing-library/react'
import App from '@/App'
import { ThemeProvider } from '@/context/ThemeContext'

describe('App', () => {
  it('renders the app header', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    )
    const header = document.querySelector<HTMLElement>('header.app-header')
    expect(header).not.toBeNull()
    if (!header) throw new Error('App header not found')
    expect(within(header).getByRole('heading', { name: 'Soroban Ajo' })).toBeInTheDocument()
  })
})

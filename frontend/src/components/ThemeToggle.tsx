import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <button className="theme-btn" type="button" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </div>
  )
}

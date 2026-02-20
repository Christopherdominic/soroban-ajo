import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
	const { mode, toggleTheme } = useTheme()

	return (
		<div className="flex items-center gap-2">
			<button className="theme-btn" type="button" onClick={toggleTheme} aria-label="Toggle theme">
				{mode === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
			</button>
		</div>
	)
}

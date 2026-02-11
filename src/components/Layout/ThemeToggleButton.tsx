import { SunIcon, MoonIcon } from '@/components/icons'

interface ThemeToggleButtonProps {
  resolvedTheme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggleButton({ resolvedTheme, onToggle }: ThemeToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed top-[6px] right-3 z-10 p-2 rounded-lg bg-gray-100 dark:bg-[#2d2d2d] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] text-gray-600 dark:text-gray-400 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <SunIcon size={13} /> : <MoonIcon size={13} />}
    </button>
  )
}

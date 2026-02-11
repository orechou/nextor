import { useState, useEffect } from 'react'
import { THEME, type Theme } from '@/lib/constants'

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME.STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    // Ignore localStorage errors
  }
  return 'system'
}

function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME.STORAGE_KEY, theme)
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent(THEME.STORAGE_EVENT, { detail: { theme } }))
  } catch {
    // Ignore localStorage errors
  }
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => resolveTheme(getStoredTheme()))

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    const resolved = resolveTheme(theme)
    root.classList.add(resolved)
    setResolvedTheme(resolved)
  }, [theme])

  // Listen for theme changes from other components
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      const newTheme = event.detail.theme as Theme
      if (newTheme !== theme) {
        setTheme(newTheme)
      }
    }

    window.addEventListener(THEME.STORAGE_EVENT, handleThemeChange as EventListener)
    return () => {
      window.removeEventListener(THEME.STORAGE_EVENT, handleThemeChange as EventListener)
    }
  }, [theme])

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const resolved = resolveTheme(theme)
      setResolvedTheme(resolved)
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    storeTheme(newTheme)
  }

  return {
    theme,
    resolvedTheme,
    setTheme: handleSetTheme,
  }
}

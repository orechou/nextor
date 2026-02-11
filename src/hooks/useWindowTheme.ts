import { useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'

export function useWindowTheme(theme: 'light' | 'dark') {
  useEffect(() => {
    const setTheme = async () => {
      try {
        await invoke('set_window_theme', { theme })
      } catch (error) {
        console.error('Failed to set window theme:', error)
      }
    }
    setTheme()
  }, [theme])
}

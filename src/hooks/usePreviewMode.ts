import { useState, useCallback, useEffect } from 'react'
import type { WeChatTheme } from '@/lib/export'
import { PREVIEW } from '@/lib/constants/preview'

export function usePreviewMode() {
  const [wechatMode, setWechatMode] = useState<boolean>(false)
  const [wechatTheme, setWechatTheme] = useState<WeChatTheme>(PREVIEW.DEFAULT_WECHAT_THEME as WeChatTheme)
  const [includeTitle, setIncludeTitle] = useState<boolean>(PREVIEW.DEFAULT_INCLUDE_TITLE)

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREVIEW.STORAGE_KEY)
      if (stored) {
        const prefs = JSON.parse(stored) as { wechatMode?: boolean, wechatTheme?: string, includeTitle?: boolean }
        setWechatMode(prefs.wechatMode || false)
        setWechatTheme((prefs.wechatTheme || PREVIEW.DEFAULT_WECHAT_THEME) as WeChatTheme)
        setIncludeTitle(prefs.includeTitle ?? PREVIEW.DEFAULT_INCLUDE_TITLE)
      }
    } catch {
      // Use default values
    }
  }, [])

  // Save preferences to localStorage
  const savePreferences = useCallback((prefs: { wechatMode?: boolean, wechatTheme?: WeChatTheme, includeTitle?: boolean }) => {
    const currentPrefs = {
      wechatMode,
      wechatTheme,
      includeTitle
    }
    const newPrefs = { ...currentPrefs, ...prefs }

    localStorage.setItem(PREVIEW.STORAGE_KEY, JSON.stringify({
      wechatMode: newPrefs.wechatMode,
      wechatTheme: newPrefs.wechatTheme,
      includeTitle: newPrefs.includeTitle
    }))
  }, [wechatMode, wechatTheme, includeTitle])

  const handleWechatModeChange = useCallback((enabled: boolean) => {
    setWechatMode(enabled)
    savePreferences({ wechatMode: enabled })
  }, [savePreferences])

  const handleWechatThemeChange = useCallback((theme: WeChatTheme) => {
    setWechatTheme(theme)
    savePreferences({ wechatTheme: theme })
  }, [savePreferences])

  const handleIncludeTitleChange = useCallback((include: boolean) => {
    setIncludeTitle(include)
    savePreferences({ includeTitle: include })
  }, [savePreferences])

  return {
    wechatMode,
    wechatTheme,
    includeTitle,
    setWechatMode: handleWechatModeChange,
    setWechatTheme: handleWechatThemeChange,
    setIncludeTitle: handleIncludeTitleChange,
  }
}

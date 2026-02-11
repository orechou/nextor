import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { buildNativeMenu, type MenuAction } from '@/lib/menuBuilder'
import { MenuItemId } from '@/lib/menuItems'
import { logger } from '@/lib/logger'

export interface MenuCallbacks {
  onAbout: () => void
  onNew: () => void
  onOpen: () => void
  onSave: () => void
  onSaveAs: () => void
  onExport: () => void
  onWeChatExport: () => void
  onOpenFolder: () => void
  onCloseFolder: () => void
  onViewModeChange: (mode: 'edit' | 'preview' | 'split') => void
  onCycleViewMode: () => void
  onToggleLeftSidebar: () => void
  onToggleRightSidebar: () => void
  onThemeChange: (theme: 'system' | 'light' | 'dark') => void
  onLanguageChange: (lang: string) => void
  onPresentation: () => void
  onFind?: () => void
  onReplace?: () => void
  onToggleToc?: () => void
  onExportPDF?: () => void
}

export interface MenuState {
  hasOpenFile: boolean
}

export function useAppMenu(callbacks: MenuCallbacks, state: MenuState) {
  const { t } = useTranslation()

  useEffect(() => {
    async function initMenu() {
      try {
        const actions: MenuAction[] = [
          { id: MenuItemId.ABOUT, handler: callbacks.onAbout },
          { id: MenuItemId.NEW, handler: callbacks.onNew },
          { id: MenuItemId.OPEN, handler: callbacks.onOpen },
          { id: MenuItemId.SAVE, handler: callbacks.onSave, enabled: state.hasOpenFile },
          { id: MenuItemId.SAVE_AS, handler: callbacks.onSaveAs },
          { id: MenuItemId.EXPORT_HTML, handler: callbacks.onExport },
          { id: MenuItemId.EXPORT_WECHAT, handler: callbacks.onWeChatExport },
          { id: MenuItemId.OPEN_FOLDER, handler: callbacks.onOpenFolder },
          { id: MenuItemId.CLOSE_FOLDER, handler: callbacks.onCloseFolder },
          { id: MenuItemId.VIEW_CYCLE_MODES, handler: callbacks.onCycleViewMode },
          { id: MenuItemId.VIEW_EDITOR, handler: () => callbacks.onViewModeChange('edit') },
          { id: MenuItemId.VIEW_SPLIT, handler: () => callbacks.onViewModeChange('split') },
          { id: MenuItemId.VIEW_PREVIEW, handler: () => callbacks.onViewModeChange('preview') },
          { id: MenuItemId.TOGGLE_FILE_EXPLORER, handler: callbacks.onToggleLeftSidebar },
          { id: MenuItemId.TOGGLE_PREVIEW_PANEL, handler: callbacks.onToggleRightSidebar },
          { id: MenuItemId.THEME_SYSTEM, handler: () => callbacks.onThemeChange('system') },
          { id: MenuItemId.THEME_LIGHT, handler: () => callbacks.onThemeChange('light') },
          { id: MenuItemId.THEME_DARK, handler: () => callbacks.onThemeChange('dark') },
          { id: MenuItemId.LANG_EN, handler: () => callbacks.onLanguageChange('en') },
          { id: MenuItemId.LANG_ZH, handler: () => callbacks.onLanguageChange('zh') },
          { id: MenuItemId.PRESENTATION, handler: callbacks.onPresentation },
          { id: MenuItemId.FIND, handler: callbacks.onFind || (() => {}) },
          { id: MenuItemId.REPLACE, handler: callbacks.onReplace || (() => {}) },
          { id: MenuItemId.TOGGLE_TOC, handler: callbacks.onToggleToc || (() => {}) },
          { id: MenuItemId.EXPORT_PDF, handler: callbacks.onExportPDF || (() => {}) },
        ]

        const menu = await buildNativeMenu({ t, actions, hasOpenFile: state.hasOpenFile })
        await menu.setAsAppMenu()
      } catch (error) {
        logger.error('Failed to initialize app menu', error)
      }
    }

    initMenu()
  }, [t, callbacks, state.hasOpenFile])
}

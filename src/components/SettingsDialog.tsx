import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/hooks/useTheme'
import type { Theme } from '@/lib/constants'

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme)
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language)

  // Sync local state with actual theme when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedTheme(theme)
      setSelectedLanguage(i18n.language)
    }
  }, [open, theme, i18n.language])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleThemeChange = (newTheme: Theme) => {
    setSelectedTheme(newTheme)
    setTheme(newTheme)
  }

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang)
    i18n.changeLanguage(lang)
  }

  if (!open) return null

  const themeOptions: { value: Theme; label: string }[] = [
    { value: 'light', label: t('menu.themeLight') },
    { value: 'dark', label: t('menu.themeDark') },
    { value: 'system', label: t('menu.themeSystem') },
  ]

  const languageOptions = [
    { value: 'zh', label: '简体中文' },
    { value: 'en', label: 'English' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h2>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Theme Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('menu.theme')}
            </label>
            <div className="space-y-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`
                    w-full text-left px-4 py-2.5 rounded-md transition-colors flex items-center justify-between
                    ${selectedTheme === option.value
                      ? 'bg-blue-50 border border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <span className="font-medium">{option.label}</span>
                  {selectedTheme === option.value && (
                    <svg className="w-5 h-5 text-current" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Language Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('menu.language')}
            </label>
            <div className="space-y-2">
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleLanguageChange(option.value)}
                  className={`
                    w-full text-left px-4 py-2.5 rounded-md transition-colors flex items-center justify-between
                    ${selectedLanguage === option.value
                      ? 'bg-blue-50 border border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <span className="font-medium">{option.label}</span>
                  {selectedLanguage === option.value && (
                    <svg className="w-5 h-5 text-current" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { WeChatTheme, WeChatExportOptions } from '@/lib/export'
import { usePreviewMode } from '@/hooks/usePreviewMode'
import { WeChatThemeCard } from './WeChatThemeCard'
import { getSortedThemeMetadata } from '@/lib/wechat/themeMetadata'

interface WeChatExportDialogProps {
  open: boolean
  onClose: () => void
  onExport: (method: 'file' | 'clipboard', options: WeChatExportOptions) => void
}

export function WeChatExportDialog({ open, onClose, onExport }: WeChatExportDialogProps) {
  const { t } = useTranslation()
  const { wechatTheme, setWechatTheme, includeTitle, setIncludeTitle } = usePreviewMode()
  const [localTheme, setLocalTheme] = useState<WeChatTheme>(wechatTheme)
  const [localIncludeTitle, setLocalIncludeTitle] = useState(includeTitle)

  // Sync local state with hook state when dialog opens
  useEffect(() => {
    if (open) {
      setLocalTheme(wechatTheme)
      setLocalIncludeTitle(includeTitle)
    }
  }, [open, wechatTheme, includeTitle])

  const handleSaveFile = () => {
    setWechatTheme(localTheme)
    setIncludeTitle(localIncludeTitle)
    onExport('file', { theme: localTheme, includeTitle: localIncludeTitle })
    onClose()
  }

  const handleCopyToClipboard = () => {
    setWechatTheme(localTheme)
    setIncludeTitle(localIncludeTitle)
    onExport('clipboard', { theme: localTheme, includeTitle: localIncludeTitle })
    onClose()
  }

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

  if (!open) return null

  const sortedThemes = getSortedThemeMetadata()

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('export.wechat_title')}
          </h2>
        </div>

        {/* Theme grid - using cards */}
        <div className="px-6 py-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('export.style_theme')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sortedThemes.map((metadata) => (
              <WeChatThemeCard
                key={metadata.id}
                theme={metadata.id}
                metadata={metadata}
                isSelected={localTheme === metadata.id}
                onSelect={() => setLocalTheme(metadata.id)}
              />
            ))}
          </div>
        </div>

        {/* Include title checkbox */}
        <div className="px-6 py-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localIncludeTitle}
              onChange={(e) => setLocalIncludeTitle(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('export.include_title')}
            </span>
          </label>
        </div>

        {/* Action buttons */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {t('export.copy_clipboard')}
          </button>
          <button
            onClick={handleSaveFile}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            {t('export.save_file')}
          </button>
        </div>
      </div>
    </div>
  )
}

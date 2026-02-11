import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import type { WeChatThemeMetadata, WeChatTheme } from '@/lib/wechat/types'

interface WeChatThemeCardProps {
  theme: WeChatTheme
  metadata: WeChatThemeMetadata
  isSelected: boolean
  onSelect: () => void
}

export function WeChatThemeCard({ metadata, isSelected, onSelect }: WeChatThemeCardProps) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onSelect}
      className={cn(
        "wechat-theme-card group relative p-3 rounded-lg border-2 transition-all text-left",
        "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500",
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-700"
      )}
    >
      {/* Mini preview area */}
      <div className="theme-preview mb-2 h-20 rounded bg-white dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700">
        <style>{metadata.previewCSS}</style>
        <div className="mini-preview-content p-2">
          <h3 className="text-xs font-bold mb-1">{t('export.sample_title')}</h3>
          <p className="text-[10px] text-gray-600 dark:text-gray-400">{t('export.sample_text')}</p>
        </div>
      </div>

      <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{t(metadata.name)}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(metadata.description)}</p>

      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  )
}

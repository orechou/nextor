import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getWordCountStats } from '@/lib/wordCount'
import { cn } from '@/lib/utils'

interface StatusBarProps {
  content: string
}

export function StatusBar({ content }: StatusBarProps) {
  const { t } = useTranslation()

  const stats = useMemo(() => getWordCountStats(content), [content])

  return (
    <div className={cn(
      "flex items-center gap-4 px-4 py-1 text-xs border-t shrink-0",
      "bg-gray-50 dark:bg-[#1e1e1e]",
      "border-gray-200 dark:border-[#2d2d2d]",
      "text-gray-600 dark:text-gray-400"
    )}>
      <span className="whitespace-nowrap">{t('statusBar.words')}: {stats.words}</span>
      <span className="whitespace-nowrap">{t('statusBar.chars')}: {stats.characters}</span>
      <span className="whitespace-nowrap">{t('statusBar.lines')}: {stats.lines}</span>
    </div>
  )
}

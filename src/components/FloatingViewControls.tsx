import { FileText, Columns, Eye, Sidebar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface FloatingViewControlsProps {
  viewMode: 'edit' | 'preview' | 'split'
  onViewModeChange: (mode: 'edit' | 'preview' | 'split') => void
  leftSidebarOpen: boolean
  onToggleLeftSidebar: () => void
}

export function FloatingViewControls({
  viewMode,
  onViewModeChange,
  leftSidebarOpen,
  onToggleLeftSidebar
}: FloatingViewControlsProps) {
  const { t } = useTranslation()

  const controls = [
    {
      icon: Sidebar,
      label: t('menu.fileExplorer') || 'File Explorer',
      action: onToggleLeftSidebar,
      active: leftSidebarOpen
    },
    {
      value: 'edit' as const,
      icon: FileText,
      label: t('editor.source'),
      action: () => onViewModeChange('edit'),
      active: viewMode === 'edit'
    },
    {
      value: 'split' as const,
      icon: Columns,
      label: t('editor.split'),
      action: () => onViewModeChange('split'),
      active: viewMode === 'split'
    },
    {
      value: 'preview' as const,
      icon: Eye,
      label: t('editor.preview'),
      action: () => onViewModeChange('preview'),
      active: viewMode === 'preview'
    },
  ]

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="flex items-center gap-0.5 p-1 bg-background/90 backdrop-blur-sm border rounded-md shadow-lg">
        {controls.map(({ icon: Icon, label, action, active }) => (
          <button
            key={label}
            onClick={action}
            title={label}
            aria-label={label}
            className={cn(
              "p-1.5 rounded-sm transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  )
}

import { FolderOpen, X, ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FileExplorerHeaderProps {
  currentDirectory: string
  onOpenFolder: () => void
  onCloseFolder: () => void
  onToggle: () => void
}

export function FileExplorerHeader({
  currentDirectory,
  onOpenFolder,
  onCloseFolder,
  onToggle,
}: FileExplorerHeaderProps) {
  const { t } = useTranslation()

  // Extract folder name from path
  const folderName = currentDirectory ? currentDirectory.split('/').pop() || currentDirectory : null

  return (
    <div className="flex items-center justify-between p-2 border-b bg-muted/30">
      <div className="flex items-center gap-1 min-w-0">
        {folderName && (
          <span className="text-sm font-medium truncate flex items-center gap-1">
            <FolderOpen className="w-4 h-4 shrink-0" />
            {folderName}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onOpenFolder}
          className="p-1.5 hover:bg-muted rounded"
          title={t('menu.openFolder')}
        >
          <FolderOpen className="w-4 h-4" />
        </button>
        {currentDirectory && (
          <button
            onClick={onCloseFolder}
            className="p-1.5 hover:bg-muted rounded"
            title={t('menu.closeFolder')}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-muted rounded"
          title="Collapse"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

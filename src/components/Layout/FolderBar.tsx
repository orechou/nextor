import { useState, useCallback, memo } from 'react'
import { FolderIcon, FolderPlus, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { ContextMenu, type ContextMenuItem } from '@/components/FileExplorer/ContextMenu'

export interface FolderInfo {
  path: string
  name: string
}

interface FolderBarProps {
  folders: FolderInfo[]
  activeFolder: string | undefined
  onFolderSelect: (folder: string) => void
  onFolderClose: (folder: string) => void
  onAddFolder: () => void
  isOpen: boolean
}

function FolderBar({
  folders,
  activeFolder,
  onFolderSelect,
  onFolderClose,
  onAddFolder,
  isOpen,
}: FolderBarProps) {
  const { t } = useTranslation()
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; folderPath: string } | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent, folderPath: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, folderPath })
  }, [])

  const handleContextMenuClose = useCallback(() => {
    setContextMenu(null)
  }, [])

  const getContextMenuItems = useCallback((folderPath: string): ContextMenuItem[] => {
    const items: ContextMenuItem[] = [
      {
        id: 'close',
        label: t('folder.close'),
        icon: <XIcon className="w-4 h-4" />,
        onClick: () => onFolderClose(folderPath),
      },
    ]
    return items
  }, [t, onFolderClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="flex flex-col w-12 bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
      {/* Add folder button */}
      <div className="p-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onAddFolder}
          className="w-full h-8 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded"
          title={t('folder.add')}
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Folder list */}
      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        {folders.map((folder) => (
          <div key={folder.path} className="relative">
            {/* Folder button */}
            <button
              onClick={() => onFolderSelect(folder.path)}
              onContextMenu={(e) => handleContextMenu(e, folder.path)}
              className={cn(
                "w-full h-10 flex items-center justify-center relative",
                activeFolder === folder.path
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
              title={folder.path}
            >
              <FolderIcon className="w-5 h-5" />

              {/* Active indicator */}
              {activeFolder != null && activeFolder === folder.path && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 dark:bg-blue-400 rounded-r" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Global context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getContextMenuItems(contextMenu.folderPath)}
          onClose={handleContextMenuClose}
        />
      )}
    </div>
  )
}

// Memoize FolderBar to prevent unnecessary re-renders
const FolderBarMemo = memo(FolderBar, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these key props change
  return (
    prevProps.activeFolder === nextProps.activeFolder &&
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.folders.length === nextProps.folders.length &&
    prevProps.folders.every((f, i) => f.path === nextProps.folders[i]?.path)
  )
})

export { FolderBarMemo as FolderBar }

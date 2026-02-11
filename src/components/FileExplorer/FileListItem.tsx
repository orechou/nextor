import { useState, useCallback, memo } from 'react'
import { File, Trash2, Folder } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import { ContextMenu, type ContextMenuItem } from './ContextMenu'

interface FileListItemProps {
  name: string
  depth: number
  isActive: boolean
  onClick: () => void
  path?: string
  onDelete?: (path: string) => void
  isFolder?: boolean
}

function FileListItem({
  name,
  depth,
  isActive,
  onClick,
  path,
  onDelete,
  isFolder = false,
}: FileListItemProps) {
  const { resolvedTheme } = useTheme()
  const { t } = useTranslation()
  const isDark = resolvedTheme === 'dark'
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const handleContextMenuClose = useCallback(() => {
    setContextMenu(null)
  }, [])

  const contextMenuItems: ContextMenuItem[] = []

  if (onDelete && path) {
    contextMenuItems.push({
      id: 'delete',
      label: isFolder ? t('contextMenu.deleteFolder') : t('contextMenu.deleteFile'),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => onDelete(path),
      danger: true,
    })
  }

  return (
    <>
      <div
        onClick={onClick}
        onContextMenu={handleContextMenu}
        title={name}
        className={cn(
          'relative flex items-center gap-2 px-3 py-2 cursor-pointer select-none text-sm rounded-lg',
          'transition-all duration-200 ease-out mx-1 my-0.5',
          isDark ? 'hover:bg-[#2d2d2d]' : 'hover:bg-gray-200',
          isActive && (isDark
            ? 'bg-blue-900/30 text-blue-400'
            : 'bg-blue-100 text-blue-600'
          ),
          isActive && 'font-semibold'
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {isFolder ? (
          <Folder className={cn(
            "w-4 h-4 shrink-0",
            isDark ? "text-amber-400" : "text-amber-500"
          )} />
        ) : (
          <File className={cn(
            "w-4 h-4 shrink-0",
            isDark ? "text-sky-400" : "text-sky-500"
          )} />
        )}
        <span className={cn(
          "truncate flex-1 min-w-0",
          isActive
            ? (isDark ? "text-blue-400" : "text-blue-600")
            : (isDark ? "text-gray-300" : "text-gray-700"),
          !isActive && 'font-medium'
        )}>
          {name}
        </span>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={handleContextMenuClose}
        />
      )}
    </>
  )
}

// Memoize FileListItem with custom comparison function
const FileListItemMemo = memo(FileListItem, (prevProps, nextProps) => {
  // Only re-render if these key props change
  return (
    prevProps.path === nextProps.path &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.name === nextProps.name &&
    prevProps.depth === nextProps.depth &&
    prevProps.isFolder === nextProps.isFolder
  )
})

export { FileListItemMemo as FileListItem }

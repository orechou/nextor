import { useState, useCallback, useMemo, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, FileEdit } from 'lucide-react'
import { useReadDirectory, type DirEntry } from '@/lib/query'
import { FILE } from '@/lib/constants'
import { FileListItem } from './FileListItem'
import { NewFileDialog } from './NewFileDialog'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'

interface FileTreeProps {
  directory: string
  onFileSelect: (path: string) => void
  activeFilePath: string
  onCreateFile?: (fileName: string) => void
  onDeleteFile?: (filePath: string) => void
  onDeleteFolder?: (folderPath: string) => void
}

/**
 * Check if a file is a Markdown file
 */
function isMarkdownFile(fileName: string): boolean {
  return FILE.MARKDOWN_EXTENSIONS.some(ext => fileName.endsWith(`.${ext}`))
}

function FileTree({ directory, onFileSelect, activeFilePath, onCreateFile, onDeleteFile, onDeleteFolder }: FileTreeProps) {
  const { t } = useTranslation()
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState<{ path: string; isFolder: boolean } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { data: entries, isLoading, error } = useReadDirectory(directory)

  // Filter entries: show all folders and markdown files, then filter by search query
  const filteredEntries = useMemo(() => {
    if (!entries) return []
    let result = entries.filter(entry =>
      entry.isDirectory || (entry.isFile && isMarkdownFile(entry.name))
    )
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(entry =>
        entry.name.toLowerCase().includes(query)
      )
    }
    return result
  }, [entries, searchQuery])

  const handleClick = useCallback((entry: DirEntry) => {
    if (entry.isFile) {
      onFileSelect(entry.path)
    }
    // Folders are not clickable in this simple implementation
    // Could be expanded to support folder navigation
  }, [onFileSelect])

  const handleCreateFile = useCallback((fileName: string) => {
    onCreateFile?.(fileName)
  }, [onCreateFile])

  const handleDeleteClick = useCallback((itemPath: string, isFolder: boolean) => {
    setDeleteCandidate({ path: itemPath, isFolder })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteCandidate) {
      if (deleteCandidate.isFolder) {
        onDeleteFolder?.(deleteCandidate.path)
      } else {
        onDeleteFile?.(deleteCandidate.path)
      }
      setDeleteCandidate(null)
    }
  }, [deleteCandidate, onDeleteFile, onDeleteFolder])

  // Sort: folders first, then files, both alphabetically
  // IMPORTANT: This must be called before any early returns to avoid hooks order violation
  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  }, [filteredEntries])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-muted-foreground text-sm">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 text-destructive text-sm">
        Failed to load directory
      </div>
    )
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 text-muted-foreground text-sm">
        Empty folder
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Search bar and new file button */}
      {onCreateFile && (
        <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('fileExplorer.search_placeholder')}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-md text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowNewFileDialog(true)}
            className="p-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="New file"
          >
            <FileEdit className="h-4 w-4" />
          </button>
        </div>
      )}

      {sortedEntries.map(entry => (
        <FileListItem
          key={entry.path}
          name={entry.name}
          depth={0}
          path={entry.path}
          isActive={activeFilePath === entry.path}
          onClick={() => handleClick(entry)}
          onDelete={(entry.isDirectory && onDeleteFolder) || (!entry.isDirectory && onDeleteFile)
            ? (path) => handleDeleteClick(path, entry.isDirectory)
            : undefined}
          isFolder={entry.isDirectory}
        />
      ))}

      {showNewFileDialog && onCreateFile && (
        <NewFileDialog
          isOpen={showNewFileDialog}
          onClose={() => setShowNewFileDialog(false)}
          onCreate={handleCreateFile}
          currentPath={directory}
          existingFiles={filteredEntries.filter(e => e.isFile).map(e => e.name)}
        />
      )}

      {deleteCandidate && (onDeleteFile || onDeleteFolder) && (
        <ConfirmDeleteDialog
          isOpen={!!deleteCandidate}
          fileName={entries?.find(e => e.path === deleteCandidate.path)?.name || ''}
          onClose={() => setDeleteCandidate(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  )
}

// Memoize FileTree to prevent unnecessary re-renders
const FileTreeMemo = memo(FileTree, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these key props change
  return (
    prevProps.directory === nextProps.directory &&
    prevProps.activeFilePath === nextProps.activeFilePath
  )
})

export { FileTreeMemo as FileTree }

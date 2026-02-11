import { useState, useCallback, useEffect } from 'react'
import { DEFAULT_CONTENT, NEW_DOCUMENT_CONTENT } from '@/lib/constants'
import { logger } from '@/lib/logger'

export type ViewMode = 'edit' | 'preview' | 'split'

interface UseEditorStateOptions {
  autoRestore?: boolean
}

/**
 * Editor state management hook
 * Handles content, file tracking, and view mode
 */
export function useEditorState(
  sessionFile?: string,
  sessionContent?: string,
  options?: UseEditorStateOptions
) {
  const [currentFile, setCurrentFile] = useState<string>('')
  const [content, setContent] = useState<string>(DEFAULT_CONTENT)
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const autoRestore = options?.autoRestore ?? true

  // Restore file from session on mount
  useEffect(() => {
    if (autoRestore && sessionFile && !currentFile) {
      restoreFile(sessionFile, sessionContent)
    }
  }, [autoRestore])

  /**
   * Restores file and content from session
   * @param filePath - Path to restore from session
   * @param fileContent - Optional cached content from session
   */
  const restoreFile = useCallback(async (filePath: string, fileContent?: string) => {
    try {
      let restoredContent = fileContent

      // If no cached content, read from file
      if (!restoredContent) {
        const fs = await import('@tauri-apps/plugin-fs')
        restoredContent = await fs.readTextFile(filePath)
      }

      setCurrentFile(filePath)
      setContent(restoredContent)
      logger.info('File restored from session', { path: filePath, hasCachedContent: !!fileContent })
    } catch (error) {
      logger.warn('Session file no longer accessible, skipping restore', { path: filePath })
      // File no longer exists or is inaccessible, don't restore
    }
  }, [])

  const handleNew = useCallback(() => {
    setCurrentFile('')
    setContent(NEW_DOCUMENT_CONTENT)
    logger.info('Created new document')
  }, [])

  const handleSetContent = useCallback((newContent: string) => {
    setContent(newContent)
  }, [])

  const handleSetCurrentFile = useCallback((filePath: string) => {
    setCurrentFile(filePath)
  }, [])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    logger.info('View mode changed', { mode })
  }, [])

  const cycleViewMode = useCallback(() => {
    setViewMode(prev => {
      const next: ViewMode = prev === 'edit' ? 'preview' : prev === 'preview' ? 'split' : 'edit'
      logger.info('View mode cycled', { from: prev, to: next })
      return next
    })
  }, [])

  return {
    // State
    currentFile,
    content,
    viewMode,

    // Setters
    setContent: handleSetContent,
    setCurrentFile: handleSetCurrentFile,
    setViewMode,

    // Actions
    handleNew,
    handleViewModeChange,
    cycleViewMode,
    restoreFile,
  }
}

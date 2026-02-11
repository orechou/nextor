import { useState, useCallback, useEffect } from 'react'
import { logger } from '@/lib/logger'

export interface FolderInfo {
  path: string
  name: string
}

/**
 * Folder management hook
 * Handles multiple folder operations with active folder concept
 */
export function useFolderManager(sessionFolders?: string[], sessionActiveFolder?: string) {
  const [openedFolders, setOpenedFolders] = useState<FolderInfo[]>([])
  const [activeFolder, setActiveFolder] = useState<string>('')

  // Restore folders from session on mount
  useEffect(() => {
    if (sessionFolders && sessionFolders.length > 0 && openedFolders.length === 0) {
      restoreFolders(sessionFolders, sessionActiveFolder)
    }
  }, [])

  /**
   * Extract folder name from path
   */
  const getFolderName = useCallback((path: string): string => {
    const parts = path.split(/[/\\]/)
    return parts[parts.length - 1] || path
  }, [])

  /**
   * Restores folders from session with validation
   * @param folderPaths - Array of folder paths to restore
   * @param activeFolderPath - The active folder path
   */
  const restoreFolders = useCallback(async (folderPaths: string[], activeFolderPath?: string) => {
    const fs = await import('@tauri-apps/plugin-fs')
    const validFolders: FolderInfo[] = []

    for (const folderPath of folderPaths) {
      try {
        // Verify folder still exists before restoring
        await fs.readDir(folderPath)
        validFolders.push({
          path: folderPath,
          name: getFolderName(folderPath)
        })
        logger.info('Folder restored from session', { path: folderPath })
      } catch (error) {
        logger.warn('Session folder no longer accessible, skipping restore', { path: folderPath })
      }
    }

    setOpenedFolders(validFolders)

    // Set active folder - prefer the active folder from session, otherwise use first valid folder
    if (activeFolderPath && validFolders.some(f => f.path === activeFolderPath)) {
      setActiveFolder(activeFolderPath)
    } else if (validFolders.length > 0) {
      setActiveFolder(validFolders[0].path)
    }
  }, [getFolderName])

  /**
   * Opens a folder dialog and adds the selected folder to the list
   */
  const handleOpenFolder = useCallback(async () => {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog')

      const selected = await open({
        multiple: false,
        directory: true,
      })

      if (selected && !Array.isArray(selected)) {
        const folderPath = selected

        // Check if folder is already open
        if (openedFolders.some(f => f.path === folderPath)) {
          // Just switch to it if already open
          setActiveFolder(folderPath)
          logger.info('Switched to existing folder', { path: folderPath })
          return folderPath
        }

        // Add new folder
        const newFolder: FolderInfo = {
          path: folderPath,
          name: getFolderName(folderPath)
        }
        setOpenedFolders(prev => [...prev, newFolder])
        setActiveFolder(folderPath)
        logger.info('Folder opened', { path: folderPath })
        return folderPath
      }
    } catch (error) {
      logger.error('Failed to open folder', error)
      throw error
    }
  }, [openedFolders, getFolderName])

  /**
   * Adds a folder to the list (used when restoring from session or adding programmatically)
   */
  const addFolder = useCallback((folderPath: string) => {
    // Check if folder is already open
    if (openedFolders.some(f => f.path === folderPath)) {
      setActiveFolder(folderPath)
      return
    }

    const newFolder: FolderInfo = {
      path: folderPath,
      name: getFolderName(folderPath)
    }
    setOpenedFolders(prev => [...prev, newFolder])
    setActiveFolder(folderPath)
    logger.info('Folder added', { path: folderPath })
  }, [openedFolders, getFolderName])

  /**
   * Removes a folder from the list
   * @param folderPath - Path of folder to remove
   */
  const removeFolder = useCallback((folderPath: string) => {
    setOpenedFolders(prev => {
      const filtered = prev.filter(f => f.path !== folderPath)

      // If we removed the active folder, switch to another one if available
      if (activeFolder === folderPath) {
        if (filtered.length > 0) {
          setActiveFolder(filtered[0].path)
        } else {
          setActiveFolder('')
        }
      }

      logger.info('Folder removed', { path: folderPath })
      return filtered
    })
  }, [activeFolder])

  /**
   * Closes the active folder and clears state
   */
  const handleCloseFolder = useCallback(() => {
    removeFolder(activeFolder)
  }, [activeFolder, removeFolder])

  const handleFileSelect = useCallback(async (path: string) => {
    try {
      const { readTextFile } = await import('@tauri-apps/plugin-fs')
      const fileContent = await readTextFile(path)
      logger.info('File selected', { path })
      return fileContent
    } catch (error) {
      logger.error('Failed to open file', error, { path })
      throw error
    }
  }, [])

  return {
    openedFolders,
    activeFolder,
    setActiveFolder,
    handleOpenFolder,
    addFolder,
    removeFolder,
    handleCloseFolder,
    handleFileSelect,
    restoreFolders,
  }
}

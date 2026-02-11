import { useCallback } from 'react'
import { fileService } from '@/services'
import { DEFAULT_CONTENT } from '@/lib/constants'
import type { WeChatExportOptions } from '@/lib/export'

export interface UseEditorAppHandlersOptions {
  setCurrentFile: (path: string) => void
  setContent: (content: string) => void
  setSidebarOpen: (value: boolean | ((prev: boolean) => boolean)) => void
  handleOpenFile: () => Promise<{ path: string; content: string }>
  handleSaveFile: (path: string, content: string) => Promise<void>
  handleSaveAs: (content: string, defaultName?: string) => Promise<string | undefined>
  handleExport: (content: string, format?: 'html' | 'txt') => Promise<void>
  handleOpenFolder: () => Promise<string | null | undefined>
  handleCloseFolder: () => void
  handleWeChatExport: (
    method: 'file' | 'clipboard',
    options: WeChatExportOptions,
    content: string,
    currentFile: string
  ) => Promise<void>
  handleCreateFile?: (dirPath: string, fileName: string) => Promise<string>
  handleDeleteFile?: (filePath: string) => Promise<void>
  handleDeleteFolder?: (folderPath: string) => Promise<void>
  activeFolder: string
  content: string
  currentFile: string
  handleExportPDF?: (content: string, title: string) => Promise<void>
}

/**
 * Composes file/folder operations with editor state updates.
 * Returns handlers ready for use in App and useAppMenu.
 */
export function useEditorAppHandlers(options: UseEditorAppHandlersOptions) {
  const {
    setCurrentFile,
    setContent,
    setSidebarOpen,
    handleOpenFile,
    handleSaveFile,
    handleSaveAs,
    handleExport,
    handleOpenFolder,
    handleCloseFolder,
    handleWeChatExport,
    handleCreateFile,
    handleDeleteFile,
    handleDeleteFolder,
    activeFolder,
    content,
    currentFile,
    handleExportPDF,
  } = options

  const handleOpenFileWithState = useCallback(async () => {
    const result = await handleOpenFile()
    setCurrentFile(result.path)
    setContent(result.content)
  }, [handleOpenFile, setCurrentFile, setContent])

  const handleSaveFileWithState = useCallback(async () => {
    await handleSaveFile(currentFile, content)
  }, [handleSaveFile, currentFile, content])

  const handleSaveAsWithState = useCallback(async () => {
    const savedPath = await handleSaveAs(content)
    if (savedPath) {
      setCurrentFile(savedPath)
    }
  }, [handleSaveAs, content, setCurrentFile])

  const handleCloseFolderWithState = useCallback(() => {
    handleCloseFolder()
    setCurrentFile('')
    setContent(DEFAULT_CONTENT)
  }, [handleCloseFolder, setCurrentFile, setContent])

  const handleFileSelect = useCallback(
    async (path: string) => {
      const fileContent = await fileService.readFile(path)
      setCurrentFile(path)
      setContent(fileContent)
    },
    [setCurrentFile, setContent]
  )

  const handleOpenFolderWithState = useCallback(async () => {
    const path = await handleOpenFolder()
    if (path) {
      setSidebarOpen(true)
    }
  }, [handleOpenFolder, setSidebarOpen])

  const handleExportWithState = useCallback(async () => {
    await handleExport(content)
  }, [handleExport, content])

  const handleWeChatExportWithState = useCallback(
    async (method: 'file' | 'clipboard', options: WeChatExportOptions) => {
      await handleWeChatExport(method, options, content, currentFile)
    },
    [handleWeChatExport, content, currentFile]
  )

  const handleCreateFileWithState = useCallback(
    async (fileName: string) => {
      if (!handleCreateFile) return
      const newPath = await handleCreateFile(activeFolder, fileName)
      setCurrentFile(newPath)
      setContent(DEFAULT_CONTENT)
    },
    [handleCreateFile, activeFolder, setCurrentFile, setContent]
  )

  const handleDeleteFileWithState = useCallback(
    async (filePath: string) => {
      if (!handleDeleteFile) return
      await handleDeleteFile(filePath)
      // If the deleted file is the current file, clear the editor
      if (filePath === currentFile) {
        setCurrentFile('')
        setContent(DEFAULT_CONTENT)
      }
    },
    [handleDeleteFile, currentFile, setCurrentFile, setContent]
  )

  const handleDeleteFolderWithState = useCallback(
    async (folderPath: string) => {
      if (!handleDeleteFolder) return
      await handleDeleteFolder(folderPath)
      // If the deleted folder is the active folder, clear the current file
      if (currentFile && currentFile.startsWith(folderPath)) {
        setCurrentFile('')
        setContent(DEFAULT_CONTENT)
      }
    },
    [handleDeleteFolder, currentFile, setCurrentFile, setContent]
  )

  const handleExportPDFWithState = useCallback(
    async (exportContent: string, title: string) => {
      if (!handleExportPDF) return
      await handleExportPDF(exportContent, title)
    },
    [handleExportPDF]
  )

  return {
    handleOpenFile: handleOpenFileWithState,
    handleSaveFile: handleSaveFileWithState,
    handleSaveAs: handleSaveAsWithState,
    handleCloseFolder: handleCloseFolderWithState,
    handleFileSelect,
    handleOpenFolder: handleOpenFolderWithState,
    handleExport: handleExportWithState,
    handleWeChatExport: handleWeChatExportWithState,
    handleCreateFile: handleCreateFileWithState,
    handleDeleteFile: handleDeleteFileWithState,
    handleDeleteFolder: handleDeleteFolderWithState,
    handleExportPDF: handleExportPDFWithState,
  }
}

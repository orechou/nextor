import { useCallback, useRef } from 'react'
import { useOpenFile, useSaveFile, useCreateFile, useDeleteFile } from '@/lib/query'
import { fileService } from '@/services'
import { logger } from '@/lib/logger'
import { DEFAULT_CONTENT } from '@/lib/constants'
import { validatePath, validateFileName } from '@/lib/pathValidation'

/**
 * File operations hook
 * Handles file opening, saving, and exporting with concurrent operation tracking
 */
export function useFileOperations() {
  const openFile = useOpenFile()
  const saveFile = useSaveFile()
  const createFile = useCreateFile()
  const deleteFile = useDeleteFile()

  // Track pending operations to prevent race conditions
  const pendingOperationsRef = useRef<Set<string>>(new Set())

  // Update ref whenever state changes
  const updatePendingOperations = useCallback((updates: (current: Set<string>) => Set<string>) => {
    const next = updates(pendingOperationsRef.current)
    pendingOperationsRef.current = next
  }, [])

  // Check if an operation is pending for a given path
  const isOperationPending = useCallback((filePath: string): boolean => {
    return pendingOperationsRef.current.has(filePath)
  }, [])

  const handleOpenFile = useCallback(async () => {
    try {
      const result = await openFile.mutateAsync()
      logger.info('File opened', { path: result.path })
      return result
    } catch (error) {
      logger.error('Failed to open file', error, { operation: 'openFile' })
      throw error
    }
  }, [openFile])

  const handleSaveFile = useCallback(async (path: string, content: string) => {
    // Check for pending operations
    if (isOperationPending(path)) {
      logger.warn('Save operation already in progress', { path })
      throw new Error('A save operation is already in progress for this file')
    }

    // Validate path
    if (!validatePath(path)) {
      throw new Error('Invalid file path')
    }

    // Mark operation as pending
    updatePendingOperations(prev => new Set(prev).add(path))

    try {
      await saveFile.mutateAsync({ path, content })
      logger.info('File saved successfully', { path })
    } catch (error) {
      logger.error('Failed to save file', error, { path })
      throw error
    } finally {
      // Clear pending operation
      updatePendingOperations(prev => {
        const next = new Set(prev)
        next.delete(path)
        return next
      })
    }
  }, [saveFile, isOperationPending, updatePendingOperations])

  const handleSaveAs = useCallback(async (content: string, defaultName?: string) => {
    try {
      const savedPath = await fileService.saveAsFile(content, defaultName)
      logger.info('File saved as', { path: savedPath })
      return savedPath
    } catch (error) {
      logger.error('Failed to save file as', error)
      throw error
    }
  }, [])

  const handleExport = useCallback(async (content: string, format: 'html' | 'txt' = 'html') => {
    try {
      await fileService.exportFile(content, format)
      logger.info('File exported successfully', { format })
    } catch (error) {
      logger.error('Failed to export', error, { format })
      throw error
    }
  }, [])

  const handleCreateFile = useCallback(async (dirPath: string, fileName: string) => {
    // Validate file name
    const validation = validateFileName(fileName)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // Validate directory path
    if (!validatePath(dirPath)) {
      throw new Error('Invalid directory path')
    }

    // Check for pending operations on the target path
    const targetPath = `${dirPath}/${fileName}`
    if (isOperationPending(targetPath)) {
      logger.warn('Create operation already in progress', { path: targetPath })
      throw new Error('A create operation is already in progress for this file')
    }

    // Mark operation as pending
    updatePendingOperations(prev => new Set(prev).add(targetPath))

    try {
      const newPath = await createFile.mutateAsync({ dirPath, fileName, content: DEFAULT_CONTENT })
      logger.info('File created successfully', { path: newPath })
      return newPath
    } catch (error) {
      logger.error('Failed to create file', error, { dirPath, fileName })
      throw error
    } finally {
      // Clear pending operation
      updatePendingOperations(prev => {
        const next = new Set(prev)
        next.delete(targetPath)
        return next
      })
    }
  }, [createFile, isOperationPending, updatePendingOperations])

  const handleDeleteFile = useCallback(async (filePath: string) => {
    // Validate path
    if (!validatePath(filePath)) {
      throw new Error('Invalid file path')
    }

    // Check for pending operations
    if (isOperationPending(filePath)) {
      logger.warn('Delete operation already in progress', { path: filePath })
      throw new Error('A delete operation is already in progress for this file')
    }

    // Mark operation as pending
    updatePendingOperations(prev => new Set(prev).add(filePath))

    try {
      await deleteFile.mutateAsync({ filePath })
      logger.info('File deleted successfully', { path: filePath })
    } catch (error) {
      logger.error('Failed to delete file', error, { path: filePath })
      throw error
    } finally {
      // Clear pending operation
      updatePendingOperations(prev => {
        const next = new Set(prev)
        next.delete(filePath)
        return next
      })
    }
  }, [deleteFile, isOperationPending, updatePendingOperations])

  const handleDeleteFolder = useCallback(async (folderPath: string) => {
    // Validate path
    if (!validatePath(folderPath)) {
      throw new Error('Invalid folder path')
    }

    // Check for pending operations
    if (isOperationPending(folderPath)) {
      logger.warn('Delete operation already in progress', { path: folderPath })
      throw new Error('A delete operation is already in progress for this folder')
    }

    // Mark operation as pending
    updatePendingOperations(prev => new Set(prev).add(folderPath))

    try {
      // Use the same deleteFile mutation since fs.remove works for both files and directories
      await deleteFile.mutateAsync({ filePath: folderPath })
      logger.info('Folder deleted successfully', { path: folderPath })
    } catch (error) {
      logger.error('Failed to delete folder', error, { path: folderPath })
      throw error
    } finally {
      // Clear pending operation
      updatePendingOperations(prev => {
        const next = new Set(prev)
        next.delete(folderPath)
        return next
      })
    }
  }, [deleteFile, isOperationPending, updatePendingOperations])

  return {
    handleOpenFile,
    handleSaveFile,
    handleSaveAs,
    handleExport,
    handleCreateFile,
    handleDeleteFile,
    handleDeleteFolder,
    isOpening: openFile.isPending,
    isSaving: saveFile.isPending,
    isCreating: createFile.isPending,
    isDeleting: deleteFile.isPending,
  }
}

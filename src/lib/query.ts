import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fileService } from '../services'

// Types
export interface FileContent {
  path: string
  content: string
}

export interface DirEntry {
  name: string
  path: string
  isDirectory: boolean
  isFile: boolean
}

// File operations using the centralized file service
export function useOpenFile() {
  return useMutation({
    mutationFn: () => fileService.openFile(),
  })
}

export function useSaveFile() {
  return useMutation({
    mutationFn: ({ path, content }: { path: string; content: string }) =>
      fileService.saveFile(path, content),
  })
}

export function useExportFile() {
  return useMutation({
    mutationFn: ({ content, format }: { content: string; format: string }) =>
      fileService.exportFile(content, format as 'html' | 'txt'),
  })
}

export function useOpenDirectory() {
  return useMutation({
    mutationFn: () => fileService.openDirectory(),
  })
}

export function useReadDirectory(path: string) {
  return useQuery({
    queryKey: ['directory', path],
    queryFn: () => fileService.readDirectory(path),
    enabled: !!path,
  })
}

export function useCreateFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ dirPath, fileName, content }: { dirPath: string; fileName: string; content?: string }) =>
      fileService.createFile(dirPath, fileName, content),
    onSuccess: (_, variables) => {
      // Invalidate the directory query to refresh the file list
      queryClient.invalidateQueries({ queryKey: ['directory', variables.dirPath] })
    },
  })
}

export function useDeleteFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ filePath }: { filePath: string }) =>
      fileService.deleteFile(filePath),
    onSuccess: (_, variables) => {
      // Extract the directory path from the file path
      const pathModule = variables.filePath.split('/')
      const dirPath = pathModule.slice(0, -1).join('/')
      // Invalidate the directory query to refresh the file list
      queryClient.invalidateQueries({ queryKey: ['directory', dirPath] })
    },
  })
}

import type { FileContent, DirEntry } from '../lib/query'

/**
 * File open options
 */
export interface FileOpenOptions {
  multiple?: boolean
  filters?: Array<{
    name: string
    extensions: string[]
  }>
}

/**
 * File service interface
 * Abstracts Tauri file operations for better testability and consistency
 */
export interface FileService {
  openFile(options?: FileOpenOptions): Promise<FileContent>
  saveFile(path: string, content: string): Promise<void>
  saveAsFile(content: string, defaultName?: string): Promise<string>
  readFile(path: string): Promise<string>
  readDirectory(path: string): Promise<DirEntry[]>
  openDirectory(): Promise<string>
  exportFile(content: string, format: 'html' | 'txt'): Promise<string>
  createFile(dirPath: string, fileName: string, content?: string): Promise<string>
  deleteFile(filePath: string): Promise<void>
}

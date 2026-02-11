import type { FileService, FileOpenOptions } from './types'
import type { FileContent, DirEntry } from '../lib/query'
import { FILE } from '../lib/constants'
import { logger } from '../lib/logger'

/**
 * Tauri-based file service implementation
 * Wraps Tauri file APIs with error handling and logging
 */
class TauriFileService implements FileService {
  async openFile(options?: FileOpenOptions): Promise<FileContent> {
    const dialog = await import('@tauri-apps/plugin-dialog')
    const fs = await import('@tauri-apps/plugin-fs')

    const dialogOptions = {
      multiple: false,
      filters: [{
        name: 'Markdown',
        extensions: [...FILE.MARKDOWN_EXTENSIONS]
      }],
      ...options
    }

    const selected = await dialog.open(dialogOptions)

    if (selected === null || Array.isArray(selected)) {
      throw new Error('No file selected')
    }

    try {
      // Check file size before reading
      const metadata = await fs.stat(selected)
      if (metadata.size > FILE.MAX_FILE_SIZE) {
        const maxSizeMB = (FILE.MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)
        const actualSizeMB = (metadata.size / (1024 * 1024)).toFixed(2)
        throw new Error(
          `File too large: ${actualSizeMB} MB (max: ${maxSizeMB} MB)`
        )
      }

      const content = await fs.readTextFile(selected)
      logger.info('File opened successfully', { path: selected, size: metadata.size })
      return { path: selected, content }
    } catch (error) {
      logger.error('Failed to read file', error, { path: selected })
      throw error
    }
  }

  async saveFile(path: string, content: string): Promise<void> {
    const fs = await import('@tauri-apps/plugin-fs')

    try {
      await fs.writeTextFile(path, content)
      logger.info('File saved successfully', { path })
    } catch (error) {
      logger.error('Failed to save file', error, { path })
      throw error
    }
  }

  async saveAsFile(content: string, defaultName = 'untitled.md'): Promise<string> {
    const dialog = await import('@tauri-apps/plugin-dialog')
    const fs = await import('@tauri-apps/plugin-fs')

    const selected = await dialog.save({
      filters: [{
        name: 'Markdown',
        extensions: [...FILE.MARKDOWN_EXTENSIONS]
      }],
      defaultPath: defaultName
    })

    if (selected === null) {
      throw new Error('No save location selected')
    }

    await fs.writeTextFile(selected, content)
    logger.info('File saved as', { path: selected })
    return selected
  }

  async readFile(path: string): Promise<string> {
    const fs = await import('@tauri-apps/plugin-fs')

    try {
      const content = await fs.readTextFile(path)
      logger.debug('File read successfully', { path })
      return content
    } catch (error) {
      logger.error('Failed to read file', error, { path })
      throw error
    }
  }

  async readDirectory(path: string): Promise<DirEntry[]> {
    const fs = await import('@tauri-apps/plugin-fs')
    const pathModule = await import('@tauri-apps/api/path')

    try {
      const entries = await fs.readDir(path)
      const results = await Promise.all(entries.map(async (e) => {
        const entryPath = await pathModule.join(path, e.name)
        return {
          name: e.name,
          path: entryPath,
          isDirectory: 'children' in e,
          isFile: !('children' in e),
        }
      }))
      logger.debug('Directory read successfully', { path, count: results.length })
      return results
    } catch (error) {
      logger.error('Failed to read directory', error, { path })
      throw error
    }
  }

  async openDirectory(): Promise<string> {
    const dialog = await import('@tauri-apps/plugin-dialog')

    const selected = await dialog.open({
      multiple: false,
      directory: true,
    })

    if (selected === null || Array.isArray(selected)) {
      throw new Error('No directory selected')
    }

    logger.info('Directory opened', { path: selected })
    return selected
  }

  async exportFile(content: string, format: 'html' | 'txt'): Promise<string> {
    const dialog = await import('@tauri-apps/plugin-dialog')
    const fs = await import('@tauri-apps/plugin-fs')

    const selected = await dialog.save({
      filters: [{
        name: format.toUpperCase(),
        extensions: [format]
      }]
    })

    if (selected === null) {
      throw new Error('No save location selected')
    }

    await fs.writeTextFile(selected, content)
    logger.info('File exported successfully', { path: selected, format })
    return selected
  }

  async createFile(dirPath: string, fileName: string, content = ''): Promise<string> {
    const fs = await import('@tauri-apps/plugin-fs')
    const pathModule = await import('@tauri-apps/api/path')

    try {
      const fullPath = await pathModule.join(dirPath, fileName)
      await fs.writeTextFile(fullPath, content)
      logger.info('File created successfully', { path: fullPath })
      return fullPath
    } catch (error) {
      logger.error('Failed to create file', error, { dirPath, fileName })
      throw error
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const fs = await import('@tauri-apps/plugin-fs')

    try {
      await fs.remove(filePath)
      logger.info('File deleted successfully', { path: filePath })
    } catch (error) {
      logger.error('Failed to delete file', error, { path: filePath })
      throw error
    }
  }
}

/**
 * Singleton file service instance
 */
export const fileService = new TauriFileService()

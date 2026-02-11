/**
 * Tauri API Type Definitions
 * Provides type safety for Tauri plugin imports and APIs
 */

/**
 * Tauri Dialog Plugin Types
 */
export namespace TauriDialog {
  export interface DialogFilter {
    name: string
    extensions: string[]
  }

  export interface OpenOptions {
    multiple?: boolean
    directory?: boolean
    filters?: DialogFilter[]
    defaultPath?: string
  }

  export interface SaveOptions {
    filters?: DialogFilter[]
    defaultPath?: string
  }

  export type FileResult = string | string[] | null
}

/**
 * Tauri File System Plugin Types
 */
export namespace TauriFs {
  export interface DirEntry {
    name: string
    children?: DirEntry[]
  }

  export interface ReadFileOptions {
    /** Base directory to resolve the input path from */
    baseDir?: BaseDirectory
  }

  export type BaseDirectory =
    | 'Audio'
    | 'Cache'
    | 'Config'
    | 'Data'
    | 'LocalData'
    | 'Desktop'
    | 'Document'
    | 'Download'
    | 'Executable'
    | 'Font'
    | 'Home'
    | 'Picture'
    | 'Public'
    | 'Runtime'
    | 'Temp'
    | 'Template'
    | 'Video'
    | 'Resource'
    | 'App'
    | 'Log'
    | 'AppState'
}

/**
 * Tauri Window Plugin Types
 */
export namespace TauriWindow {
  export interface WindowOptions {
    label?: string
    title?: string
    width?: number
    height?: number
    x?: number
    y?: number
    centerX?: boolean
    centerY?: boolean
    resizable?: boolean
    decorations?: boolean
    transparent?: boolean
    alwaysOnTop?: boolean
    skipTaskbar?: boolean
  }

  export type Theme = 'light' | 'dark'
}

/**
 * Dynamic import types for Tauri plugins
 */
export interface TauriDialogModule {
  open: (options?: TauriDialog.OpenOptions) => Promise<TauriDialog.FileResult>
  save: (options?: TauriDialog.SaveOptions) => Promise<string | null>
}

export interface TauriFsModule {
  readTextFile: (path: string | URL, options?: TauriFs.ReadFileOptions) => Promise<string>
  writeTextFile: (path: string | URL, data: string, options?: TauriFs.ReadFileOptions) => Promise<void>
  readDir: (path: string, options?: TauriFs.ReadFileOptions) => Promise<TauriFs.DirEntry[]>
  exists: (path: string, options?: TauriFs.ReadFileOptions) => Promise<boolean>
}

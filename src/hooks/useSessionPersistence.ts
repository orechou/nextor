import { useState, useEffect, useCallback, useMemo } from 'react'
import { SESSION } from '@/lib/constants'
import { logger } from '@/lib/logger'
import { debounceWithCancel } from '@/lib/debounce'

/**
 * Session state structure for persistence
 */
export interface SessionState {
  /** All opened folder paths */
  openedFolders?: string[]
  /** Current active folder path */
  activeFolder?: string
  /** @deprecated Use openedFolders and activeFolder instead. Last opened folder path */
  lastOpenedFolder?: string
  /** Last opened file path */
  lastOpenedFile?: string
  /** Timestamp when session was saved */
  timestamp: number
}

/**
 * Session change event detail
 */
interface SessionChangeEventDetail {
  session: SessionState | null
}

/**
 * Retrieves stored session from localStorage
 */
function getStoredSession(): SessionState | null {
  try {
    const stored = localStorage.getItem(SESSION.STORAGE_KEY)
    if (stored) {
      const session = JSON.parse(stored) as SessionState
      // Validate session has required timestamp field
      if (typeof session.timestamp === 'number') {
        logger.info('Session loaded from storage', { session } as Record<string, unknown>)
        return session
      }
    }
  } catch (error) {
    logger.warn('Failed to load session from storage', { error } as Record<string, unknown>)
  }
  return null
}

/**
 * Stores session to localStorage and dispatches change event
 */
function storeSession(session: SessionState): void {
  try {
    localStorage.setItem(SESSION.STORAGE_KEY, JSON.stringify(session))
    // Dispatch custom event to notify other components
    const detail: SessionChangeEventDetail = { session }
    window.dispatchEvent(new CustomEvent(SESSION.STORAGE_EVENT, { detail }))
    logger.debug('Session saved to storage', { session } as Record<string, unknown>)
  } catch (error) {
    logger.warn('Failed to save session to storage', { error } as Record<string, unknown>)
  }
}

/**
 * Clears stored session from localStorage
 */
function clearStoredSession(): void {
  try {
    localStorage.removeItem(SESSION.STORAGE_KEY)
    const detail: SessionChangeEventDetail = { session: null }
    window.dispatchEvent(new CustomEvent(SESSION.STORAGE_EVENT, { detail }))
    logger.info('Session cleared from storage', undefined)
  } catch (error) {
    logger.warn('Failed to clear session from storage', { error } as Record<string, unknown>)
  }
}

/**
 * Session persistence hook
 * Manages saving and restoring application state across restarts
 *
 * @example
 * ```tsx
 * const { openedFolders, activeFolder, lastOpenedFile, saveSession, clearSession } = useSessionPersistence()
 *
 * // Save current session with multiple folders
 * saveSession(['folder1', 'folder2'], 'folder1', filePath)
 *
 * // Clear session (e.g., when user closes all folders)
 * clearSession()
 * ```
 */
export function useSessionPersistence() {
  const [session, setSession] = useState<SessionState | null>(() => getStoredSession())

  // Create debounced version of storeSession to reduce localStorage writes
  const debouncedStoreSession = useMemo(
    () => debounceWithCancel((newSession: SessionState) => {
      storeSession(newSession)
    }, 500), // 500ms debounce
    []
  )

  // Listen for session changes from other components
  useEffect(() => {
    const handleSessionChange = (event: Event) => {
      const customEvent = event as CustomEvent<SessionChangeEventDetail>
      const newSession = customEvent.detail.session
      setSession(newSession)
    }

    window.addEventListener(SESSION.STORAGE_EVENT, handleSessionChange as EventListener)
    return () => {
      window.removeEventListener(SESSION.STORAGE_EVENT, handleSessionChange as EventListener)
    }
  }, [])

  /**
   * Saves current session state (debounced)
   * @param folders - Array of folder paths to save
   * @param activeFolder - Current active folder path
   * @param file - Optional file path to save
   */
  const saveSession = useCallback((folders?: string[], activeFolder?: string, file?: string) => {
    const newSession: SessionState = {
      openedFolders: folders,
      activeFolder: activeFolder,
      // Keep lastOpenedFolder for backward compatibility
      lastOpenedFolder: activeFolder,
      lastOpenedFile: file,
      timestamp: Date.now(),
    }
    setSession(newSession)
    // Use debounced version to reduce localStorage writes
    debouncedStoreSession(newSession)
  }, [debouncedStoreSession])

  /**
   * Clears the stored session
   */
  const clearSession = useCallback(() => {
    // Cancel any pending debounced saves
    debouncedStoreSession.cancel()
    setSession(null)
    clearStoredSession()
  }, [debouncedStoreSession])

  return {
    openedFolders: session?.openedFolders,
    activeFolder: session?.activeFolder,
    lastOpenedFolder: session?.lastOpenedFolder,
    lastOpenedFile: session?.lastOpenedFile,
    timestamp: session?.timestamp,
    session,
    saveSession,
    clearSession,
  }
}

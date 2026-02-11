/**
 * Session persistence constants
 * Used for storing and restoring application state across restarts
 */

export const SESSION = {
  /** localStorage key for session data */
  STORAGE_KEY: 'nextor-session',

  /** Custom event name for session changes across components */
  STORAGE_EVENT: 'nextor-session-change',
} as const

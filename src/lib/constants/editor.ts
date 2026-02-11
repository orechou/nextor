/**
 * Editor-related constants
 */

export const EDITOR = {
  /** Scroll throttle in milliseconds (~60fps for smooth scrolling) */
  SCROLL_THROTTLE_MS: 16,

  /** Fallback timeout in milliseconds to wait for DOM mutations */
  FALLBACK_TIMEOUT_MS: 500,

  /** Maximum lines for preview performance */
  MAX_PREVIEW_LINES: 10000,
} as const

/**
 * Keyboard shortcut constants
 */
export const SHORTCUTS = {
  /** Save file shortcut */
  SAVE: 'CmdOrCtrl+S',
  /** Save as shortcut */
  SAVE_AS: 'CmdOrCtrl+Shift+S',
} as const

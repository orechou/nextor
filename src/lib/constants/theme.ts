/**
 * Theme-related constants
 */

export const THEME = {
  /** localStorage key for theme persistence */
  STORAGE_KEY: 'nextor-theme',

  /** Custom event name for theme change notifications */
  STORAGE_EVENT: 'nextor-theme-change',

  /** Available theme options */
  THEMES: ['light', 'dark', 'system'] as const,
} as const

/** Theme type derived from available themes */
export type Theme = typeof THEME.THEMES[number]

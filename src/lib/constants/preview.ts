/**
 * Preview mode constants
 */

export const PREVIEW = {
  /** localStorage key for preview mode preferences */
  STORAGE_KEY: 'nextor-preview-mode',

  /** Default WeChat theme */
  DEFAULT_WECHAT_THEME: 'minimal',

  /** Default include title setting */
  DEFAULT_INCLUDE_TITLE: true,
} as const

export interface PreviewModePreferences {
  wechatMode: boolean
  wechatTheme: string
  includeTitle: boolean
}

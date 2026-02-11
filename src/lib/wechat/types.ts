/**
 * WeChat export types
 */

export type WeChatTheme = 'minimal' | 'colorful' | 'dark' | 'elegant' | 'modern' | 'business' | 'tech'

export interface WeChatExportOptions {
  theme?: WeChatTheme
  includeTitle?: boolean
  width?: number
}

export interface WeChatTemplate {
  getCSS: (options: WeChatExportOptions) => string
  getWrapper: (content: string, title: string, options: WeChatExportOptions) => string
}

export interface WeChatThemeMetadata {
  id: WeChatTheme
  name: string // i18n key
  description: string // i18n key
  previewCSS: string // 用于对话框预览卡片的简化 CSS
  order: number // 显示顺序
}

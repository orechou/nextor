import type { WeChatTemplate, WeChatTheme } from './types'
import { minimalTheme } from './themes/minimal'
import { colorfulTheme } from './themes/colorful'
import { darkTheme } from './themes/dark'
import { elegantTheme } from './themes/elegant'
import { modernTheme } from './themes/modern'
import { businessTheme } from './themes/business'
import { techTheme } from './themes/tech'

/**
 * Theme registry - maps theme names to their implementations
 */
const themeRegistry: Record<WeChatTheme, WeChatTemplate> = {
  minimal: minimalTheme,
  colorful: colorfulTheme,
  dark: darkTheme,
  elegant: elegantTheme,
  modern: modernTheme,
  business: businessTheme,
  tech: techTheme
}

/**
 * Get a theme template by name
 * @param theme - The theme name
 * @returns The theme template, defaults to minimal if not found
 */
export function getWeChatTemplate(theme: WeChatTheme): WeChatTemplate {
  return themeRegistry[theme] || minimalTheme
}

/**
 * Get all available theme names
 */
export function getAvailableThemes(): WeChatTheme[] {
  return Object.keys(themeRegistry) as WeChatTheme[]
}

import type { WeChatThemeMetadata, WeChatTheme } from './types'

export const themeMetadata: Record<WeChatTheme, WeChatThemeMetadata> = {
  minimal: {
    id: 'minimal',
    name: 'export.themes.minimal',
    description: 'export.themes.minimal_desc',
    previewCSS: `
      body { font-family: -apple-system, sans-serif; color: #333; }
      h3 { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 4px; }
      p { font-size: 10px; color: #666; line-height: 1.5; }
    `,
    order: 1
  },
  colorful: {
    id: 'colorful',
    name: 'export.themes.colorful',
    description: 'export.themes.colorful_desc',
    previewCSS: `
      body { font-family: -apple-system, sans-serif; color: #333; }
      h3 { font-size: 14px; font-weight: bold; color: #e74c3c; margin-bottom: 4px; }
      p { font-size: 10px; color: #555; line-height: 1.5; }
    `,
    order: 2
  },
  dark: {
    id: 'dark',
    name: 'export.themes.dark',
    description: 'export.themes.dark_desc',
    previewCSS: `
      body { font-family: -apple-system, sans-serif; background: #1e1e1e; color: #d4d4d4; }
      h3 { font-size: 14px; font-weight: bold; color: #d4d4d4; margin-bottom: 4px; }
      p { font-size: 10px; color: #9cdcfe; line-height: 1.5; }
    `,
    order: 3
  },
  elegant: {
    id: 'elegant',
    name: 'export.themes.elegant',
    description: 'export.themes.elegant_desc',
    previewCSS: `
      body { font-family: Georgia, serif; color: #333; }
      h3 { font-size: 14px; font-weight: bold; color: #8b4513; margin-bottom: 4px; font-style: italic; }
      p { font-size: 10px; color: #555; line-height: 1.6; }
    `,
    order: 4
  },
  modern: {
    id: 'modern',
    name: 'export.themes.modern',
    description: 'export.themes.modern_desc',
    previewCSS: `
      body { font-family: -apple-system, sans-serif; color: #2c3e50; }
      h3 { font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; border-bottom: 2px solid #3498db; padding-bottom: 2px; }
      p { font-size: 10px; color: #5a6c7d; line-height: 1.5; }
    `,
    order: 5
  },
  business: {
    id: 'business',
    name: 'export.themes.business',
    description: 'export.themes.business_desc',
    previewCSS: `
      body { font-family: -apple-system, sans-serif; color: #2c3e50; }
      h3 { font-size: 14px; font-weight: 700; color: #1e3a8a; margin-bottom: 4px; }
      p { font-size: 10px; color: #475569; line-height: 1.5; }
    `,
    order: 6
  },
  tech: {
    id: 'tech',
    name: 'export.themes.tech',
    description: 'export.themes.tech_desc',
    previewCSS: `
      body { font-family: 'SF Mono', 'Consolas', monospace; color: #24292f; }
      h3 { font-size: 13px; font-weight: 600; color: #24292f; margin-bottom: 4px; border-bottom: 1px solid #d0d7de; padding-bottom: 2px; }
      p { font-size: 9px; color: #57606a; line-height: 1.5; }
    `,
    order: 7
  }
}

export function getSortedThemeMetadata(): WeChatThemeMetadata[] {
  return Object.values(themeMetadata).sort((a, b) => a.order - b.order)
}

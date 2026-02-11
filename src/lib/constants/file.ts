/**
 * File-related constants
 */

export const FILE = {
  /** Supported markdown file extensions */
  MARKDOWN_EXTENSIONS: ['md', 'markdown', 'mdown', 'mkd', 'mkdn'] as const,

  /** Supported image extensions for preview */
  SUPPORTED_IMAGE_EXTENSIONS: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'] as const,

  /** Maximum file size in bytes (10MB) */
  MAX_FILE_SIZE: 10 * 1024 * 1024,
} as const

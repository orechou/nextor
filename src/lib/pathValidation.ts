/**
 * Path validation utilities
 * Provides security functions to prevent directory traversal attacks
 * and validate file names
 */

/**
 * Validates if a file path is safe to use (prevents directory traversal attacks)
 * @param path - The file path to validate
 * @returns true if the path is safe, false otherwise
 */
export function validatePath(path: string): boolean {
  if (!path || typeof path !== 'string') {
    return false
  }

  // Check for directory traversal patterns
  if (path.includes('..') || path.includes('~')) {
    return false
  }

  return true
}

/**
 * Validates if a file name is valid and safe
 * @param fileName - The file name to validate (without path)
 * @returns Object with valid flag and optional error message
 */
export function validateFileName(fileName: string): { valid: boolean; error?: string } {
  if (!fileName || typeof fileName !== 'string') {
    return { valid: false, error: 'File name is required' }
  }

  const trimmedName = fileName.trim()

  if (trimmedName.length === 0) {
    return { valid: false, error: 'File name cannot be empty' }
  }

  // Check for reserved file names (Windows)
  const reservedNames = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
  ]

  const nameWithoutExt = trimmedName.split('.')[0].toUpperCase()
  if (reservedNames.includes(nameWithoutExt)) {
    return { valid: false, error: 'Reserved file name' }
  }

  // Check for illegal characters
  const illegalChars = /[<>:"|?*]/
  if (illegalChars.test(trimmedName)) {
    return { valid: false, error: 'Illegal characters in file name' }
  }

  // Check for path separators (should only be file name, not path)
  if (/[\/\\]/.test(trimmedName)) {
    return { valid: false, error: 'File name cannot contain path separators' }
  }

  // Check file name length (Windows 255 character limit)
  if (trimmedName.length > 255) {
    return { valid: false, error: 'File name too long (max 255 characters)' }
  }

  return { valid: true }
}

/**
 * Sanitizes a file name by removing/replacing problematic characters
 * @param fileName - The file name to sanitize
 * @returns A sanitized version of the file name
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/[<>:"|?*\/\\]/g, '_') // Replace illegal chars with underscore
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .slice(0, 255) // Truncate to max length
}

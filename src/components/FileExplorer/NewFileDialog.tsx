import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FILE } from '@/lib/constants'
import { logger } from '@/lib/logger'

interface NewFileDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (fileName: string) => void
  currentPath: string
  existingFiles?: string[]
}

export function NewFileDialog({ isOpen, onClose, onCreate, currentPath, existingFiles = [] }: NewFileDialogProps) {
  const { t } = useTranslation()
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFileName('')
      setError('')
      // Focus input after animation
      const timeout = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  const validateFileName = (name: string): string | null => {
    if (!name.trim()) {
      return t('fileExplorer.error_empty_filename')
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/
    if (invalidChars.test(name)) {
      return t('fileExplorer.error_invalid_chars')
    }

    // Check if already has extension
    const hasExtension = FILE.MARKDOWN_EXTENSIONS.some(ext => name.endsWith(`.${ext}`))
    const finalName = hasExtension ? name : `${name}.md`

    // Check if file already exists
    if (existingFiles.includes(finalName)) {
      return t('fileExplorer.error_file_exists')
    }

    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateFileName(fileName)
    if (validationError) {
      setError(validationError)
      return
    }

    // Add .md extension if not present
    const hasExtension = FILE.MARKDOWN_EXTENSIONS.some(ext => fileName.endsWith(`.${ext}`))
    const finalFileName = hasExtension ? fileName : `${fileName}.md`

    logger.info('Creating new file', { path: currentPath, fileName: finalFileName })
    onCreate(finalFileName)
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('fileExplorer.new_file_title')}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('fileExplorer.file_name')}
              </label>
              <input
                ref={inputRef}
                type="text"
                value={fileName}
                onChange={(e) => {
                  setFileName(e.target.value)
                  setError('')
                }}
                placeholder={t('fileExplorer.filename_placeholder')}
                className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {t('fileExplorer.extension_hint')}
              </p>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {t('fileExplorer.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { logger } from '@/lib/logger'

interface ConfirmDeleteDialogProps {
  isOpen: boolean
  fileName: string
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDeleteDialog({ isOpen, fileName, onClose, onConfirm }: ConfirmDeleteDialogProps) {
  const { t } = useTranslation()

  const handleConfirm = () => {
    logger.info('Confirming file deletion', { fileName })
    onConfirm()
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
            {t('fileExplorer.delete_file_title')}
          </h2>
        </div>

        <div className="px-6 py-4">
          <p className="text-gray-700 dark:text-gray-300">
            {t('fileExplorer.delete_file_confirmation')}
          </p>
          <p className="mt-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-900 dark:text-white break-all">
            {fileName}
          </p>
          <p className="mt-3 text-sm text-orange-600 dark:text-orange-400">
            {t('fileExplorer.delete_file_warning')}
          </p>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            {t('fileExplorer.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}

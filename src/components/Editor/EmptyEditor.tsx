import { useTranslation } from 'react-i18next'
import { FileText, FolderOpen } from 'lucide-react'

interface EmptyEditorProps {
  onOpenFile: () => void
  onOpenFolder: () => void
}

export function EmptyEditor({ onOpenFile, onOpenFolder }: EmptyEditorProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      {/* Main icon */}
      <div className="relative mb-8">
        <FileText className="w-20 h-20 text-gray-300 dark:text-gray-600" strokeWidth={1} />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {t('emptyEditor.title')}
      </h2>

      {/* Description */}
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-md">
        {t('emptyEditor.description')}
      </p>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={onOpenFile}
          className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-full hover:scale-105 transition-all duration-200 text-sm font-medium"
        >
          <FileText className="w-4 h-4" />
          {t('menu.open')}
        </button>
        <button
          onClick={onOpenFolder}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:scale-105 transition-all duration-200 text-sm font-medium"
        >
          <FolderOpen className="w-4 h-4" />
          {t('menu.openFolder')}
        </button>
      </div>
    </div>
  )
}

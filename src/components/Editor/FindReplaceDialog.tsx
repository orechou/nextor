import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchQuery, openSearchPanel, setSearchQuery } from '@codemirror/search'

interface FindReplaceDialogProps {
  isOpen: boolean
  onClose: () => void
  editorView?: any
  showReplace: boolean
}

export function FindReplaceDialog({ isOpen, onClose, editorView }: FindReplaceDialogProps) {
  const { t } = useTranslation()
  const [findQuery, setFindQuery] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const findInputRef = useRef<HTMLInputElement>(null)

  // Focus find input when opened
  useEffect(() => {
    if (isOpen) {
      findInputRef.current?.focus()
    }
  }, [isOpen])

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleFind = () => {
    if (!editorView || !findQuery) return

    // Open CodeMirror's search panel
    openSearchPanel(editorView)

    // Set the search query
    const searchQuery = new SearchQuery({
      search: findQuery,
      caseSensitive: caseSensitive,
      regexp: false,
      wholeWord: false
    })

    // Update the search state - use the of() method
    setTimeout(() => {
      if (editorView) {
        const transaction = editorView.state.update({
          effects: setSearchQuery.of(searchQuery)
        })
        editorView.dispatch(transaction)
      }
    }, 0)
  }

  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 border-b z-10 shrink-0",
      "bg-white dark:bg-[#1e1e1e]",
      "border-gray-200 dark:border-[#2d2d2d]"
    )}>
      {/* Find input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          ref={findInputRef}
          type="text"
          value={findQuery}
          onChange={(e) => setFindQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleFind()
            }
          }}
          placeholder={t('findReplace.find')}
          className={cn(
            "w-full pl-8 pr-3 py-1.5 text-sm rounded-md",
            "bg-gray-100 dark:bg-gray-800",
            "border border-gray-300 dark:border-gray-700",
            "text-gray-900 dark:text-gray-100",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "placeholder:text-gray-500 dark:placeholder:text-gray-500"
          )}
        />
      </div>

      {/* Options */}
      <div className="flex gap-1">
        <button
          onClick={() => setCaseSensitive(!caseSensitive)}
          className={cn(
            "px-2 py-1.5 text-xs rounded font-medium transition-colors",
            caseSensitive
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          )}
          title={t('findReplace.caseSensitive')}
        >
          Aa
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  )
}

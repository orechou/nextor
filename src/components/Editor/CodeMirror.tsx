import { useCallback, useMemo, useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { search, highlightSelectionMatches } from '@codemirror/search'
import { EditorView, ViewPlugin, type ViewUpdate, type PluginValue } from '@codemirror/view'

interface CodeMirrorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  theme?: 'light' | 'dark'
  onFirstLineChange?: (lineNumber: number) => void
  onScrollPercentageChange?: (percentage: number) => void
  showLineNumbers?: boolean
}

export interface CodeMirrorRef {
  scrollToTop?: () => void
  editorView?: any
}

// Global registry to store plugin instances by view
// Note: We no longer store instances since CodeMirror recreates the view on content changes
// const pluginInstanceRegistry = new WeakMap<EditorView, PluginValue & { reset: () => void }>()

// Unique symbol to identify our scroll sync plugin
// Note: No longer needed since we don't attach to view
// const SCROLL_SYNC_PLUGIN_ID = Symbol('scrollSyncPlugin')

export const CodeMirrorEditor = forwardRef<CodeMirrorRef, CodeMirrorProps>(function CodeMirrorEditor({
  value,
  onChange,
  className,
  theme = 'light',
  onFirstLineChange,
  onScrollPercentageChange,
  showLineNumbers = false
}, ref) {
  const editorViewRef = useRef<EditorView | null>(null)
  const handleChange = useCallback(
    (value: string) => {
      onChange(value)
    },
    [onChange]
  )

  // Create a ref to store stable callback references
  const callbacksRef = useRef({ onFirstLineChange, onScrollPercentageChange })

  // Update callbacks ref when callbacks change
  useEffect(() => {
    callbacksRef.current = { onFirstLineChange, onScrollPercentageChange }
  }, [onFirstLineChange, onScrollPercentageChange])

  // Create a plugin to track the first visible line
  // Memoized with empty deps to prevent recreation on every render
  const scrollSyncPlugin = useMemo(
    () => {
      // Create a class with a reset method
      class ScrollSyncPluginClass implements PluginValue {
        private rafId: number | null = null
        private quietTimeoutId: number | null = null
        public lastReportedLine = -1
        private lastScrollPercentage = -1
        private view: EditorView | null = null
        private ignoreUpdates = false  // 静默标志，用于文档变化时忽略更新

        constructor(view: EditorView) {
          // Store view reference for later use
          this.view = view
          // Note: We don't register in global registry anymore since view gets recreated
        }

        reportCurrentState() {
          if (!this.view) return

          const viewport = this.view.viewport
          const line = this.view.state.doc.lineAt(viewport.from)
          const lineNumber = line.number

          const scrollDOM = this.view.scrollDOM
          const scrollTop = scrollDOM.scrollTop
          const scrollHeight = scrollDOM.scrollHeight
          const clientHeight = scrollDOM.clientHeight
          const maxScroll = scrollHeight - clientHeight
          const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0

          const { onFirstLineChange, onScrollPercentageChange } = callbacksRef.current
          onFirstLineChange?.(lineNumber)
          onScrollPercentageChange?.(scrollPercentage)
        }

        update(update: ViewUpdate) {
          // Check if this is a viewport change (scroll) or document change
          const isViewportChange = update.viewportChanged || update.geometryChanged
          const isDocChange = update.docChanged

          // If document changed, reset our tracking state and ignore updates briefly
          if (isDocChange) {
            this.lastReportedLine = -1
            this.lastScrollPercentage = -1
            this.ignoreUpdates = true

            // 清除之前的静默期定时器
            if (this.quietTimeoutId !== null) {
              clearTimeout(this.quietTimeoutId)
            }

            // 150ms 后恢复正常更新，确保 DOM 已经稳定
            this.quietTimeoutId = window.setTimeout(() => {
              this.ignoreUpdates = false
              this.quietTimeoutId = null
            }, 150)
            return  // 立即返回，不处理此次更新
          }

          // 如果处于静默期，忽略所有更新
          if (this.ignoreUpdates) {
            return
          }

          // Cancel any pending RAF
          if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId)
          }

          // Schedule update on next animation frame
          this.rafId = requestAnimationFrame(() => {
            const view = update.view
            const viewport = view.viewport
            const line = view.state.doc.lineAt(viewport.from)
            const lineNumber = line.number

            // Calculate scroll percentage
            const scrollDOM = view.scrollDOM
            const scrollTop = scrollDOM.scrollTop
            const scrollHeight = scrollDOM.scrollHeight
            const clientHeight = scrollDOM.clientHeight
            const maxScroll = scrollHeight - clientHeight
            const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0

            // Use stable callbacks from ref
            const { onFirstLineChange, onScrollPercentageChange } = callbacksRef.current

            // Check if first visible line changed
            if (lineNumber !== this.lastReportedLine) {
              this.lastReportedLine = lineNumber
              onFirstLineChange?.(lineNumber)
            }

            // Check if scroll percentage changed significantly (> 0.5% for more responsive sync)
            const percentageDiff = Math.abs(scrollPercentage - this.lastScrollPercentage)
            if (percentageDiff > 0.005) {
              this.lastScrollPercentage = scrollPercentage
              onScrollPercentageChange?.(scrollPercentage)
            }

            this.rafId = null
          })
        }

        destroy() {
          if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId)
          }
          if (this.quietTimeoutId !== null) {
            clearTimeout(this.quietTimeoutId)
          }
        }
      }

      return ViewPlugin.fromClass(ScrollSyncPluginClass)
    },
    [] // Empty deps - plugin instance never recreates
  )

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      const view = editorViewRef.current
      if (view) {
        const scrollDOM = view.scrollDOM
        if (scrollDOM) {
          scrollDOM.scrollTop = 0
        }
      }
    },
    get editorView() {
      // Access the EditorView from the ref
      return editorViewRef.current
    }
  }), [])

  return (
    <CodeMirror
      value={value}
      height="100%"
      ref={(view: EditorView | null) => {
        editorViewRef.current = view
      }}
      extensions={[
        markdown(),
        search(),
        highlightSelectionMatches(),
        EditorView.lineWrapping,
        scrollSyncPlugin,
        EditorView.theme({
          '&': {
            height: '100%',
            backgroundColor: theme === 'dark' ? '#1e1e1e !important' : '#ffffff !important',
          },
          '&.cm-dark': {
            backgroundColor: '#1e1e1e !important',
          },
          '.cm-scroller': {
            overflow: 'auto',
            backgroundColor: 'inherit !important',
          },
          '.cm-gutters': {
            backgroundColor: theme === 'dark' ? '#1e1e1e !important' : '#ffffff !important',
            display: showLineNumbers ? 'block' : 'none',
          },
          '.cm-content': {
            maxWidth: '100%',
          },
          '.cm-line': {
            backgroundColor: 'transparent !important',
          },
          '.cm-lineNumbers': {
            display: showLineNumbers ? 'block' : 'none',
          },
          '.cm-activeLine': {
            backgroundColor: theme === 'dark' ? '#2d2d2d !important' : '#f0f0f0 !important',
          },
          '.cm-activeLineGutter': {
            backgroundColor: theme === 'dark' ? '#2d2d2d !important' : '#f0f0f0 !important',
          },
        }),
      ]}
      theme={theme === 'dark' ? oneDark : undefined}
      onChange={handleChange}
      className={className}
      basicSetup={{
        lineNumbers: showLineNumbers,
        highlightActiveLineGutter: showLineNumbers,
        highlightSpecialChars: true,
        foldGutter: showLineNumbers,
        drawSelection: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        syntaxHighlighting: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        rectangularSelection: true,
        crosshairCursor: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        closeBracketsKeymap: true,
        searchKeymap: true,
        foldKeymap: true,
        completionKeymap: true,
        lintKeymap: true,
      }}
    />
  )
})

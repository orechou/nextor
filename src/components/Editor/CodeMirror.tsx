import { useCallback, useMemo, useRef, forwardRef, useImperativeHandle } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { search, highlightSelectionMatches } from '@codemirror/search'
import { EditorView, ViewPlugin, type ViewUpdate } from '@codemirror/view'

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
  resetSync?: () => void
  editorView?: any
}

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
  const pluginInstanceRef = useRef<{ reset: () => void } | null>(null)
  const handleChange = useCallback(
    (value: string) => {
      onChange(value)
    },
    [onChange]
  )

  // Create a plugin to track the first visible line
  // Memoized to prevent recreation on every render
  const scrollSyncPlugin = useMemo(
    () => {
      // Create a class with a reset method
      class ScrollSyncPluginClass {
        private rafId: number | null = null
        public lastReportedLine = -1
        private lastScrollPercentage = -1

        reset() {
          this.lastReportedLine = -1
          this.lastScrollPercentage = -1
        }

        update(update: ViewUpdate) {
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

            // Check if first visible line changed
            if (lineNumber !== this.lastReportedLine) {
              this.lastReportedLine = lineNumber
              onFirstLineChange?.(lineNumber)
            }

            // Check if scroll percentage changed significantly (> 1%)
            const percentageDiff = Math.abs(scrollPercentage - this.lastScrollPercentage)
            if (percentageDiff > 0.01) {
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
        }
      }

      const plugin = ViewPlugin.fromClass(ScrollSyncPluginClass)

      // Return a wrapper that allows us to access the instance
      return Object.assign(plugin, {
        // Add a factory method that stores the instance
        createInstance(_view: EditorView) {
          const instance = new ScrollSyncPluginClass()
          pluginInstanceRef.current = instance
          return instance
        }
      })
    },
    [onFirstLineChange, onScrollPercentageChange]
  )

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      if (editorViewRef.current) {
        const scrollDOM = editorViewRef.current.scrollDOM
        if (scrollDOM) {
          scrollDOM.scrollTop = 0
        }
      }
    },
    resetSync: () => {
      if (pluginInstanceRef.current?.reset) {
        pluginInstanceRef.current.reset()
      }
    },
    editorView: editorViewRef.current
  }), [])

  return (
    <CodeMirror
      value={value}
      height="100%"
      ref={editorViewRef}
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

import { useCallback, useRef, useEffect, useState } from 'react'
import { CodeMirrorEditor } from './CodeMirror'
import { Preview, PreviewHandle } from './Preview'
import { StatusBar } from './StatusBar'
import { FindReplaceDialog } from './FindReplaceDialog'
import { TableOfContents } from './TableOfContents'
import { useTableOfContents } from '@/hooks/useTableOfContents'
import { useTheme } from '@/hooks/useTheme'
import { usePreviewMode } from '@/hooks/usePreviewMode'
import { cn } from '@/lib/utils'

type ViewMode = 'edit' | 'preview' | 'split'

interface EditorProps {
  content: string
  onChange: (value: string) => void
  viewMode?: ViewMode
  leftSidebarOpen?: boolean
  rightSidebarOpen?: boolean
  leftSidebarContent?: React.ReactNode
  tocOpen?: boolean
  onEditorViewRef?: (ref: any) => void
  onWikiLinkClick?: (pageName: string) => void
}

export function Editor({ content, onChange, viewMode: externalViewMode, leftSidebarOpen = false, rightSidebarOpen = true, leftSidebarContent, tocOpen = false, onEditorViewRef, onWikiLinkClick }: EditorProps) {
  const { resolvedTheme } = useTheme()
  const {
    wechatMode,
    wechatTheme,
    includeTitle,
    setWechatMode,
    setWechatTheme,
  } = usePreviewMode()
  const previewRef = useRef<PreviewHandle>(null)
  const codeMirrorRef = useRef<{ scrollToTop?: () => void; resetSync?: () => void; editorView?: any } | null>(null)
  const [findReplaceOpen, setFindReplaceOpen] = useState(false)
  const [currentLine, setCurrentLine] = useState(1)

  // Table of contents
  const { headings, activeId } = useTableOfContents({
    content,
    activeLine: currentLine
  })

  // Get current title from content (first heading or default)
  const currentTitle = content.match(/^#\s+(.+)$/m)?.[1] || 'Preview'

  // Use external view mode if provided, otherwise default to 'split'
  const viewMode = externalViewMode ?? 'split'
  const showPreview = viewMode === 'preview' || (viewMode === 'split' && rightSidebarOpen)
  const showEditor = viewMode === 'edit' || viewMode === 'split' || !rightSidebarOpen

  // Reset scroll positions when content changes
  useEffect(() => {
    console.log('[Editor] Content changed, resetting scroll positions')
    // Use a small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      // Reset scroll positions
      // Note: We don't call resetSync anymore because the plugin auto-detects doc changes
      if (previewRef.current) {
        console.log('[Editor] Resetting preview scroll')
        previewRef.current.scrollToTop?.()
      }
      if (codeMirrorRef.current?.scrollToTop) {
        console.log('[Editor] Resetting editor scroll')
        codeMirrorRef.current.scrollToTop()
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [content])

  const handleFirstLineChange = useCallback((lineNumber: number) => {
    setCurrentLine(lineNumber)
    if (previewRef.current && showPreview) {
      previewRef.current.scrollToLine(lineNumber)
    }
  }, [showPreview])

  // Scroll to specific line (for TOC navigation)
  const scrollToLine = useCallback((line: number) => {
    if (codeMirrorRef.current?.editorView) {
      const editorView = codeMirrorRef.current.editorView
      const lineObj = editorView.state.doc.line(line)
      const pos = lineObj.from

      editorView.dispatch({
        effects: (editorView as any).scrollIntoView(pos, { y: 'start', yMargin: 20 })
      })

      // Set focus to editor
      editorView.focus()
    }
  }, [])

  // Sync based on scroll percentage (more responsive than line-based)
  const handleScrollPercentageChange = useCallback((percentage: number) => {
    if (previewRef.current && showPreview) {
      previewRef.current.scrollToPercentage?.(percentage)
    }
  }, [showPreview])

  // Expose editor view to parent for find/replace functionality
  useEffect(() => {
    if (codeMirrorRef.current?.editorView && onEditorViewRef) {
      onEditorViewRef(codeMirrorRef.current.editorView)
    }
  }, [onEditorViewRef])

  // Expose public API for toggling find/replace
  useEffect(() => {
    ;(window as any).__nextorEditor = {
      openFind: () => setFindReplaceOpen(true),
      openReplace: () => setFindReplaceOpen(true),
      closeFindReplace: () => setFindReplaceOpen(false),
    }
    return () => {
      delete (window as any).__nextorEditor
    }
  }, [])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Find/Replace Dialog */}
      <FindReplaceDialog
        isOpen={findReplaceOpen}
        onClose={() => setFindReplaceOpen(false)}
        editorView={codeMirrorRef.current?.editorView}
        showReplace={false}
      />

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-hidden flex min-h-0">
        {/* Left Sidebar - File Explorer */}
        {leftSidebarOpen && leftSidebarContent && (
          <div className="w-64 border-r border-gray-300 dark:border-[#2d2d2d] overflow-hidden flex-shrink-0">
            {leftSidebarContent}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          {showEditor && (
            <div className={cn(
              "flex flex-col min-w-0 min-h-0",
              showPreview && viewMode === 'split' ? 'flex-1 border-r border-gray-300 dark:border-[#2d2d2d]' : 'flex-1',
              resolvedTheme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
            )}>
              <div className="flex-1 min-h-0">
                <CodeMirrorEditor
                  value={content}
                  onChange={onChange}
                  onFirstLineChange={handleFirstLineChange}
                  onScrollPercentageChange={handleScrollPercentageChange}
                  className="h-full"
                  theme={resolvedTheme}
                  showLineNumbers={false}
                  ref={codeMirrorRef}
                />
              </div>
              {/* Status Bar - only for editor */}
              <StatusBar content={content} />
            </div>
          )}

          {/* Right Sidebar - Preview */}
          {showPreview && (
            <div className={cn(
              "flex-1 overflow-hidden min-w-0",
              resolvedTheme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
            )}>
              <Preview
                content={content}
                ref={previewRef}
                onWikiLinkClick={onWikiLinkClick}
                wechatMode={wechatMode}
                wechatTheme={wechatTheme}
                includeTitle={includeTitle}
                onWechatModeChange={setWechatMode}
                onWechatThemeChange={setWechatTheme}
                title={currentTitle}
              />
            </div>
          )}

          {/* Table of Contents Sidebar */}
          {tocOpen && (
            <div className={cn(
              "w-64 border-l border-gray-300 dark:border-[#2d2d2d] overflow-hidden flex-shrink-0",
              resolvedTheme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-gray-50'
            )}>
              <div className="h-full flex flex-col">
                <div className={cn(
                  "px-4 py-2 border-b text-sm font-medium shrink-0",
                  "border-gray-200 dark:border-[#2d2d2d]",
                  "text-gray-700 dark:text-gray-300"
                )}>
                  Table of Contents
                </div>
                <div className="flex-1 overflow-auto">
                  <TableOfContents
                    headings={headings}
                    activeId={activeId}
                    onHeadingClick={scrollToLine}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

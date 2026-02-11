import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { createElement } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import { useTranslation } from 'react-i18next'
import { forwardRef, useEffect, useRef, useImperativeHandle, useMemo, useCallback, useState } from 'react'
import type {
  LineElementsMap,
  MarkdownComponentPropsWithNode,
  MarkdownComponentProps,
} from '@/types/preview'
import { EDITOR } from '@/lib/constants'
import { remarkWikiLinks } from '@/lib/remarkWikiLinks'
import { getWeChatTemplate, getAvailableThemes } from '@/lib/wechat/themeRegistry'
import { convertMarkdownToHTML } from '@/lib/export'
import type { WeChatTheme } from '@/lib/export'
import mermaid from 'mermaid'

type SourceLineTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'ul' | 'ol' | 'li' | 'blockquote' | 'pre' | 'table' | 'hr'

function createSourceLineComponent(
  Tag: SourceLineTag,
  getLineNumber: (offset?: number) => number
) {
  return function SourceLineComponent({ node, ...props }: MarkdownComponentPropsWithNode) {
    const lineNumber = getLineNumber(node?.position?.start?.offset)
    return createElement(Tag, { ...props, 'data-source-line': lineNumber })
  }
}

interface PreviewProps {
  content: string
  className?: string
  onWikiLinkClick?: (pageName: string) => void
  wechatMode?: boolean
  wechatTheme?: WeChatTheme
  includeTitle?: boolean
  onWechatModeChange?: (enabled: boolean) => void
  onWechatThemeChange?: (theme: WeChatTheme) => void
  title?: string
}

export interface PreviewHandle {
  scrollToLine: (lineNumber: number) => void
  scrollToTop?: () => void
  scrollToPercentage?: (percentage: number) => void
}

export const Preview = forwardRef<PreviewHandle, PreviewProps>(
  ({
    content,
    className,
    onWikiLinkClick,
    wechatMode = false,
    wechatTheme = 'minimal',
    includeTitle = true,
    onWechatModeChange,
    onWechatThemeChange,
    title = 'Preview'
  }, ref) => {
  const { t } = useTranslation()
  const { resolvedTheme } = useTheme()
  const internalRef = useRef<HTMLDivElement>(null)
  const lineElementsMap = useRef<LineElementsMap>(new Map())
  const lastScrollTime = useRef<number>(0)

  // Handle footnote link clicks to prevent whitespace at bottom
  const handleFootnoteClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href')
    if (!href?.startsWith('#')) return

    // Detect footnote links (remark-gfm adds 'user-content-' prefix)
    const isFootnoteRef = href.match(/^#(?:user-content-)?fn-?\d+$/)     // #fn-1, #fn1, or #user-content-fn-1
    const isFootnoteBackRef = href.match(/^#(?:user-content-)?fnref-?\d+$/)  // #fnref-1 or #user-content-fnref-1

    if (!isFootnoteRef && !isFootnoteBackRef) return

    e.preventDefault()
    e.stopPropagation()

    if (!internalRef.current) return

    // Find target element
    const targetId = href.substring(1)
    const targetElement = internalRef.current.querySelector(`[id="${targetId}"]`)
    if (!targetElement) return

    // Get the scroll container (parent of internalRef)
    const scrollContainer = internalRef.current.parentElement
    if (!scrollContainer) return

    // Get dimensions
    const containerHeight = scrollContainer.clientHeight
    const contentHeight = scrollContainer.scrollHeight
    const currentScrollTop = scrollContainer.scrollTop

    // Calculate target position using getBoundingClientRect for accuracy
    const targetRect = (targetElement as HTMLElement).getBoundingClientRect()
    const containerRect = scrollContainer.getBoundingClientRect()

    // Calculate where the target is relative to the content
    const targetPosition = currentScrollTop + targetRect.top - containerRect.top

    // Calculate scroll position
    let scrollTop: number
    if (contentHeight <= containerHeight) {
      // Content fits in container - scroll to top to avoid whitespace
      scrollTop = 0
    } else {
      // Content is longer - scroll to show target with offset
      const offset = 20
      const maxScrollTop = contentHeight - containerHeight
      scrollTop = Math.min(targetPosition - offset, maxScrollTop)
    }

    scrollContainer.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: 'smooth'
    })
  }, [])

  // Build a map of character offsets to line numbers ONCE per content change
  // Also create a sorted array for binary search
  const lineOffsetCache = useMemo(() => {
    const cache = new Map<number, number>()
    let line = 1
    cache.set(0, 1)

    for (let i = 0; i < content.length; i++) {
      if (content[i] === '\n') {
        line++
        cache.set(i + 1, line)
      }
    }

    // Create sorted array for binary search - store as property on the Map
    const sortedOffsets = Array.from(cache.entries()).sort((a, b) => a[0] - b[0])
    ;(cache as any)._sortedOffsets = sortedOffsets

    return cache
  }, [content])

  // Helper to get line number from character offset using binary search O(log n)
  const getLineNumber = useCallback((offset?: number) => {
    if (offset === undefined || offset === 0) return 1

    // Use sorted array for binary search
    const sortedOffsets = (lineOffsetCache as any)._sortedOffsets
    if (!sortedOffsets || sortedOffsets.length === 0) return 1

    // Binary search for the largest key <= offset
    let left = 0
    let right = sortedOffsets.length - 1
    let bestLine = 1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const [key, line] = sortedOffsets[mid]

      if (key <= offset) {
        bestLine = line
        left = mid + 1
      } else {
        right = mid - 1
      }
    }

    return bestLine
  }, [lineOffsetCache])

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    scrollToLine: (lineNumber: number) => {
      const now = performance.now()

      // Throttle scroll updates
      if (now - lastScrollTime.current < EDITOR.SCROLL_THROTTLE_MS) {
        return
      }
      lastScrollTime.current = now

      let element = lineElementsMap.current.get(lineNumber)

      // If exact line not found, find the nearest element
      if (!element && lineElementsMap.current.size > 0) {
        // Use cached sorted lines array for O(1) access instead of O(n log n) sort
        const sortedLines = lineElementsMap.current._sortedLines || []
        // Find the first line greater than or equal to our target line
        const nearestLine = sortedLines.find((line: number) => line >= lineNumber)
        // Or use the last line if all are before our target
        const targetLine = nearestLine || sortedLines[sortedLines.length - 1]
        if (targetLine) {
          element = lineElementsMap.current.get(targetLine)
        }
      }

      if (element && internalRef.current) {
        // Calculate the scroll position to align element to top
        const containerRect = internalRef.current.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        const scrollTop = internalRef.current.scrollTop + elementRect.top - containerRect.top

        // Use direct scrollTop manipulation to avoid layout recalculation
        internalRef.current.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        })
      }
    },
    scrollToTop: () => {
      if (internalRef.current) {
        internalRef.current.scrollTop = 0
      }
    },
    scrollToPercentage: (percentage: number) => {
      if (internalRef.current) {
        const scrollDOM = internalRef.current
        const scrollHeight = scrollDOM.scrollHeight
        const clientHeight = scrollDOM.clientHeight
        const maxScroll = scrollHeight - clientHeight
        const targetScrollTop = maxScroll * percentage

        scrollDOM.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        })
      }
    }
  }))

  // Build line to element map when content changes (only for normal mode)
  useEffect(() => {
    if (!internalRef.current || wechatMode) return

    const map = new Map<number, HTMLElement>()

    // Function to build the line map
    const buildLineMap = () => {
      const elements = internalRef.current?.querySelectorAll('[data-source-line]')
      if (!elements || elements.length === 0) return false

      map.clear()
      elements?.forEach(el => {
        const lineNum = parseInt(el.getAttribute('data-source-line') || '0')
        if (lineNum > 0) {
          map.set(lineNum, el as HTMLElement)
        }
      })

      // Cache sorted lines array for O(1) access in scrollToLine
      const sortedLines = Array.from(map.keys()).sort((a, b) => a - b)
      lineElementsMap.current = map as LineElementsMap
      lineElementsMap.current._sortedLines = sortedLines
      return true
    }

    // Try immediately first
    if (buildLineMap()) return

    // If that fails, use MutationObserver to wait for content
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          if (buildLineMap()) {
            observer.disconnect()
            break
          }
        }
      }
    })

    observer.observe(internalRef.current, {
      childList: true,
      subtree: true
    })

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      if (map.size === 0) {
        buildLineMap()
      }
      observer.disconnect()
    }, EDITOR.FALLBACK_TIMEOUT_MS)

    return () => {
      observer.disconnect()
      clearTimeout(fallbackTimeout)
    }
  }, [content, wechatMode])

  // Initialize Mermaid with theme-based configuration
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
    })
  }, [resolvedTheme])

  // Render Mermaid diagrams when content changes (only for normal mode)
  const [mermaidKey, setMermaidKey] = useState(0)
  useEffect(() => {
    if (wechatMode) return

    const renderMermaidDiagrams = async () => {
      const elements = internalRef.current?.querySelectorAll('.mermaid')
      if (!elements || elements.length === 0) return

      for (const element of elements) {
        // Skip if already rendered
        if (element.querySelector('svg')) continue

        try {
          const code = element.textContent || ''
          if (!code.trim()) continue

          const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`
          const { svg } = await mermaid.render(uniqueId, code)
          element.innerHTML = svg
        } catch (error) {
          console.error('Mermaid render error:', error)
          element.innerHTML = `<pre class="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">${error instanceof Error ? error.message : 'Mermaid rendering error'}</pre>`
        }
      }
    }

    // Trigger re-render by updating key
    setMermaidKey(prev => prev + 1)

    // Delay rendering to wait for DOM update
    const timeout = setTimeout(renderMermaidDiagrams, 150)
    return () => clearTimeout(timeout)
  }, [content, wechatMode])

  // WeChat mode HTML content
  const wechatHtml = useMemo(() => {
    if (!wechatMode) return null
    return convertMarkdownToHTML(content).then(html => {
      const template = getWeChatTemplate(wechatTheme)
      return template.getWrapper(html, title, { theme: wechatTheme, includeTitle, width: 677 })
    })
  }, [wechatMode, wechatTheme, includeTitle, content, title])

  // WeChat mode CSS
  const wechatCSS = useMemo(() => {
    if (!wechatMode) return ''
    const template = getWeChatTemplate(wechatTheme)
    return template.getCSS({ theme: wechatTheme, includeTitle, width: 677 })
  }, [wechatMode, wechatTheme, includeTitle])

  const markdownComponents = useMemo(
    () => ({
      p: createSourceLineComponent('p', getLineNumber),
      h1: createSourceLineComponent('h1', getLineNumber),
      h2: createSourceLineComponent('h2', getLineNumber),
      h3: createSourceLineComponent('h3', getLineNumber),
      h4: createSourceLineComponent('h4', getLineNumber),
      ul: createSourceLineComponent('ul', getLineNumber),
      ol: createSourceLineComponent('ol', getLineNumber),
      li: createSourceLineComponent('li', getLineNumber),
      blockquote: createSourceLineComponent('blockquote', getLineNumber),
      pre: ({ children, node, ...props }: MarkdownComponentPropsWithNode) => {
        const lineNumber = getLineNumber(node?.position?.start?.offset)

        // Check if this is a mermaid code block
        const codeClassName = (children as any)?.props?.className || ''
        const isMermaid = codeClassName.includes('language-mermaid')

        if (isMermaid) {
          const code = (children as any)?.props?.children || ''
          return (
            <pre {...props} data-source-line={lineNumber}>
              <div className="mermaid">{code}</div>
            </pre>
          )
        }

        return createElement('pre', { ...props, 'data-source-line': lineNumber }, children)
      },
      table: createSourceLineComponent('table', getLineNumber),
      hr: createSourceLineComponent('hr', getLineNumber),
      code: ({ className, children, ...props }: MarkdownComponentProps) => {
        // Check if this is inline code (not in a pre block)
        const isInline = !className
        if (isInline) {
          return <code className={className} {...props}>{children}</code>
        }
        // For block code, let the parent pre handle it
        return <code className={className} {...props}>{children}</code>
      },
      div: (props: MarkdownComponentProps) => {
        if (props.className === 'mermaid') {
          return <div className="mermaid">{props.children}</div>
        }
        return <div {...props} />
      },
      a: ({ href, className, ...props }: any) => {
        // Check if this is a wiki link
        const isWikiLink = className?.includes('wiki-link')
        const pageName = props['data-wiki-link']

        if (isWikiLink && pageName) {
          return (
            <a
              href={href}
              className={cn(
                'wiki-link text-blue-600 dark:text-blue-400 hover:underline cursor-pointer',
                className
              )}
              onClick={(e) => {
                e.preventDefault()
                onWikiLinkClick?.(pageName)
              }}
            >
              {props.children}
            </a>
          )
        }

        // Detect footnote links (remark-gfm adds 'user-content-' prefix)
        const isFootnoteLink = href?.match(/#(?:user-content-)?fn-?\d+$|#(?:user-content-)?fnref-?\d+$/)

        return (
          <a
            href={href}
            className={cn(
              'text-blue-600 dark:text-blue-400 hover:underline',
              isFootnoteLink && 'cursor-pointer',
              className
            )}
            onClick={isFootnoteLink ? handleFootnoteClick : undefined}
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
          />
        )
      },
    }),
    [getLineNumber, onWikiLinkClick, handleFootnoteClick]
  )

  const availableThemes = getAvailableThemes()

  return (
    <div className="relative h-full flex flex-col">
      {/* Preview content area */}
      <div className="flex-1 overflow-auto min-h-0">
        {wechatMode ? (
          // WeChat mode rendering
          <WeChatPreviewContent
            contentPromise={wechatHtml}
            css={wechatCSS}
            ref={internalRef}
          />
        ) : (
          // Normal mode rendering (existing code)
          <div
            ref={internalRef}
            onContextMenu={(e) => e.preventDefault()}
            className={cn(
              'max-w-full p-6 prose',
              resolvedTheme === 'dark' ? 'bg-[#1e1e1e] prose-invert' : 'bg-white',
              className
            )}
          >
            <style>{`
              .hljs {
                background: hsl(var(--muted) / 0.5);
                padding: 0.5rem;
                border-radius: 0.25rem;
              }
              .dark .hljs {
                background: hsl(var(--muted) / 0.3);
              }
            `}</style>
            <ReactMarkdown
              key={mermaidKey}
              remarkPlugins={[remarkGfm, remarkBreaks, remarkWikiLinks, remarkMath]}
              rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeKatex]}
              components={markdownComponents as unknown as Components}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Preview mode toggle bar - matches StatusBar styling */}
      <div className={cn(
        "flex items-center justify-between px-4 py-1 text-xs border-t shrink-0",
        "bg-gray-50 dark:bg-[#1e1e1e]",
        "border-gray-200 dark:border-[#2d2d2d]",
        "text-gray-600 dark:text-gray-400",
        "min-h-0 h-6"
      )}>
        {/* Left side: mode toggle buttons */}
        <div className="flex items-center gap-3 min-h-0">
          <button
            onClick={() => onWechatModeChange?.(false)}
            className={cn(
              "hover:text-gray-900 dark:hover:text-gray-200 transition-colors p-0",
              !wechatMode && "font-semibold text-gray-900 dark:text-gray-200"
            )}
          >
            {t('preview.normal_mode')}
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => onWechatModeChange?.(true)}
            className={cn(
              "hover:text-gray-900 dark:hover:text-gray-200 transition-colors p-0",
              wechatMode && "font-semibold text-gray-900 dark:text-gray-200"
            )}
          >
            {t('preview.wechat_mode')}
          </button>
        </div>

        {/* Right side: theme selector (only visible in WeChat mode) */}
        {wechatMode && onWechatThemeChange && (
          <div className="min-h-0 flex items-center">
            <select
              value={wechatTheme}
              onChange={(e) => onWechatThemeChange(e.target.value as WeChatTheme)}
              style={{ height: '14px', fontSize: '12px', padding: '0 4px', border: '1px solid', borderRadius: '4px' }}
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              {availableThemes.map(theme => (
                <option key={theme} value={theme}>{t(`export.themes.${theme}`)}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
})

// Separate component for handling async WeChat HTML rendering with iframe isolation
const WeChatPreviewContent = forwardRef<HTMLDivElement, {
  contentPromise: Promise<string> | null
  css: string
}>(({ contentPromise, css }, ref) => {
  const [html, setHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Forward ref to parent
  useImperativeHandle(ref, () => iframeRef.current as unknown as HTMLDivElement)

  useEffect(() => {
    if (!contentPromise) {
      setLoading(false)
      return
    }

    setLoading(true)
    contentPromise.then(setHtml).finally(() => setLoading(false))
  }, [contentPromise])

  // Update iframe content when html or css changes
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !html || loading) return

    const doc = iframe.contentDocument
    if (!doc) return

    // Combine CSS and HTML into a complete document
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
      </head>
      <body style="margin:0;padding:0;background:#fff;">
        ${html}
      </body>
      </html>
    `

    doc.open()
    doc.write(fullHtml)
    doc.close()
  }, [html, css, loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0 bg-white"
      title="WeChat Preview"
      sandbox="allow-same-origin"
    />
  )
})

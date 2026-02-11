import { useEffect, useState, useMemo } from 'react'
import { extractHeadings, findActiveHeading, type TOCItem } from '@/lib/tableOfContents'

interface UseTableOfContentsOptions {
  content: string
  activeLine: number
  debounceMs?: number
}

export function useTableOfContents({ content, activeLine, debounceMs = 200 }: UseTableOfContentsOptions) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // Memoized flat headings for easier navigation
  const flatHeadings = useMemo(() => {
    const result: TOCItem[] = []

    function traverse(items: TOCItem[]) {
      for (const item of items) {
        result.push(item)
        if (item.children.length > 0) {
          traverse(item.children)
        }
      }
    }

    traverse(headings)
    return result
  }, [headings])

  // Update headings when content changes (with debouncing)
  useEffect(() => {
    const timer = setTimeout(() => {
      const newHeadings = extractHeadings(content)
      setHeadings(newHeadings)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [content, debounceMs])

  // Update active heading based on current line
  useEffect(() => {
    const id = findActiveHeading(headings, activeLine)
    setActiveId(id)
  }, [activeLine, headings])

  return { headings, activeId, flatHeadings }
}

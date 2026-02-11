/**
 * Table of Contents item
 */
export interface TOCItem {
  id: string
  level: number
  title: string
  line: number
  children: TOCItem[]
}

/**
 * Extract headings from markdown content
 * Returns a flat list of headings with line numbers
 */
export function extractHeadings(content: string): TOCItem[] {
  const items: TOCItem[] = []
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)

    if (headingMatch) {
      const level = headingMatch[1].length
      const title = headingMatch[2].trim()
      const id = `heading-${i}`

      items.push({
        id,
        level,
        title,
        line: i + 1,
        children: []
      })
    }
  }

  return buildHierarchy(items)
}

/**
 * Build hierarchical tree from flat heading list
 */
function buildHierarchy(items: TOCItem[]): TOCItem[] {
  const result: TOCItem[] = []
  const stack: TOCItem[] = []

  for (const item of items) {
    // Pop items from stack that are at the same level or higher
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      // Top-level heading
      result.push(item)
    } else {
      // Child of the current parent
      stack[stack.length - 1].children.push(item)
    }

    stack.push(item)
  }

  return result
}

/**
 * Flatten heading tree for easy searching
 */
export function flattenHeadings(items: TOCItem[]): TOCItem[] {
  const result: TOCItem[] = []

  function traverse(list: TOCItem[]) {
    for (const item of list) {
      result.push(item)
      if (item.children.length > 0) {
        traverse(item.children)
      }
    }
  }

  traverse(items)
  return result
}

/**
 * Find the active heading based on current line number
 */
export function findActiveHeading(headings: TOCItem[], currentLine: number): string | null {
  const flattened = flattenHeadings(headings)
  let activeId: string | null = null

  for (const item of flattened) {
    if (item.line <= currentLine) {
      activeId = item.id
    } else {
      break
    }
  }

  return activeId
}

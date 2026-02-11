import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Text } from 'mdast'

/**
 * Remark plugin to support Wiki-style links [[page]] or [[page|text]] or [[page#heading]]
 */
export const remarkWikiLinks: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!node.value || typeof index !== 'number' || !parent) return

      // Match [[page]] or [[page|text]] or [[page#heading]]
      const wikiLinkRegex = /\[\[([^\]#\|]+)(#[^\]\|]+)?(?:\|([^\]]+))?\]\]/g

      if (!wikiLinkRegex.test(node.value)) return

      const parts: any[] = []
      let lastIndex = 0
      let match: RegExpExecArray | null

      // Reset regex for actual matching
      wikiLinkRegex.lastIndex = 0

      while ((match = wikiLinkRegex.exec(node.value)) !== null) {
        const [fullMatch, page, heading, displayText] = match
        const matchStart = match.index

        // Add text before the match
        if (matchStart > lastIndex) {
          parts.push({
            type: 'text',
            value: node.value.slice(lastIndex, matchStart)
          })
        }

        // Create link node
        const linkText = displayText || page
        const href = `./${page}.md${heading || ''}`

        parts.push({
          type: 'link',
          url: href,
          children: [{ type: 'text', value: linkText }],
          data: {
            hName: 'a',
            hProperties: {
              className: ['wiki-link'],
              'data-wiki-link': page
            }
          }
        })

        lastIndex = matchStart + fullMatch.length
      }

      // Add remaining text
      if (lastIndex < node.value.length) {
        parts.push({
          type: 'text',
          value: node.value.slice(lastIndex)
        })
      }

      // Replace the original text node with the new parts
      if (parts.length > 0) {
        ;(parent.children as any[]).splice(index, 1, ...parts)
      }
    })
  }
}

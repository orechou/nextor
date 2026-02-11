/**
 * Represents the position information in a markdown AST node
 */
export interface MarkdownPosition {
  offset?: number
  line?: number
  column?: number
}

/**
 * Represents a node in the markdown Abstract Syntax Tree
 */
export interface MarkdownNode {
  position?: {
    start?: MarkdownPosition
    end?: MarkdownPosition
  }
  type?: string
  tagName?: string
  properties?: Record<string, unknown>
}

/**
 * Helper function to extract line number from a markdown node
 */
export function getLineNumberFromNode(node?: MarkdownNode): number | undefined {
  return node?.position?.start?.offset
}

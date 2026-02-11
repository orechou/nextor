import type { MarkdownNode } from './markdown'

/**
 * Extended map interface for line elements with cached sorted lines
 */
export interface LineElementsMap extends Map<number, HTMLElement> {
  _sortedLines?: number[]
}

/** Props for react-markdown custom components that receive AST node (for source-line sync) */
export interface MarkdownComponentPropsWithNode {
  node?: MarkdownNode
  children?: React.ReactNode
  className?: string
  [key: string]: unknown
}

/** Props for code/div etc. without node */
export interface MarkdownComponentProps {
  className?: string
  children?: React.ReactNode
  [key: string]: unknown
}

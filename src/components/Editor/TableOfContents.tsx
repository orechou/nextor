import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight, ChevronDown, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type TOCItem } from '@/lib/tableOfContents'

interface TableOfContentsProps {
  headings: TOCItem[]
  activeId: string | null
  onHeadingClick: (line: number) => void
}

interface TOCItemComponentProps {
  item: TOCItem
  isActive: boolean
  depth: number
  onHeadingClick: (line: number) => void
}

function TOCItemComponent({ item, isActive, depth, onHeadingClick }: TOCItemComponentProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = item.children.length > 0

  const handleClick = () => {
    onHeadingClick(item.line)
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div>
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center gap-1.5 py-1.5 px-2 cursor-pointer text-sm rounded transition-colors",
          "hover:bg-gray-200 dark:hover:bg-[#2d2d2d]",
          isActive && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium",
          !isActive && "text-gray-700 dark:text-gray-300"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren && (
          <span className="shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </span>
        )}
        {!hasChildren && <span className="w-3 shrink-0" />}
        <span className="truncate">{item.title}</span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {item.children.map(child => (
            <TOCItemComponent
              key={child.id}
              item={child}
              isActive={isActive}
              depth={depth + 1}
              onHeadingClick={onHeadingClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TableOfContents({ headings, activeId, onHeadingClick }: TableOfContentsProps) {
  const { t } = useTranslation()

  if (headings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <List className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">{t('toc.noHeadings')}</p>
      </div>
    )
  }

  return (
    <div className="py-2 overflow-y-auto">
      {headings.map(heading => (
        <TOCItemComponent
          key={heading.id}
          item={heading}
          isActive={activeId === heading.id}
          depth={0}
          onHeadingClick={onHeadingClick}
        />
      ))}
    </div>
  )
}

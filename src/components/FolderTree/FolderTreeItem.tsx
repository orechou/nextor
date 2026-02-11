import { Folder, FolderOpen, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FolderTreeItemProps {
  name: string
  path: string
  depth: number
  isSelected: boolean
  isExpanded: boolean
  onClick: () => void
  onToggle: (e: React.MouseEvent) => void
}

export function FolderTreeItem({
  name,
  depth,
  isSelected,
  isExpanded,
  onClick,
  onToggle,
}: FolderTreeItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 px-2 py-1.5 cursor-pointer select-none text-sm",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted"
      )}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
    >
      <button
        onClick={onToggle}
        className="p-0.5 hover:bg-muted rounded shrink-0"
      >
        <ChevronRight
          className={cn(
            "w-3 h-3 transition-transform",
            isExpanded && "transform rotate-90"
          )}
        />
      </button>
      {isExpanded ? (
        <FolderOpen className="w-4 h-4 shrink-0 text-blue-500" />
      ) : (
        <Folder className="w-4 h-4 shrink-0 text-blue-500" />
      )}
      <span className="truncate">{name}</span>
    </div>
  )
}

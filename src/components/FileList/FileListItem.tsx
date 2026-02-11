import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileListItemProps {
  name: string
  path: string
  isActive: boolean
  onClick: () => void
}

export function FileListItem({ name, isActive, onClick }: FileListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 cursor-pointer select-none text-sm",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"
      )}
    >
      <FileText className="w-4 h-4 shrink-0 text-blue-500" />
      <span className="truncate">{name}</span>
    </div>
  )
}

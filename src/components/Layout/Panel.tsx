import { cn } from '@/lib/utils'

export interface PanelProps {
  isOpen: boolean
  width: string
  children: React.ReactNode
  header?: React.ReactNode
}

export function Panel({ isOpen, width, children, header }: PanelProps) {
  return (
    <div
      className={cn(
        "border-r transition-all duration-200 overflow-hidden flex flex-col",
        isOpen ? width : "w-0"
      )}
    >
      {header}
      <div className="overflow-y-auto h-full">
        {children}
      </div>
    </div>
  )
}

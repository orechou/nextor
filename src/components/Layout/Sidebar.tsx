import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'

export interface SidebarProps {
  isOpen: boolean
  onToggle?: () => void
  children: React.ReactNode
  header?: React.ReactNode
}

export function Sidebar({
  isOpen,
  children,
  header
}: SidebarProps) {
  const { resolvedTheme } = useTheme()

  return (
    <div
      className={cn(
        'overflow-hidden flex flex-col shrink-0 relative',
        // Only transition width, not colors
        'transition-[width] duration-300 ease-in-out',
        'w-[280px]',
        resolvedTheme === 'dark' ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-gray-300',
        'border-r',
        !isOpen && 'w-0'
      )}
    >
      {header && (
        <div className="flex items-center px-4 py-3 border-b border-gray-300 dark:border-[#2d2d2d] shrink-0">
          {header}
        </div>
      )}
      <div className="overflow-y-auto flex-1 min-h-0">
        {children}
      </div>
    </div>
  )
}

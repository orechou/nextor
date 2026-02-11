import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'

interface AppLayoutProps {
  folderBar?: ReactNode
  sidebar: ReactNode
  children: ReactNode
}

export function AppLayout({ folderBar, sidebar, children }: AppLayoutProps) {
  const { resolvedTheme } = useTheme()

  return (
    <div className={cn(
      "flex h-full",
      resolvedTheme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
    )}>
      {/* Folder Bar */}
      {folderBar}

      {/* Sidebar */}
      {sidebar}

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}

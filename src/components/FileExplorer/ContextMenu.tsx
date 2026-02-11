import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface ContextMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  danger?: boolean
}

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  // Adjust position if menu would go off screen
  const adjustPosition = () => {
    if (!menuRef.current) return { x, y }

    const rect = menuRef.current.getBoundingClientRect()
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    let adjustedX = x
    let adjustedY = y

    if (x + rect.width > screenWidth) {
      adjustedX = screenWidth - rect.width - 8
    }

    if (y + rect.height > screenHeight) {
      adjustedY = screenHeight - rect.height - 8
    }

    return { x: adjustedX, y: adjustedY }
  }

  const position = adjustPosition()

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[160px] bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1"
      style={{ left: position.x, top: position.y }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            item.onClick()
            onClose()
          }}
          className={cn(
            "w-full px-3 py-2 text-sm text-left flex items-center gap-2",
            "hover:bg-zinc-100 dark:hover:bg-zinc-700",
            "transition-colors duration-150",
            item.danger
              ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              : "text-zinc-700 dark:text-zinc-300"
          )}
        >
          {item.icon && (
            <span className="w-4 h-4 flex-shrink-0">
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

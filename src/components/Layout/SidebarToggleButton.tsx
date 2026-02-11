import { SidebarOpenIcon, SidebarCloseIcon } from '@/components/icons'

interface SidebarToggleButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export function SidebarToggleButton({ isOpen, onToggle }: SidebarToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed top-[6px] right-19 z-10 p-2 rounded-lg bg-gray-100 dark:bg-[#2d2d2d] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] text-gray-600 dark:text-gray-400 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {isOpen ? <SidebarCloseIcon size={13} /> : <SidebarOpenIcon size={13} />}
    </button>
  )
}

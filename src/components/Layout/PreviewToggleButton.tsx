import { PreviewShowIcon, PreviewHideIcon } from '@/components/icons'

interface PreviewToggleButtonProps {
  show: boolean
  onToggle: () => void
}

export function PreviewToggleButton({ show, onToggle }: PreviewToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed top-[6px] right-11 z-10 p-2 rounded-lg bg-gray-100 dark:bg-[#2d2d2d] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] text-gray-600 dark:text-gray-400 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label={show ? 'Hide preview' : 'Show preview'}
      title={show ? 'Hide preview' : 'Show preview'}
    >
      {show ? <PreviewShowIcon size={13} /> : <PreviewHideIcon size={13} />}
    </button>
  )
}

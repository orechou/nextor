import { useEffect } from 'react'

interface KeyboardShortcutsCallbacks {
  onToggleFolderTree: () => void
  onToggleFileList: () => void
  onCycleViewMode: () => void
  onTogglePresentation: () => void
  onToggleFindReplace?: () => void
  onToggleToc?: () => void
  onOpenSettings?: () => void
  onToggleDevTools?: () => void
}

export function useKeyboardShortcuts({
  onToggleFolderTree,
  onToggleFileList,
  onCycleViewMode,
  onTogglePresentation,
  onToggleFindReplace,
  onToggleToc,
  onOpenSettings,
  onToggleDevTools,
}: KeyboardShortcutsCallbacks) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+1: Toggle folder tree panel
      if (e.metaKey && e.key === '1') {
        e.preventDefault()
        onToggleFolderTree()
      }
      // Cmd+2: Toggle file list panel
      if (e.metaKey && e.key === '2') {
        e.preventDefault()
        onToggleFileList()
      }
      // Cmd+3: Cycle view modes (edit → preview → split)
      if (e.metaKey && e.key === '3') {
        e.preventDefault()
        onCycleViewMode()
      }
      // Cmd+4: Toggle presentation mode
      if (e.metaKey && e.key === '4') {
        e.preventDefault()
        onTogglePresentation()
      }
      // Cmd+F or Cmd+Shift+F: Open find dialog
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        onToggleFindReplace?.()
      }
      // Cmd+5: Toggle table of contents
      if ((e.metaKey || e.ctrlKey) && e.key === '5') {
        e.preventDefault()
        onToggleToc?.()
      }
      // Cmd+,: Open settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault()
        onOpenSettings?.()
      }
      // Cmd+Option+I: Toggle developer tools
      if ((e.metaKey || e.ctrlKey) && e.altKey && e.key === 'i') {
        e.preventDefault()
        onToggleDevTools?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onToggleFolderTree, onToggleFileList, onCycleViewMode, onTogglePresentation, onToggleFindReplace, onToggleToc, onOpenSettings, onToggleDevTools])
}

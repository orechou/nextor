interface PanelHeaderProps {
  title: string
  shortcutHint?: string
}

export function PanelHeader({ title, shortcutHint }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b text-xs font-medium uppercase tracking-wider text-muted-foreground select-none">
      <span>{title}</span>
      {shortcutHint && (
        <span className="opacity-60 text-[10px]">{shortcutHint}</span>
      )}
    </div>
  )
}

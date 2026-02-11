export enum MenuItemId {
  ABOUT = 'app.about',
  NEW = 'file.new',
  OPEN = 'file.open',
  SAVE = 'file.save',
  SAVE_AS = 'file.save_as',
  EXPORT = 'file.export',
  EXPORT_WECHAT = 'file.export.wechat',
  EXPORT_HTML = 'file.export.html',
  OPEN_FOLDER = 'file.open_folder',
  CLOSE_FOLDER = 'file.close_folder',
  VIEW_EDITOR = 'view.editor',
  VIEW_SPLIT = 'view.split',
  VIEW_PREVIEW = 'view.preview',
  VIEW_CYCLE_MODES = 'view.cycle_modes',
  TOGGLE_FILE_EXPLORER = 'view.toggle_file_explorer',
  TOGGLE_PREVIEW_PANEL = 'view.toggle_preview_panel',
  THEME_SYSTEM = 'theme.system',
  THEME_LIGHT = 'theme.light',
  THEME_DARK = 'theme.dark',
  LANG_EN = 'lang.en',
  LANG_ZH = 'lang.zh',
  PRESENTATION = 'view.presentation',
  FIND = 'edit.find',
  REPLACE = 'edit.replace',
  TOGGLE_TOC = 'view.toggle_toc',
  EXPORT_PDF = 'file.export.pdf',
}

export const MENU_ACCELERATORS: Record<MenuItemId, string> = {
  [MenuItemId.ABOUT]: '',
  [MenuItemId.NEW]: 'command+n',
  [MenuItemId.OPEN]: 'command+o',
  [MenuItemId.SAVE]: 'command+s',
  [MenuItemId.SAVE_AS]: 'command+shift+s',
  [MenuItemId.EXPORT]: 'command+e',
  [MenuItemId.EXPORT_WECHAT]: '',
  [MenuItemId.EXPORT_HTML]: 'command+shift+e',
  [MenuItemId.OPEN_FOLDER]: 'command+shift+o',
  [MenuItemId.CLOSE_FOLDER]: 'command+shift+w',
  // MiaoYan-style shortcuts: Cmd+1/2/3/4
  [MenuItemId.TOGGLE_FILE_EXPLORER]: 'command+1',      // Toggle folder tree
  [MenuItemId.TOGGLE_PREVIEW_PANEL]: 'command+2',      // Toggle file list
  [MenuItemId.VIEW_CYCLE_MODES]: 'command+3',          // Cycle view modes (edit → preview → split)
  [MenuItemId.VIEW_EDITOR]: '',                         // No direct shortcut
  [MenuItemId.VIEW_SPLIT]: '',                          // No direct shortcut
  [MenuItemId.VIEW_PREVIEW]: '',                        // No direct shortcut
  [MenuItemId.PRESENTATION]: 'command+4',               // Toggle presentation mode
  [MenuItemId.FIND]: 'command+f',                        // Find
  [MenuItemId.REPLACE]: 'command+shift+f',               // Find and Replace
  [MenuItemId.TOGGLE_TOC]: 'command+5',                  // Toggle table of contents
  [MenuItemId.EXPORT_PDF]: 'command+shift+p',             // Export to PDF
  [MenuItemId.THEME_SYSTEM]: 'command+shift+t',
  [MenuItemId.THEME_LIGHT]: 'command+shift+l',
  [MenuItemId.THEME_DARK]: 'command+shift+d',
  [MenuItemId.LANG_EN]: '',
  [MenuItemId.LANG_ZH]: '',
}


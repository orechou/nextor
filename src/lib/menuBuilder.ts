import { Menu, Submenu, MenuItem, PredefinedMenuItem } from '@tauri-apps/api/menu'
import { MenuItemId, MENU_ACCELERATORS } from './menuItems'

export interface MenuAction {
  id: MenuItemId
  handler: () => void
  enabled?: boolean
}

export interface BuildMenuOptions {
  t: (key: string) => string
  actions: MenuAction[]
  hasOpenFile: boolean
}

export async function buildNativeMenu(options: BuildMenuOptions): Promise<Menu> {
  const { t, actions, hasOpenFile } = options
  const actionMap = new Map(actions.map(a => [a.id, a]))

  const nextorMenu = await Submenu.new({
    id: 'nextor',
    text: 'Nextor',
    items: [
      await MenuItem.new({
        id: MenuItemId.ABOUT,
        text: t('menu.about'),
        action: actionMap.get(MenuItemId.ABOUT)?.handler,
      }),
      await MenuItem.new({ id: 'sep-about', text: '────────────' }),
      await PredefinedMenuItem.new({ item: 'Hide' }),
      await PredefinedMenuItem.new({ item: 'HideOthers' }),
      await PredefinedMenuItem.new({ item: 'ShowAll' }),
      await MenuItem.new({ id: 'sep-quit', text: '────────────' }),
      await PredefinedMenuItem.new({ item: 'Quit' }),
    ],
  })

  const fileMenu = await Submenu.new({
    id: 'file',
    text: t('menu.file'),
    items: [
      await MenuItem.new({
        id: MenuItemId.NEW,
        text: t('menu.new'),
        accelerator: MENU_ACCELERATORS[MenuItemId.NEW],
        action: actionMap.get(MenuItemId.NEW)?.handler,
      }),
      await MenuItem.new({
        id: MenuItemId.OPEN,
        text: t('menu.open'),
        accelerator: MENU_ACCELERATORS[MenuItemId.OPEN],
        action: actionMap.get(MenuItemId.OPEN)?.handler,
      }),
      await MenuItem.new({
        id: MenuItemId.OPEN_FOLDER,
        text: t('menu.openFolder'),
        accelerator: MENU_ACCELERATORS[MenuItemId.OPEN_FOLDER],
        action: actionMap.get(MenuItemId.OPEN_FOLDER)?.handler,
      }),
      await MenuItem.new({
        id: MenuItemId.CLOSE_FOLDER,
        text: t('menu.closeFolder'),
        accelerator: MENU_ACCELERATORS[MenuItemId.CLOSE_FOLDER],
        action: actionMap.get(MenuItemId.CLOSE_FOLDER)?.handler,
      }),
      await MenuItem.new({ id: 'sep1', text: '────────────' }),
      await MenuItem.new({
        id: MenuItemId.SAVE,
        text: t('menu.save'),
        accelerator: MENU_ACCELERATORS[MenuItemId.SAVE],
        action: actionMap.get(MenuItemId.SAVE)?.handler,
        enabled: hasOpenFile,
      }),
      await MenuItem.new({
        id: MenuItemId.SAVE_AS,
        text: t('menu.saveAs'),
        accelerator: MENU_ACCELERATORS[MenuItemId.SAVE_AS],
        action: actionMap.get(MenuItemId.SAVE_AS)?.handler,
      }),
    ],
  })

  const exportMenu = await Submenu.new({
    id: 'export',
    text: t('menu.export'),
    items: [
      await MenuItem.new({
        id: MenuItemId.EXPORT_WECHAT,
        text: t('menu.export_wechat'),
        action: actionMap.get(MenuItemId.EXPORT_WECHAT)?.handler,
      }),
      await MenuItem.new({
        id: MenuItemId.EXPORT_HTML,
        text: t('menu.export_html'),
        action: actionMap.get(MenuItemId.EXPORT_HTML)?.handler,
      }),
      await MenuItem.new({
        id: MenuItemId.EXPORT_PDF,
        text: 'PDF',
        accelerator: MENU_ACCELERATORS[MenuItemId.EXPORT_PDF],
        action: actionMap.get(MenuItemId.EXPORT_PDF)?.handler,
      }),
    ],
  })

  const editMenu = await Submenu.new({
    id: 'edit',
    text: t('menu.edit'),
    items: [
      await PredefinedMenuItem.new({ item: 'Undo' }),
      await PredefinedMenuItem.new({ item: 'Redo' }),
      await PredefinedMenuItem.new({ item: 'Separator' }),
      await PredefinedMenuItem.new({ item: 'Cut' }),
      await PredefinedMenuItem.new({ item: 'Copy' }),
      await PredefinedMenuItem.new({ item: 'Paste' }),
      await PredefinedMenuItem.new({ item: 'SelectAll' }),
      await MenuItem.new({ id: 'sep-edit-1', text: '────────────' }),
      await MenuItem.new({
        id: MenuItemId.FIND,
        text: 'Find',
        accelerator: MENU_ACCELERATORS[MenuItemId.FIND],
        action: actionMap.get(MenuItemId.FIND)?.handler,
      }),
      await MenuItem.new({
        id: MenuItemId.REPLACE,
        text: 'Find and Replace',
        accelerator: MENU_ACCELERATORS[MenuItemId.REPLACE],
        action: actionMap.get(MenuItemId.REPLACE)?.handler,
      }),
    ],
  })

  const viewMenu = await Submenu.new({
    id: 'view',
    text: t('menu.view'),
    items: [
      await MenuItem.new({
        id: MenuItemId.VIEW_CYCLE_MODES,
        text: t('menu.cycleViewModes') || 'Cycle View Mode',
        accelerator: MENU_ACCELERATORS[MenuItemId.VIEW_CYCLE_MODES],
        action: actionMap.get(MenuItemId.VIEW_CYCLE_MODES)?.handler,
      }),
      await MenuItem.new({ id: 'sep3', text: '────────────' }),
      await MenuItem.new({
        id: MenuItemId.VIEW_EDITOR,
        text: t('menu.viewEditor'),
        accelerator: MENU_ACCELERATORS[MenuItemId.VIEW_EDITOR],
        action: actionMap.get(MenuItemId.VIEW_EDITOR)?.handler,
      }),
      await MenuItem.new({
        id: MenuItemId.VIEW_SPLIT,
        text: t('menu.viewSplit'),
        accelerator: MENU_ACCELERATORS[MenuItemId.VIEW_SPLIT],
        action: actionMap.get(MenuItemId.VIEW_SPLIT)?.handler,
      }),
      await MenuItem.new({
        id: MenuItemId.VIEW_PREVIEW,
        text: t('menu.viewPreview'),
        accelerator: MENU_ACCELERATORS[MenuItemId.VIEW_PREVIEW],
        action: actionMap.get(MenuItemId.VIEW_PREVIEW)?.handler,
      }),
      await MenuItem.new({ id: 'sep3-2', text: '────────────' }),
      await MenuItem.new({
        id: MenuItemId.TOGGLE_FILE_EXPLORER,
        text: t('menu.toggleFileExplorer'),
        accelerator: MENU_ACCELERATORS[MenuItemId.TOGGLE_FILE_EXPLORER],
        action: actionMap.get(MenuItemId.TOGGLE_FILE_EXPLORER)?.handler,
      }),
      await MenuItem.new({
        id: MenuItemId.TOGGLE_PREVIEW_PANEL,
        text: t('menu.togglePreviewPanel'),
        accelerator: MENU_ACCELERATORS[MenuItemId.TOGGLE_PREVIEW_PANEL],
        action: actionMap.get(MenuItemId.TOGGLE_PREVIEW_PANEL)?.handler,
      }),
      await MenuItem.new({ id: 'sep4', text: '────────────' }),
      await Submenu.new({
        id: 'theme',
        text: t('menu.theme'),
        items: [
          await MenuItem.new({
            id: MenuItemId.THEME_SYSTEM,
            text: t('menu.themeSystem'),
            accelerator: MENU_ACCELERATORS[MenuItemId.THEME_SYSTEM],
            action: actionMap.get(MenuItemId.THEME_SYSTEM)?.handler,
          }),
          await MenuItem.new({
            id: MenuItemId.THEME_LIGHT,
            text: t('menu.themeLight'),
            accelerator: MENU_ACCELERATORS[MenuItemId.THEME_LIGHT],
            action: actionMap.get(MenuItemId.THEME_LIGHT)?.handler,
          }),
          await MenuItem.new({
            id: MenuItemId.THEME_DARK,
            text: t('menu.themeDark'),
            accelerator: MENU_ACCELERATORS[MenuItemId.THEME_DARK],
            action: actionMap.get(MenuItemId.THEME_DARK)?.handler,
          }),
        ],
      }),
      await Submenu.new({
        id: 'language',
        text: t('menu.language'),
        items: [
          await MenuItem.new({
            id: MenuItemId.LANG_EN,
            text: 'English',
            action: actionMap.get(MenuItemId.LANG_EN)?.handler,
          }),
          await MenuItem.new({
            id: MenuItemId.LANG_ZH,
            text: '中文',
            action: actionMap.get(MenuItemId.LANG_ZH)?.handler,
          }),
        ],
      }),
      await MenuItem.new({ id: 'sep5', text: '────────────' }),
      await MenuItem.new({
        id: MenuItemId.PRESENTATION,
        text: t('menu.presentation'),
        accelerator: MENU_ACCELERATORS[MenuItemId.PRESENTATION],
        action: actionMap.get(MenuItemId.PRESENTATION)?.handler,
      }),
      await MenuItem.new({ id: 'sep-view-2', text: '────────────' }),
      await MenuItem.new({
        id: MenuItemId.TOGGLE_TOC,
        text: 'Table of Contents',
        accelerator: MENU_ACCELERATORS[MenuItemId.TOGGLE_TOC],
        action: actionMap.get(MenuItemId.TOGGLE_TOC)?.handler,
      }),
    ],
  })

  const helpMenu = await Submenu.new({
    id: 'help',
    text: t('menu.help'),
    items: [
      await MenuItem.new({
        id: 'help.documentation',
        text: t('menu.documentation'),
        action: () => window.open('https://github.com/your-repo/nextor', '_blank'),
      }),
      await MenuItem.new({
        id: 'help.issue',
        text: t('menu.reportIssue'),
        action: () => window.open('https://github.com/your-repo/nextor/issues', '_blank'),
      }),
    ],
  })

  return await Menu.new({
    id: 'main',
    items: [nextorMenu, fileMenu, editMenu, viewMenu, exportMenu, helpMenu],
  })
}

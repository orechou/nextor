import { useState, useCallback, useEffect } from 'react'
import { message } from '@tauri-apps/plugin-dialog'
import { getVersion } from '@tauri-apps/api/app'
import { invoke } from '@tauri-apps/api/core'
import { DEFAULT_CONTENT } from './lib/constants'
import { Editor } from './components/Editor/Editor'
import { EmptyEditor } from './components/Editor/EmptyEditor'
import { PresentationMode } from './components/Presentation/PresentationMode'
import { WeChatExportDialog } from './components/Export/WeChatExportDialog'
import { SettingsDialog } from './components/SettingsDialog'
import { AppLayout } from './components/Layout/AppLayout'
import { Sidebar } from './components/Layout/Sidebar'
import { FolderBar } from './components/Layout/FolderBar'
import { ThemeToggleButton } from './components/Layout/ThemeToggleButton'
import { SidebarToggleButton } from './components/Layout/SidebarToggleButton'
import { PreviewToggleButton } from './components/Layout/PreviewToggleButton'
import { FileExplorer } from './components/FileExplorer/FileExplorer'
import { useTheme } from './hooks/useTheme'
import { useWindowTheme } from './hooks/useWindowTheme'
import { useFileOperations } from './hooks/useFileOperations'
import { useEditorState } from './hooks/useEditorState'
import { useFolderManager } from './hooks/useFolderManager'
import { useWeChatExport } from './hooks/useWeChatExport'
import { useEditorAppHandlers } from './hooks/useEditorAppHandlers'
import { useSessionPersistence } from './hooks/useSessionPersistence'
import { useTranslation } from 'react-i18next'
import { useAppMenu } from './hooks/useAppMenu'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import type { Theme } from './lib/constants'

export function App() {
  const { i18n } = useTranslation()
  const { setTheme, resolvedTheme } = useTheme()
  const { openDialog, isOpen: wechatExportOpen, closeDialog, handleExport: handleWeChatExport } = useWeChatExport()
  const { openedFolders, activeFolder: sessionActiveFolder, lastOpenedFile, saveSession, clearSession } = useSessionPersistence()
  const fileOps = useFileOperations()
  const editor = useEditorState(lastOpenedFile, undefined, { autoRestore: false })
  const { openedFolders: folders, activeFolder, setActiveFolder, handleOpenFolder, removeFolder, handleCloseFolder } = useFolderManager(openedFolders, sessionActiveFolder)

  useWindowTheme(resolvedTheme === 'dark' ? 'dark' : 'light')

  const [showPresentation, setShowPresentation] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)

  // Auto-save session when folders or file changes
  useEffect(() => {
    const folderPaths = folders.map(f => f.path)
    if (folderPaths.length > 0 || editor.currentFile) {
      saveSession(folderPaths, activeFolder, editor.currentFile)
    } else if (folderPaths.length === 0 && !editor.currentFile) {
      // Clear session when all folders and file are closed
      clearSession()
    }
  }, [folders, activeFolder, editor.currentFile, saveSession, clearSession])

  const handlers = useEditorAppHandlers({
    setCurrentFile: editor.setCurrentFile,
    setContent: editor.setContent,
    setSidebarOpen,
    handleOpenFile: fileOps.handleOpenFile,
    handleSaveFile: fileOps.handleSaveFile,
    handleSaveAs: fileOps.handleSaveAs,
    handleExport: fileOps.handleExport,
    handleOpenFolder,
    handleCloseFolder,
    handleWeChatExport,
    handleCreateFile: fileOps.handleCreateFile,
    handleDeleteFile: fileOps.handleDeleteFile,
    handleDeleteFolder: fileOps.handleDeleteFolder,
    activeFolder,
    content: editor.content,
    currentFile: editor.currentFile,
    handleExportPDF: async (content, title) => {
      const { useExport } = await import('./lib/export')
      const { exportToPDF } = useExport()
      await exportToPDF(content, title)
    },
  })

  const handleFolderCloseWithState = useCallback(
    (folderPath: string) => {
      // Check if current file is in the folder being closed
      if (editor.currentFile && editor.currentFile.startsWith(folderPath)) {
        editor.setContent(DEFAULT_CONTENT)
        editor.setCurrentFile('')
      }
      // Then remove the folder
      removeFolder(folderPath)
    },
    [editor, removeFolder]
  )

  const handleThemeChange = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme)
    },
    [setTheme]
  )

  const handleLanguageChange = useCallback(
    (lang: string) => {
      i18n.changeLanguage(lang)
    },
    [i18n]
  )

  const handlePresentation = useCallback(() => {
    setShowPresentation(true)
  }, [])

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const handleToggleTheme = useCallback(() => {
    const nextTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }, [resolvedTheme, setTheme])

  const handleTogglePreview = useCallback(() => {
    // Toggle preview: if showing preview (split or preview mode), switch to edit only
    // If edit only, switch to split mode to show preview
    const currentMode = editor.viewMode
    if (currentMode === 'edit') {
      editor.setViewMode('split')
    } else {
      editor.setViewMode('edit')
    }
  }, [editor])

  const handleToggleToc = useCallback(() => {
    setTocOpen(prev => !prev)
  }, [])

  const handleOpenSettings = useCallback(() => {
    setSettingsOpen(true)
  }, [])

  const handleExportPDF = useCallback(async () => {
    if (!editor.currentFile || !editor.content) return

    try {
      const fileName = editor.currentFile.split('/').pop()?.replace('.md', '') || 'Document'
      await handlers.handleExportPDF(editor.content, fileName)
    } catch (error) {
      console.error('Failed to export PDF:', error)
    }
  }, [editor.content, editor.currentFile])

  const handleToggleFindReplace = useCallback(() => {
    const api = (window as any).__nextorEditor
    api?.openFind?.()
  }, [])

  const handleAbout = useCallback(async () => {
    const version = await getVersion()
    const appName = 'Nextor'
    const description = i18n.t('app.description')
    await message(`${appName} v${version}\n\n${description}`, {
      title: i18n.t('menu.about'),
      kind: 'info',
    })
  }, [i18n])

  const handleToggleDevTools = useCallback(async () => {
    try {
      await invoke('toggle_devtools')
    } catch (error) {
      console.error('Failed to toggle dev tools:', error)
    }
  }, [])

  useAppMenu(
    {
      onAbout: handleAbout,
      onNew: editor.handleNew,
      onOpen: handlers.handleOpenFile,
      onSave: handlers.handleSaveFile,
      onSaveAs: handlers.handleSaveAs,
      onExport: handlers.handleExport,
      onWeChatExport: openDialog,
      onOpenFolder: handlers.handleOpenFolder,
      onCloseFolder: handlers.handleCloseFolder,
      onViewModeChange: editor.handleViewModeChange,
      onCycleViewMode: editor.cycleViewMode,
      onToggleLeftSidebar: handleToggleSidebar,
      onToggleRightSidebar: () => {},
      onThemeChange: handleThemeChange,
      onLanguageChange: handleLanguageChange,
      onPresentation: handlePresentation,
      onFind: () => handleToggleFindReplace(),
      onReplace: () => handleToggleFindReplace(),
      onToggleToc: handleToggleToc,
      onExportPDF: handleExportPDF,
    },
    { hasOpenFile: !!editor.currentFile }
  )

  useKeyboardShortcuts({
    onToggleFolderTree: handleToggleSidebar,
    onToggleFileList: () => {},
    onCycleViewMode: editor.cycleViewMode,
    onTogglePresentation: handlePresentation,
    onToggleFindReplace: handleToggleFindReplace,
    onToggleToc: handleToggleToc,
    onOpenSettings: handleOpenSettings,
    onToggleDevTools: handleToggleDevTools,
  })

  return (
    <div className="h-screen flex flex-col relative">
      <ThemeToggleButton
        resolvedTheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        onToggle={handleToggleTheme}
      />
      <PreviewToggleButton
        show={editor.viewMode !== 'edit'}
        onToggle={handleTogglePreview}
      />
      <SidebarToggleButton
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
      />

      <AppLayout
        folderBar={
          <FolderBar
            folders={folders}
            activeFolder={activeFolder}
            onFolderSelect={setActiveFolder}
            onFolderClose={handleFolderCloseWithState}
            onAddFolder={handleOpenFolder}
            isOpen={sidebarOpen}
          />
        }
        sidebar={
          <Sidebar isOpen={sidebarOpen}>
            <FileExplorer
              rootDirectory={activeFolder}
              selectedFile={editor.currentFile}
              onFileSelect={handlers.handleFileSelect}
              onOpenFolder={handlers.handleOpenFolder}
              onCreateFile={handlers.handleCreateFile}
              onDeleteFile={handlers.handleDeleteFile}
              onDeleteFolder={handlers.handleDeleteFolder}
            />
          </Sidebar>
        }
      >
        {editor.currentFile ? (
          <Editor
            content={editor.content}
            onChange={editor.setContent}
            viewMode={editor.viewMode}
            tocOpen={tocOpen}
          />
        ) : (
          <EmptyEditor
            onOpenFile={handlers.handleOpenFile}
            onOpenFolder={handlers.handleOpenFolder}
          />
        )}
      </AppLayout>

      {showPresentation && (
        <PresentationMode
          content={editor.content}
          onClose={() => setShowPresentation(false)}
        />
      )}

      <WeChatExportDialog
        open={wechatExportOpen}
        onClose={closeDialog}
        onExport={handlers.handleWeChatExport}
      />

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}

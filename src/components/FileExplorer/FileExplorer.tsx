import { FileTree } from './FileTree'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

interface FileExplorerProps {
  rootDirectory: string | undefined
  selectedFile: string
  onFileSelect: (path: string) => void
  onOpenFolder: () => void
  onCreateFile?: (fileName: string) => void
  onDeleteFile?: (filePath: string) => void
  onDeleteFolder?: (folderPath: string) => void
}

export function FileExplorer({
  rootDirectory,
  selectedFile,
  onFileSelect,
  onOpenFolder,
  onCreateFile,
  onDeleteFile,
  onDeleteFolder,
}: FileExplorerProps) {
  const { resolvedTheme } = useTheme()

  return (
    <div className={cn(
      "flex flex-col h-full relative",
      resolvedTheme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
    )}>
      <div className="flex-1 overflow-y-auto">
        {rootDirectory ? (
          <FileTree
            directory={rootDirectory}
            onFileSelect={onFileSelect}
            activeFilePath={selectedFile}
            onCreateFile={onCreateFile}
            onDeleteFile={onDeleteFile}
            onDeleteFolder={onDeleteFolder}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            {/* Neutral folder icon */}
            <div className="relative mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-16 h-16 text-gray-400 dark:text-gray-600"
              >
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-medium">No folder opened</p>
            <button
              onClick={onOpenFolder}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-full hover:scale-105 transition-all duration-200 text-sm font-medium"
            >
              Open Folder
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

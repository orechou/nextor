import { useState, useCallback } from 'react'
import { useExportFile } from '@/lib/query'
import { useExport, type WeChatExportOptions } from '@/lib/export'
import { logger } from '@/lib/logger'

/**
 * Copy HTML content to clipboard as rich text
 * This is required for WeChat Official Account editor to properly render styles
 */
async function copyRichText(html: string): Promise<void> {
  const blob = new Blob([html], { type: 'text/html' })
  const clipboardItem = new ClipboardItem({ 'text/html': blob })
  await navigator.clipboard.write([clipboardItem])
}

/**
 * WeChat export hook
 * Handles WeChat article export dialog and operations
 */
export function useWeChatExport() {
  const [isOpen, setIsOpen] = useState(false)
  const exportFileMutation = useExportFile()
  const { exportToWeChat } = useExport()

  const openDialog = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleExport = useCallback(async (
    method: 'file' | 'clipboard',
    options: WeChatExportOptions,
    content: string,
    currentFile: string
  ) => {
    try {
      const title = currentFile
        ? currentFile.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Untitled'
        : 'Untitled'

      const html = await exportToWeChat(content, title, options)

      if (method === 'clipboard') {
        // Copy as rich text HTML for WeChat editor
        await copyRichText(html)
        logger.info('Content copied to clipboard as rich text', { title, theme: options.theme })
      } else {
        await exportFileMutation.mutateAsync({
          content: html,
          format: 'html',
        })
        logger.info('WeChat export saved', { title, theme: options.theme })
      }

      closeDialog()
    } catch (error) {
      logger.error('Failed to export to WeChat', error, { method, theme: options.theme })
      throw error
    }
  }, [exportToWeChat, exportFileMutation, closeDialog])

  return {
    isOpen,
    openDialog,
    closeDialog,
    handleExport,
    isExporting: exportFileMutation.isPending,
  }
}

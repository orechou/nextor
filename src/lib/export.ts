import { useExportFile } from './query'
import { getWeChatTemplate } from './wechat/themeRegistry'
import type { WeChatExportOptions } from './wechat/types'
import { inlineCSS } from './wechat/inlineStyles'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import { exportMarkdownToPDF } from './pdfExport'

export type ExportFormat = 'html' | 'wechat' | 'pdf'

// Re-export WeChat types for convenience
export type { WeChatExportOptions } from './wechat/types'
export type { WeChatTheme } from './wechat/types'

async function convertMarkdownToHTML(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(markdown)

  return String(result)
}

export { convertMarkdownToHTML }

export async function exportToWeChat(
  markdown: string,
  title: string = 'Untitled',
  options: WeChatExportOptions = {}
): Promise<string> {
  const {
    theme = 'minimal',
    includeTitle = true,
    width = 677
  } = options

  const htmlContent = await convertMarkdownToHTML(markdown)

  const template = getWeChatTemplate(theme)

  const fullHtml = template.getWrapper(htmlContent, title, { theme, includeTitle, width })
  const css = template.getCSS({ theme, includeTitle, width })

  // Convert CSS to inline styles for WeChat
  const inlinedHtml = inlineCSS(fullHtml, css)

  return inlinedHtml
}

export function useExport() {
  const exportMutation = useExportFile()

  const exportToHTML = async (content: string, title: string = 'Document') => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
        }
        pre {
            background: #f4f4f4;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
        }
        code {
            background: #f4f4f4;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
        }
    </style>
</head>
<body>
${content}
</body>
</html>`

    return exportMutation.mutateAsync({
      content: htmlContent,
      format: 'html',
    })
  }

  const exportToPDF = async (content: string, title: string = 'Document') => {
    // Convert markdown to HTML first
    const htmlContent = await convertMarkdownToHTML(content)

    // Create a styled HTML wrapper
    const styledHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            max-width: 170mm;
            margin: 0 auto;
            padding: 20mm;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 600;
            page-break-after: avoid;
        }
        h1 { font-size: 2em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.25em; }
        h4 { font-size: 1em; }
        p { margin: 0.5em 0; }
        code {
            background: #f4f4f4;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
        }
        pre {
            background: #f4f4f4;
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
            page-break-inside: avoid;
        }
        pre code {
            background: none;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1em;
            margin-left: 0;
            color: #666;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
            page-break-inside: avoid;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 0.5em;
        }
        th {
            background: #f4f4f4;
            font-weight: 600;
        }
        a {
            color: #0066cc;
            text-decoration: underline;
        }
        .wiki-link {
            color: #0066cc;
        }
        img {
            max-width: 100%;
            height: auto;
        }
        .katex-display {
            overflow-x: auto;
            overflow-y: hidden;
        }
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`

    // Generate PDF
    const pdfBlob = await exportMarkdownToPDF(styledHtml)

    // Convert blob to base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(pdfBlob)
    })

    // Extract the base64 data (remove the data:application/pdf;base64, prefix)
    const base64Data = base64.split(',')[1]

    // Decode base64 to binary string
    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Use the export mutation to save the file
    const { save } = await import('@tauri-apps/plugin-dialog')

    const filePath = await save({
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
      defaultPath: `${title}.pdf`
    })

    if (filePath) {
      // Use writeBinaryFile from the fs module
      const fs = await import('@tauri-apps/plugin-fs')
      // Convert Uint8Array to a format that Tauri can handle
      // We'll use a workaround by writing as a data URL and letting Tauri handle it
      await (fs as any).writeFile(filePath, bytes)
      return filePath
    }

    throw new Error('No file path selected')
  }

  return {
    exportToHTML,
    exportToPDF,
    exportToWeChat,
    isExporting: exportMutation.isPending,
  }
}

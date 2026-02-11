import mermaid from 'mermaid'

export function initializeMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
  })
}

export async function renderMermaid(code: string): Promise<string> {
  try {
    const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), code)
    return svg
  } catch (error) {
    console.error('Mermaid rendering error:', error)
    return `<div class="error">Failed to render Mermaid diagram</div>`
  }
}

export function isMermaidBlock(text: string): boolean {
  return text.trim().startsWith('```mermaid')
}

export function extractMermaidCode(text: string): string | null {
  const match = text.match(/```mermaid\n([\s\S]*?)\n```/)
  return match ? match[1].trim() : null
}

export function formatMarkdown(content: string): string {
  return content
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    // Ensure consistent spacing around headers
    .replace(/^#{1,6}\s*/gm, (match) => match.trim() + ' ')
    // Ensure blank lines before headers
    .replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
    // Ensure blank lines before and after code blocks
    .replace(/([^\n])\n```/g, '$1\n\n```')
    .replace(/```\n([^\n])/g, '```\n\n$1')
    // Clean up multiple consecutive blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Ensure trailing newline
    .replace(/\n*$/, '\n')
}

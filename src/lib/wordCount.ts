/**
 * Word count statistics interface
 */
export interface WordCountStats {
  words: number
  characters: number
  charactersNoSpaces: number
  lines: number
  paragraphs: number
}

/**
 * Check if a character is Chinese (CJK)
 */
const isChinese = (char: string): boolean => {
  return /[\u4e00-\u9fa5]/.test(char)
}

/**
 * Count words in text, handling both English and Chinese
 * Chinese characters count as individual words
 * English words are separated by whitespace
 */
export function countWords(text: string): number {
  let count = 0
  let inWord = false

  for (const char of text) {
    if (isChinese(char)) {
      count++
    } else if (/\s/.test(char)) {
      inWord = false
    } else {
      if (!inWord) {
        count++
        inWord = true
      }
    }
  }
  return count
}

/**
 * Get comprehensive word count statistics
 */
export function getWordCountStats(text: string): WordCountStats {
  const lines = text.split('\n').length
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const words = countWords(text)

  return { words, characters, charactersNoSpaces, lines, paragraphs }
}

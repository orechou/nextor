import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

interface PresentationModeProps {
  content: string
  onClose: () => void
}

export function PresentationMode({ content, onClose }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Split content by horizontal rules for slides
  const slides = content.split(/^---$/gm).filter(s => s.trim())

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
    } else if (e.key === 'ArrowLeft') {
      setCurrentSlide((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [slides.length, onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Slide counter */}
      <div className="absolute top-4 right-4 text-sm text-white opacity-50">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Current slide */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="max-w-5xl max-h-full overflow-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            className="prose dark:prose-invert max-w-none text-4xl text-white"
          >
            {slides[currentSlide] || ''}
          </ReactMarkdown>
        </div>
      </div>

      {/* Navigation hint */}
      <div className="text-center p-4 text-sm text-white opacity-50">
        Press ESC to exit • Arrow keys to navigate
      </div>
    </div>
  )
}

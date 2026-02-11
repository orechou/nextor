import { Component, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error boundary component for catching file operation errors
 * Provides a fallback UI when file operations fail unexpectedly
 */
export class FileOperationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('File operation error caught by boundary', error, {
      componentStack: errorInfo.componentStack
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Operation Failed</h3>
            <p className="text-muted-foreground text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

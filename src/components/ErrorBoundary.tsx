import { Component, ReactNode } from 'react'
import { logger } from '@/lib/logger'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React Error Boundary caught error', error, {
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} retry={() => this.setState({ hasError: false })} />
    }

    return this.props.children
  }
}

/**
 * Default error fallback UI
 */
export function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 max-w-md">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Something went wrong
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          An unexpected error occurred. You can try reloading or contact support if the problem persists.
        </p>

        {/* Error Details (Collapsible in dev) */}
        {import.meta.env.DEV && error.message && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Error Details
            </summary>
            <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-left overflow-auto max-h-40">
              <p className="text-red-600 dark:text-red-400 font-bold mb-2">{error.name}</p>
              <p className="text-gray-700 dark:text-gray-300">{error.message}</p>
              {error.stack && (
                <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}

        <button
          onClick={retry}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
        >
          Try Again
        </button>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
          If this problem continues, please{' '}
          <a
            href="https://github.com/your-repo/nextor/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            report an issue
          </a>
        </p>
      </div>
    </div>
  )
}

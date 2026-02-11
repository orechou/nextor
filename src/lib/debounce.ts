/**
 * Debounce utility functions
 * Provides a generic debounce implementation for delaying function execution
 */

/**
 * Creates a debounced version of a function that delays invocation until
 * after `wait` milliseconds have elapsed since the last time the debounced
 * function was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the function
 *
 * @example
 * ```ts
 * const debouncedSave = debounce((data) => saveToStorage(data), 500)
 * debouncedSave({ foo: 'bar' }) // Will execute after 500ms unless called again
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Creates a debounced function that also provides a cancel method
 * to cancel any pending invocations.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced function with a cancel method
 *
 * @example
 * ```ts
 * const debouncedSave = debounceWithCancel((data) => saveToStorage(data), 500)
 * debouncedSave({ foo: 'bar' })
 * debouncedSave.cancel() // Cancel the pending invocation
 * ```
 */
export function debounceWithCancel<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null

  const debounced = function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}

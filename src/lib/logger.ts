export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, unknown>
  error?: Error
}

class Logger {
  private minLevel: LogLevel
  private logs: LogEntry[] = []
  private maxLogs = 500

  constructor() {
    this.minLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(LogLevel.DEBUG)) return
    const entry: LogEntry = { level: LogLevel.DEBUG, message, timestamp: new Date(), context }
    this.addLog(entry)
    if (import.meta.env.DEV) console.debug(`[DEBUG] ${message}`, context)
  }

  info(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(LogLevel.INFO)) return
    const entry: LogEntry = { level: LogLevel.INFO, message, timestamp: new Date(), context }
    this.addLog(entry)
    if (import.meta.env.DEV) console.info(`[INFO] ${message}`, context)
  }

  warn(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(LogLevel.WARN)) return
    const entry: LogEntry = { level: LogLevel.WARN, message, timestamp: new Date(), context }
    this.addLog(entry)
    console.warn(`[WARN] ${message}`, context)
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level: LogLevel.ERROR,
      message,
      timestamp: new Date(),
      context,
      error: error instanceof Error ? error : new Error(String(error))
    }
    this.addLog(entry)
    console.error(`[ERROR] ${message}`, error, context)
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = new Logger()

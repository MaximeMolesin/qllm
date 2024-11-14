// logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private level: LogLevel = 'info';

  setLevel(level: LogLevel) {
    this.level = level;
  }

  private isNode(): boolean {
    return typeof process !== 'undefined' && 
           process.versions != null && 
           process.versions.node != null;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (this.isNode()) {
      console[level](message, ...args);
    } else {
      // Fallback pour les environnements non-Node
      console.log(`[${level.toUpperCase()}] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.level === 'debug') {
      this.log('debug', message, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (['debug', 'info'].includes(this.level)) {
      this.log('info', message, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (['debug', 'info', 'warn'].includes(this.level)) {
      this.log('warn', message, ...args);
    }
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }
}

export const logger = new Logger();

export default logger;

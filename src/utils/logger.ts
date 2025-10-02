import type { Logger, LoggerConfig } from "../types/index.js";

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

export const createLogger = (config: LoggerConfig): Logger => {
  const currentLevel = LOG_LEVELS[config.logLevel];

  const shouldLog = (level: keyof typeof LOG_LEVELS): boolean => {
    return LOG_LEVELS[level] >= currentLevel;
  };

  return {
    debug: (message: string, context?: Record<string, unknown>) => {
      if (shouldLog("debug")) {
        console.log(`[DEBUG] ${message}`, context || {});
      }
    },
    info: (message: string, context?: Record<string, unknown>) => {
      if (shouldLog("info")) {
        console.log(`[INFO] ${message}`, context || {});
      }
    },
    warn: (message: string, context?: Record<string, unknown>) => {
      if (shouldLog("warn")) {
        console.warn(`[WARN] ${message}`, context || {});
      }
    },
    error: (message: string, error?: Error, context?: Record<string, unknown>) => {
      if (shouldLog("error")) {
        console.error(`[ERROR] ${message}`, { error, ...context });
      }
    },
  };
};

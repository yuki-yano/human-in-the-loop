/**
 * Logger関連の型定義
 */

export type Logger = {
  debug: (message: string, context?: Record<string, unknown>) => void;
  info: (message: string, context?: Record<string, unknown>) => void;
  warn: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string, error?: Error, context?: Record<string, unknown>) => void;
};

export type LoggerConfig = {
  logLevel: "debug" | "info" | "warn" | "error";
};

export type ErrorContext = {
  component: string;
  operation: string;
  additionalInfo?: Record<string, unknown>;
};

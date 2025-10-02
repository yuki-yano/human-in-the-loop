/**
 * Tagged Union型によるエラー定義
 */

export type ThreadCreationError =
  | { kind: "CHANNEL_NOT_FOUND"; message: string }
  | { kind: "PERMISSION_DENIED"; message: string }
  | { kind: "API_ERROR"; message: string };

export type ResponseError = { kind: "TIMEOUT"; message: string } | { kind: "COLLECTOR_ERROR"; message: string };

export type DiscordBotError =
  | { kind: "INVALID_TOKEN"; message: string }
  | { kind: "CONNECTION_FAILED"; message: string }
  | { kind: "MISSING_PERMISSIONS"; message: string };

export type ConfigError =
  | { kind: "MISSING_REQUIRED"; field: string; message: string }
  | { kind: "INVALID_FORMAT"; field: string; message: string };

/**
 * エラーを投げるヘルパー関数
 */
export const throwThreadCreationError = (error: ThreadCreationError): never => {
  throw Object.assign(new Error(error.message), { name: "ThreadCreationError", ...error });
};

export const throwResponseError = (error: ResponseError): never => {
  throw Object.assign(new Error(error.message), { name: "ResponseError", ...error });
};

export const throwDiscordBotError = (error: DiscordBotError): never => {
  throw Object.assign(new Error(error.message), { name: "DiscordBotError", ...error });
};

export const throwConfigError = (error: ConfigError): never => {
  throw Object.assign(new Error(error.message), { name: "ConfigError", ...error });
};

/**
 * 型ガード関数
 */
export const isThreadCreationError = (error: unknown): error is Error & ThreadCreationError => {
  return error instanceof Error && error.name === "ThreadCreationError" && "kind" in error;
};

export const isResponseError = (error: unknown): error is Error & ResponseError => {
  return error instanceof Error && error.name === "ResponseError" && "kind" in error;
};

export const isDiscordBotError = (error: unknown): error is Error & DiscordBotError => {
  return error instanceof Error && error.name === "DiscordBotError" && "kind" in error;
};

export const isConfigError = (error: unknown): error is Error & ConfigError => {
  return error instanceof Error && error.name === "ConfigError" && "kind" in error;
};

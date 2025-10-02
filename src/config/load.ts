import type { AppConfig } from "../types/index.js";
import { throwConfigError } from "../types/index.js";

const isValidSnowflakeId = (value: string): boolean => {
  return /^\d+$/.test(value);
};

const isValidLogLevel = (value: string): value is AppConfig["logLevel"] => {
  return ["debug", "info", "warn", "error"].includes(value);
};

export const loadConfiguration = (env: NodeJS.ProcessEnv): AppConfig => {
  // 必須環境変数のチェック
  const discordBotToken = env.DISCORD_TOKEN;
  if (!discordBotToken) {
    throwConfigError({
      kind: "MISSING_REQUIRED",
      field: "DISCORD_TOKEN",
      message: "DISCORD_TOKEN is required",
    });
  }

  const discordChannelId = env.DISCORD_CHANNEL_ID;
  if (!discordChannelId) {
    throwConfigError({
      kind: "MISSING_REQUIRED",
      field: "DISCORD_CHANNEL_ID",
      message: "DISCORD_CHANNEL_ID is required",
    });
  }

  const discordUserId = env.DISCORD_USER_ID;
  if (!discordUserId) {
    throwConfigError({
      kind: "MISSING_REQUIRED",
      field: "DISCORD_USER_ID",
      message: "DISCORD_USER_ID is required",
    });
  }

  // Snowflake ID形式の検証
  if (discordChannelId && !isValidSnowflakeId(discordChannelId)) {
    throwConfigError({
      kind: "INVALID_FORMAT",
      field: "DISCORD_CHANNEL_ID",
      message: "DISCORD_CHANNEL_ID must be a valid Snowflake ID (numeric)",
    });
  }

  if (discordUserId && !isValidSnowflakeId(discordUserId)) {
    throwConfigError({
      kind: "INVALID_FORMAT",
      field: "DISCORD_USER_ID",
      message: "DISCORD_USER_ID must be a valid Snowflake ID (numeric)",
    });
  }

  // オプション環境変数の読み込み
  const logLevelStr = env.LOG_LEVEL || "info";
  const logLevel = isValidLogLevel(logLevelStr) ? logLevelStr : "info";

  const responseTimeoutStr = env.RESPONSE_TIMEOUT || "300000";
  const responseTimeout = Number.parseInt(responseTimeoutStr, 10);

  if (Number.isNaN(responseTimeout) || responseTimeout < 0) {
    throwConfigError({
      kind: "INVALID_FORMAT",
      field: "RESPONSE_TIMEOUT",
      message: "RESPONSE_TIMEOUT must be a positive integer",
    });
  }

  return {
    discordBotToken: discordBotToken as string,
    discordChannelId: discordChannelId as string,
    discordUserId: discordUserId as string,
    serverName: "human-in-the-loop",
    serverVersion: "0.1.0",
    logLevel,
    responseTimeout,
  };
};

/**
 * Application configuration type
 */

export type AppConfig = {
  discordBotToken: string;
  discordChannelId: string;
  discordUserId: string;
  serverName: string;
  serverVersion: string;
  logLevel: "debug" | "info" | "warn" | "error";
  responseTimeout: number; // ms
};

export type DiscordBotConfig = {
  token: string;
  channelId: string;
  targetUserId: string;
};

export type ServerConfig = {
  name: string;
  version: string;
};

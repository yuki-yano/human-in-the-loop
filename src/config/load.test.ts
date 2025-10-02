import { describe, expect, it } from "vitest";
import { isConfigError } from "../types/index.js";
import { loadConfiguration } from "./load.js";

describe("loadConfiguration", () => {
  it("should load valid configuration from environment variables", () => {
    const env: NodeJS.ProcessEnv = {
      DISCORD_TOKEN: "test-token",
      DISCORD_CHANNEL_ID: "123456789",
      DISCORD_USER_ID: "987654321",
    };

    const config = loadConfiguration(env);

    expect(config).toEqual({
      discordBotToken: "test-token",
      discordChannelId: "123456789",
      discordUserId: "987654321",
      serverName: "human-in-the-loop",
      serverVersion: "0.1.0",
      logLevel: "info",
      responseTimeout: 300000,
    });
  });

  it("should use custom values when provided", () => {
    const env: NodeJS.ProcessEnv = {
      DISCORD_TOKEN: "test-token",
      DISCORD_CHANNEL_ID: "123456789",
      DISCORD_USER_ID: "987654321",
      LOG_LEVEL: "debug",
      RESPONSE_TIMEOUT: "60000",
    };

    const config = loadConfiguration(env);

    expect(config.logLevel).toBe("debug");
    expect(config.responseTimeout).toBe(60000);
  });

  it("should throw ConfigError when DISCORD_TOKEN is missing", () => {
    const env: NodeJS.ProcessEnv = {
      DISCORD_CHANNEL_ID: "123456789",
      DISCORD_USER_ID: "987654321",
    };

    expect(() => loadConfiguration(env)).toThrow();

    try {
      loadConfiguration(env);
    } catch (error) {
      expect(isConfigError(error)).toBe(true);
      if (isConfigError(error)) {
        expect(error.kind).toBe("MISSING_REQUIRED");
        expect(error.field).toBe("DISCORD_TOKEN");
      }
    }
  });

  it("should throw ConfigError when DISCORD_CHANNEL_ID is invalid format", () => {
    const env: NodeJS.ProcessEnv = {
      DISCORD_TOKEN: "test-token",
      DISCORD_CHANNEL_ID: "invalid",
      DISCORD_USER_ID: "987654321",
    };

    expect(() => loadConfiguration(env)).toThrow();

    try {
      loadConfiguration(env);
    } catch (error) {
      expect(isConfigError(error)).toBe(true);
      if (isConfigError(error)) {
        expect(error.kind).toBe("INVALID_FORMAT");
        expect(error.field).toBe("DISCORD_CHANNEL_ID");
      }
    }
  });

  it("should throw ConfigError when RESPONSE_TIMEOUT is negative", () => {
    const env: NodeJS.ProcessEnv = {
      DISCORD_TOKEN: "test-token",
      DISCORD_CHANNEL_ID: "123456789",
      DISCORD_USER_ID: "987654321",
      RESPONSE_TIMEOUT: "-100",
    };

    expect(() => loadConfiguration(env)).toThrow();

    try {
      loadConfiguration(env);
    } catch (error) {
      expect(isConfigError(error)).toBe(true);
      if (isConfigError(error)) {
        expect(error.kind).toBe("INVALID_FORMAT");
        expect(error.field).toBe("RESPONSE_TIMEOUT");
      }
    }
  });
});

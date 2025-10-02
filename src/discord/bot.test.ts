import type { Client } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { isDiscordBotError } from "../types/index.js";
import { createDiscordBot } from "./bot.js";

describe("createDiscordBot", () => {
  it("should create Discord bot instance", async () => {
    const mockClient = {
      login: vi.fn().mockResolvedValue("token"),
      on: vi.fn(),
      destroy: vi.fn().mockResolvedValue(undefined),
    } as unknown as Client;

    const config = {
      token: "test-token",
      channelId: "123456789",
      targetUserId: "987654321",
    };

    const bot = await createDiscordBot(config, mockClient);

    expect(bot).toBeDefined();
    expect(bot.createThreadForQuestion).toBeDefined();
    expect(bot.disconnect).toBeDefined();
    expect(mockClient.login).toHaveBeenCalledWith("test-token");
  });

  it("should throw DiscordBotError when login fails", async () => {
    const mockClient = {
      login: vi.fn().mockRejectedValue(new Error("Invalid token")),
      on: vi.fn(),
    } as unknown as Client;

    const config = {
      token: "invalid-token",
      channelId: "123456789",
      targetUserId: "987654321",
    };

    await expect(createDiscordBot(config, mockClient)).rejects.toThrow();

    try {
      await createDiscordBot(config, mockClient);
    } catch (error) {
      expect(isDiscordBotError(error)).toBe(true);
      if (isDiscordBotError(error)) {
        expect(error.kind).toBe("INVALID_TOKEN");
      }
    }
  });

  it("should disconnect when disconnect is called", async () => {
    const mockClient = {
      login: vi.fn().mockResolvedValue("token"),
      on: vi.fn(),
      destroy: vi.fn().mockResolvedValue(undefined),
    } as unknown as Client;

    const config = {
      token: "test-token",
      channelId: "123456789",
      targetUserId: "987654321",
    };

    const bot = await createDiscordBot(config, mockClient);
    await bot.disconnect();

    expect(mockClient.destroy).toHaveBeenCalled();
  });
});

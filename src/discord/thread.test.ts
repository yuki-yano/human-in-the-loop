import type { Client, TextChannel } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { isThreadCreationError } from "../types/index.js";
import { createThreadForQuestion } from "./thread.js";

describe("createThreadForQuestion", () => {
  it("should create thread and post message", async () => {
    const mockThread = {
      id: "thread-123",
      send: vi.fn().mockResolvedValue({}),
      createMessageCollector: vi.fn(),
    };

    const mockChannel = {
      isTextBased: () => true,
      isDMBased: () => false,
      threads: {
        create: vi.fn().mockResolvedValue(mockThread),
      },
    } as unknown as TextChannel;

    const mockClient = {
      channels: {
        fetch: vi.fn().mockResolvedValue(mockChannel),
      },
    } as unknown as Client;

    const deps = {
      client: mockClient,
      channelId: "123456789",
      userId: "987654321",
    };

    const threadCreator = createThreadForQuestion(deps);
    const threadInstance = await threadCreator("What is the project name?");

    expect(threadInstance.threadId).toBe("thread-123");
    expect(mockChannel.threads.create).toHaveBeenCalledWith({
      name: "What is the project name?",
      autoArchiveDuration: 1440, // 1 day in minutes
    });
    expect(mockThread.send).toHaveBeenCalledWith("<@987654321> What is the project name?");
  });

  it("should truncate long question titles", async () => {
    const longQuestion = "A".repeat(150);
    const expectedTitle = "A".repeat(100);

    const mockThread = {
      id: "thread-123",
      send: vi.fn().mockResolvedValue({}),
      createMessageCollector: vi.fn(),
    };

    const mockChannel = {
      isTextBased: () => true,
      isDMBased: () => false,
      threads: {
        create: vi.fn().mockResolvedValue(mockThread),
      },
    } as unknown as TextChannel;

    const mockClient = {
      channels: {
        fetch: vi.fn().mockResolvedValue(mockChannel),
      },
    } as unknown as Client;

    const deps = {
      client: mockClient,
      channelId: "123456789",
      userId: "987654321",
    };

    const threadCreator = createThreadForQuestion(deps);
    await threadCreator(longQuestion);

    expect(mockChannel.threads.create).toHaveBeenCalledWith({
      name: expectedTitle,
      autoArchiveDuration: 1440,
    });
  });

  it("should throw ThreadCreationError when channel not found", async () => {
    const mockClient = {
      channels: {
        fetch: vi.fn().mockResolvedValue(null),
      },
    } as unknown as Client;

    const deps = {
      client: mockClient,
      channelId: "invalid-channel",
      userId: "987654321",
    };

    const threadCreator = createThreadForQuestion(deps);

    await expect(threadCreator("Question?")).rejects.toThrow();

    try {
      await threadCreator("Question?");
    } catch (error) {
      expect(isThreadCreationError(error)).toBe(true);
      if (isThreadCreationError(error)) {
        expect(error.kind).toBe("CHANNEL_NOT_FOUND");
      }
    }
  });
});

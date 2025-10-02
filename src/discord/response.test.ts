import type { Message, MessageCollector, ThreadChannel } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { isResponseError } from "../types/index.js";
import { awaitUserResponse } from "./response.js";

describe("awaitUserResponse", () => {
  it("should resolve with user response", async () => {
    const mockMessage = {
      content: "My answer",
      author: { id: "987654321" },
    } as Message;

    const mockCollector = {
      on: vi.fn((event, handler) => {
        if (event === "collect") {
          // Simulate message collection
          setTimeout(() => handler(mockMessage), 10);
        }
      }),
      stop: vi.fn(),
    } as unknown as MessageCollector;

    const mockThread = {
      id: "thread-123",
      createMessageCollector: vi.fn().mockReturnValue(mockCollector),
      send: vi.fn(),
    } as unknown as ThreadChannel;

    const deps = {
      thread: mockThread,
      userId: "987654321",
    };

    const responseAwaiter = awaitUserResponse(deps);
    const answer = await responseAwaiter(60000);

    expect(answer).toBe("My answer");
    expect(mockThread.createMessageCollector).toHaveBeenCalled();
  });

  it("should reject with timeout error when timeout occurs", async () => {
    const mockCollector = {
      on: vi.fn((event, handler) => {
        if (event === "end") {
          // Immediately trigger timeout
          handler(null, "time");
        }
      }),
      stop: vi.fn(),
    } as unknown as MessageCollector;

    const mockThread = {
      id: "thread-123",
      createMessageCollector: vi.fn().mockReturnValue(mockCollector),
      send: vi.fn().mockResolvedValue({}),
    } as unknown as ThreadChannel;

    const deps = {
      thread: mockThread,
      userId: "987654321",
    };

    const responseAwaiter = awaitUserResponse(deps);

    await expect(responseAwaiter(100)).rejects.toThrow();

    try {
      await responseAwaiter(100);
    } catch (error) {
      expect(isResponseError(error)).toBe(true);
      if (isResponseError(error)) {
        expect(error.kind).toBe("TIMEOUT");
      }
    }
  });

  it("should filter messages by user ID", async () => {
    const wrongUserMessage = {
      content: "Wrong user",
      author: { id: "111111111" },
    } as Message;

    const correctUserMessage = {
      content: "Correct user",
      author: { id: "987654321" },
    } as Message;

    const mockCollector = {
      on: vi.fn((event, handler) => {
        if (event === "collect") {
          setTimeout(() => {
            // First message from wrong user (should be filtered)
            const filter = mockThread.createMessageCollector.mock.calls[0][0].filter;
            if (!filter(wrongUserMessage)) {
              // Second message from correct user
              handler(correctUserMessage);
            }
          }, 10);
        }
      }),
      stop: vi.fn(),
    } as unknown as MessageCollector;

    const mockThread = {
      id: "thread-123",
      createMessageCollector: vi.fn().mockReturnValue(mockCollector),
      send: vi.fn(),
    } as unknown as ThreadChannel;

    const deps = {
      thread: mockThread,
      userId: "987654321",
    };

    const responseAwaiter = awaitUserResponse(deps);
    const answer = await responseAwaiter(60000);

    expect(answer).toBe("Correct user");
  });
});

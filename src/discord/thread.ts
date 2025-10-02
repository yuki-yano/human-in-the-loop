import type { Client, TextChannel } from "discord.js";
import type { ThreadInstance } from "../types/index.js";
import { throwThreadCreationError } from "../types/index.js";
import { awaitUserResponse } from "./response.js";

type CreateThreadDeps = {
  client: Client;
  channelId: string;
  userId: string;
};

const prepareThreadTitle = (question: string): string => {
  return question.slice(0, 100);
};

export const createThreadForQuestion =
  (deps: CreateThreadDeps) =>
  async (question: string): Promise<ThreadInstance> => {
    const { client, channelId, userId } = deps;

    // Fetch channel
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      return throwThreadCreationError({
        kind: "CHANNEL_NOT_FOUND",
        message: `Channel with ID ${channelId} not found`,
      });
    }

    if (!channel.isTextBased() || channel.isDMBased()) {
      return throwThreadCreationError({
        kind: "PERMISSION_DENIED",
        message: "Channel must be a guild text channel",
      });
    }

    const textChannel = channel as TextChannel;

    try {
      // Create thread
      const thread = await textChannel.threads.create({
        name: prepareThreadTitle(question),
        autoArchiveDuration: 1440, // 1 day
      });

      // Send message
      await thread.send(`<@${userId}> ${question}`);

      // Create response awaiter
      const responseAwaiter = awaitUserResponse({
        thread,
        userId,
      });

      return {
        threadId: thread.id,
        awaitResponse: responseAwaiter,
      };
    } catch (error) {
      return throwThreadCreationError({
        kind: "API_ERROR",
        message: `Failed to create thread: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  };

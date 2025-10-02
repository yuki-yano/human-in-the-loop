import { Client, GatewayIntentBits } from "discord.js";
import type { DiscordBotConfig, DiscordBotInstance } from "../types/index.js";
import { throwDiscordBotError } from "../types/index.js";
import { createThreadForQuestion } from "./thread.js";

export const createDiscordBot = async (config: DiscordBotConfig, client?: Client): Promise<DiscordBotInstance> => {
  const discordClient =
    client ||
    new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });

  try {
    await discordClient.login(config.token);
  } catch (error) {
    throwDiscordBotError({
      kind: "INVALID_TOKEN",
      message: `Failed to login to Discord: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  const threadCreator = createThreadForQuestion({
    client: discordClient,
    channelId: config.channelId,
    userId: config.targetUserId,
  });

  return {
    createThreadForQuestion: threadCreator,
    disconnect: async () => {
      await discordClient.destroy();
    },
  };
};

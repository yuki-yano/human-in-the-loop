import { loadConfiguration } from "./config/load.js";
import { createDiscordBot } from "./discord/bot.js";
import { createMCPServer } from "./mcp/server.js";
import { createLogger } from "./utils/logger.js";

const main = async () => {
  let logger = createLogger({ logLevel: "info" });

  try {
    // Load configuration
    const config = loadConfiguration(process.env);
    logger = createLogger({ logLevel: config.logLevel });
    logger.info("Configuration loaded successfully");

    // Create Discord bot
    const discordBot = await createDiscordBot({
      token: config.discordBotToken,
      channelId: config.discordChannelId,
      targetUserId: config.discordUserId,
    });
    logger.info("Discord bot connected");

    // Create MCP server
    const mcpServer = createMCPServer(
      {
        name: config.serverName,
        version: config.serverVersion,
      },
      discordBot,
      { responseTimeout: config.responseTimeout },
    );

    // Handle shutdown
    const shutdown = async () => {
      logger.info("Shutting down...");
      await mcpServer.stop();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    // Start MCP server
    await mcpServer.start();
  } catch (error) {
    logger.error("Failed to start server", error instanceof Error ? error : undefined);
    process.exit(1);
  }
};

main();

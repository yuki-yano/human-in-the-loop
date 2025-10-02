import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  type CallToolRequest,
  CallToolRequestSchema,
  type ListToolsRequest,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type { DiscordBotInstance } from "../types/index.js";

type ServerConfig = {
  name: string;
  version: string;
};

type MCPServerOptions = {
  responseTimeout?: number;
};

export const createMCPServer = (config: ServerConfig, discordBot: DiscordBotInstance, options?: MCPServerOptions) => {
  const responseTimeout = options?.responseTimeout ?? 300000;

  const server = new Server(
    {
      name: config.name,
      version: config.version,
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // ask_human tool
  server.setRequestHandler(ListToolsRequestSchema, async (_request: ListToolsRequest) => {
    return {
      tools: [
        {
          name: "ask_human",
          description:
            "Ask a human for information via Discord. The human will be notified in Discord and their response will be returned.",
          inputSchema: {
            type: "object" as const,
            properties: {
              question: {
                type: "string" as const,
                description: "The question to ask the human",
              },
            },
            required: ["question"],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    if (request.params.name === "ask_human") {
      const questionSchema = z.object({
        question: z.string(),
      });

      const input = questionSchema.parse(request.params.arguments);

      try {
        const threadInstance = await discordBot.createThreadForQuestion(input.question);
        const answer = await threadInstance.awaitResponse(responseTimeout);

        return {
          content: [
            {
              type: "text" as const,
              text: answer,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
  });

  return {
    start: async () => {
      const transport = new StdioServerTransport();
      await server.connect(transport);
      console.error("[INFO] MCP Server started");
    },
    stop: async () => {
      await server.close();
      await discordBot.disconnect();
      console.error("[INFO] MCP Server stopped");
    },
  };
};

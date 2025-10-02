import type { z } from "zod";

/**
 * MCP-related type definitions
 */

export type ToolDefinition<TInput, TOutput> = {
  name: string;
  title: string;
  description: string;
  inputSchema: z.ZodSchema<TInput>;
  handler: (input: TInput) => Promise<TOutput>;
};

export type MCPServerInstance = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  registerTool: <TInput, TOutput>(definition: ToolDefinition<TInput, TOutput>) => void;
};

export type MCPServerDeps = {
  config: {
    name: string;
    version: string;
  };
  tools: ToolRegistry;
};

export type ToolRegistry = Map<string, ToolDefinition<unknown, unknown>>;

export type AskHumanInput = {
  question: string;
};

export type AskHumanOutput = {
  answer: string;
};

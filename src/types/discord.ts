/**
 * Discord-related type definitions
 */

export type DiscordBotInstance = {
  createThreadForQuestion: (question: string) => Promise<ThreadInstance>;
  disconnect: () => Promise<void>;
};

export type ThreadInstance = {
  threadId: string;
  awaitResponse: (timeout: number) => Promise<string>;
};

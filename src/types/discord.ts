/**
 * Discord関連の型定義
 */

export type DiscordBotInstance = {
  createThreadForQuestion: (question: string) => Promise<ThreadInstance>;
  disconnect: () => Promise<void>;
};

export type ThreadInstance = {
  threadId: string;
  awaitResponse: (timeout: number) => Promise<string>;
};

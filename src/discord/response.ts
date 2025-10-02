import type { Message, ThreadChannel } from "discord.js";

type AwaitResponseDeps = {
  thread: ThreadChannel;
  userId: string;
};

export const awaitUserResponse =
  (deps: AwaitResponseDeps) =>
  (timeout: number): Promise<string> => {
    const { thread, userId } = deps;

    return new Promise((resolve, reject) => {
      const collector = thread.createMessageCollector({
        filter: (message: Message) => message.author.id === userId && message.channel.id === thread.id,
        time: timeout,
        max: 1,
      });

      collector.on("collect", (message: Message) => {
        resolve(message.content);
        collector.stop();
      });

      collector.on("end", async (_collected, reason) => {
        if (reason === "time") {
          try {
            await thread.send("⏱️ Response timeout. No answer was received.");
          } catch {
            // Ignore send errors
          }
          const error = new Error(`No response received within ${timeout}ms`);
          Object.assign(error, { name: "ResponseError", kind: "TIMEOUT" });
          reject(error);
        }
      });
    });
  };

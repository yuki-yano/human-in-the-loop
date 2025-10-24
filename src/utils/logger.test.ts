import { describe, expect, it, vi } from "vitest";
import { createLogger } from "./logger.js";

describe("createLogger", () => {
  it("should create logger with debug level", () => {
    const logger = createLogger({ logLevel: "debug" });
    expect(logger).toBeDefined();
    expect(logger.debug).toBeDefined();
    expect(logger.info).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.error).toBeDefined();
  });

  it("should log debug message when level is debug", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logger = createLogger({ logLevel: "debug" });

    logger.debug("test message", { key: "value" });

    expect(consoleSpy).toHaveBeenCalledWith("[DEBUG] test message", { key: "value" });

    consoleSpy.mockRestore();
  });

  it("should not log debug message when level is info", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logger = createLogger({ logLevel: "info" });

    logger.debug("test message");

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should log error message to stderr", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logger = createLogger({ logLevel: "error" });

    const testError = new Error("test error");
    logger.error("error occurred", testError);

    expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR] error occurred", { error: testError });

    consoleErrorSpy.mockRestore();
  });
});

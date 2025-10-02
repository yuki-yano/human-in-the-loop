# Human-in-the-Loop MCP Server

A Model Context Protocol (MCP) server that enables AI assistants to ask humans for information via Discord.

## Features

- **Discord Integration**: Questions are sent to Discord threads with user mentions
- **MCP Protocol Compliant**: Works with any MCP-compatible AI assistant
- **Type-Safe**: Built with TypeScript in strict mode
- **Functional Programming**: Pure functions and explicit error handling
- **Well Tested**: Comprehensive unit and integration tests using Vitest

## Installation

```bash
# Using bunx (recommended)
bunx @yuki-yano/human-in-the-loop

# Or install globally
bun add -g @yuki-yano/human-in-the-loop
```

## Configuration

Set the following environment variables:

```bash
# Required
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_ID=your_channel_id
DISCORD_USER_ID=your_user_id

# Optional
LOG_LEVEL=info  # debug, info, warn, error (default: info)
RESPONSE_TIMEOUT=300000  # milliseconds (default: 300000 = 5 minutes)
```

## Usage

### Start the MCP Server

```bash
bunx @yuki-yano/human-in-the-loop
```

### Discord Bot Setup

1. Create a Discord bot at https://discord.com/developers/applications
2. Enable the following intents:
   - Guilds
   - Guild Messages
   - Message Content
3. Add the bot to your server with the following permissions:
   - Create Public Threads
   - Send Messages in Threads
   - Read Message History

### MCP Client Configuration

#### Claude Code CLI

Add the MCP server using the `claude mcp add` command:

```bash
claude mcp add hitl bunx @yuki-yano/human-in-the-loop@latest \
  --env DISCORD_TOKEN=your_discord_bot_token \
  --env DISCORD_CHANNEL_ID=your_channel_id \
  --env DISCORD_USER_ID=your_user_id
```

#### Manual Configuration

Add to your MCP client configuration file:

```json
{
  "mcpServers": {
    "human-in-the-loop": {
      "command": "bunx",
      "args": ["@yuki-yano/human-in-the-loop"],
      "env": {
        "DISCORD_TOKEN": "your_token",
        "DISCORD_CHANNEL_ID": "your_channel_id",
        "DISCORD_USER_ID": "your_user_id"
      }
    }
  }
}
```

## How It Works

1. AI assistant calls the `ask_human` tool with a question
2. MCP server creates a Discord thread in the configured channel
3. User receives a mention in the thread
4. User responds in the thread
5. MCP server returns the response to the AI assistant

## Development

### Setup

```bash
bun install
```

### Commands

```bash
# Run tests
bun run test

# Run tests with coverage
bun run test:coverage

# Type check
bun run typecheck

# Lint
bun run lint

# Format
bun run format

# Build
bun run build
```

### Architecture

- **Functional Programming**: All logic implemented as pure functions
- **Dependency Injection**: Using currying pattern
- **Error Handling**: Tagged Union types for explicit error classification
- **Type Safety**: Strict TypeScript with no implicit any

## Acknowledgments

This project is inspired by and based on [KOBA789/human-in-the-loop](https://github.com/KOBA789/human-in-the-loop), a Rust implementation of the Human-in-the-Loop MCP server.

## License

MIT

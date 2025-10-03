# Human-in-the-Loop MCP Server

A Model Context Protocol (MCP) server that enables AI assistants to ask humans for information via Discord.

## Features

- **AI-to-Human Communication**: Enables AI assistants to ask humans for information, decisions, or clarifications in real-time
- **Discord Thread Integration**: Creates dedicated Discord threads for each question with automatic user mentions
- **Configurable Timeouts**: Set custom response timeout periods (default: 5 minutes)
- **MCP Protocol Support**: Compatible with any MCP-enabled AI assistant (Claude Code, Cline, etc.)
- **Conversation History**: All interactions are preserved in Discord threads for future reference

## Installation

```bash
# Using bunx (recommended)
bunx @yuki-yano/human-in-the-loop@latest

# Or using npx
npx @yuki-yano/human-in-the-loop@latest

# Or install globally with your preferred package manager
bun add -g @yuki-yano/human-in-the-loop@latest
# or
npm install -g @yuki-yano/human-in-the-loop@latest
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
# Using bunx (recommended)
bunx @yuki-yano/human-in-the-loop@latest

# Or using npx
npx @yuki-yano/human-in-the-loop@latest
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
# Using bunx (recommended)
claude mcp add hitl bunx @yuki-yano/human-in-the-loop@latest \
  --env DISCORD_TOKEN=your_discord_bot_token \
  --env DISCORD_CHANNEL_ID=your_channel_id \
  --env DISCORD_USER_ID=your_user_id

# Or using npx
claude mcp add hitl npx @yuki-yano/human-in-the-loop@latest \
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
      "args": ["@yuki-yano/human-in-the-loop@latest"],
      "env": {
        "DISCORD_TOKEN": "your_token",
        "DISCORD_CHANNEL_ID": "your_channel_id",
        "DISCORD_USER_ID": "your_user_id"
      }
    }
  }
}
```

Note: You can also use `"command": "npx"` if you prefer npm.

## How It Works

1. **AI Initiates**: AI assistant calls the `ask_human` tool with a question
2. **Thread Creation**: MCP server automatically creates a dedicated Discord thread in the configured channel
3. **User Notification**: Specified user receives a mention notification in the thread with the question
4. **Human Response**: User reads the question and responds in the Discord thread
5. **Response Delivery**: MCP server captures the response and returns it to the AI assistant
6. **Timeout Handling**: If no response is received within the timeout period (default: 5 minutes), an error is returned to the AI

All conversations are preserved in Discord threads, making it easy to review past interactions and maintain context.

## Development

### Setup

```bash
# Using Bun (recommended for development)
bun install

# Or using npm
npm install
```

### Commands

```bash
# Run tests
npm test              # or: bun test

# Run tests with coverage
npm run test:coverage # or: bun run test:coverage

# Type check
npm run typecheck     # or: bun run typecheck

# Lint
npm run lint          # or: bun run lint

# Format
npm run format        # or: bun run format

# Build
npm run build         # or: bun run build
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

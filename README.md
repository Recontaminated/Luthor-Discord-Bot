# Luthor Discord Bot

[![Discord Bot CD](https://github.com/TomAndJerry342/Discord/actions/workflows/buildAndDeploy.yml/badge.svg)](https://github.com/TomAndJerry342/Discord/actions/workflows/buildAndDeploy.yml)
[![Node Version](https://img.shields.io/badge/node-16.x-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/discord.js-v14-7289da.svg)](https://discord.js.org)

A feature-rich Discord bot built with TypeScript and Discord.js v14, designed to enhance server functionality with modular commands, event handling, and database integration.

## Features

- **Modular Command System** - Easily extensible slash command architecture
- **MongoDB Integration** - Persistent data storage for guild settings, reminders, and user data
- **Event Management** - Robust event handling system for Discord interactions
- **Web Panel** - Express-based web interface for bot management
- **Minecraft Integration** - Username to UUID conversion utilities
- **Reminder System** - Set and manage timed reminders
- **Guild Management** - Per-server configuration and settings

## Prerequisites

- Node.js 16.x or higher
- MongoDB instance (local or cloud)
- Discord Bot Token
- TypeScript 5.9+

## Installation

1. Clone the repository:
```bash
git clone https://github.com/TomAndJerry342/Discord.git
cd Luthor-Discord-Bot
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Create a `.env` file in the root directory:
```env
DISCORD_TOKEN=your_bot_token_here
MONGODB_URI=your_mongodb_connection_string
CLIENT_ID=your_bot_client_id
GUILD_ID=your_development_guild_id
```

4. Build the project:
```bash
yarn build
# or
npm run build
```

## Usage

### Development
```bash
yarn dev
# or
npm run dev
```

### Production
```bash
yarn start
# or
npm start
```

### Available Scripts

- `yarn start` - Run the compiled bot
- `yarn dev` - Build and run the bot
- `yarn build` - Compile TypeScript to JavaScript
- `yarn watch` - Watch for file changes and recompile
- `yarn lint` - Run ESLint for code quality
- `yarn host` - Install dependencies and run in production

## Project Structure

```
Luthor-Discord-Bot/
├── src/
│   ├── bot/
│   │   ├── commands/       # Slash commands
│   │   ├── events/          # Discord event handlers
│   │   └── moduleLoader.ts  # Dynamic module loading
│   ├── panel/               # Web interface
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
│       ├── discord/         # Discord-specific utilities
│       └── mongo/           # Database schemas and manager
├── dist/                    # Compiled JavaScript output
├── .env                     # Environment variables
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## Command Development

Create new commands by adding TypeScript files to `src/bot/commands/slash/`:

```typescript
import { SlashCommand } from '@/types/command';

export const command: SlashCommand = {
    data: {
        name: 'example',
        description: 'An example command'
    },
    async execute(interaction) {
        await interaction.reply('Hello World!');
    }
};
```

## Database Schemas

The bot uses MongoDB with Mongoose for data persistence:

- **Guild Schema** - Server-specific settings and configurations
- **Reminder Schema** - User reminders with timestamps
- **Player Schema** - Player data for game integrations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Follow TypeScript best practices
- Use ESLint for code consistency
- Write descriptive commit messages
- Add appropriate error handling
- Document new features and commands

## Technologies

- **Runtime**: Node.js 16.x
- **Language**: TypeScript 5.9
- **Framework**: Discord.js v14
- **Database**: MongoDB with Mongoose
- **Web Server**: Express
- **Linting**: ESLint with TypeScript parser
- **Formatting**: Prettier

## Author

Created and maintained by Jeremy

## Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/TomAndJerry342/Discord/issues).

## Acknowledgments

- Discord.js community for excellent documentation
- Contributors and maintainers
- All users and testers

---

Built with ❤️ for Discord communities
import { description } from './commands/help';
import * as Discord from 'discord.js';
import { readdir } from 'fs/promises';
import Logger from '../utils/logger.js';
import client from '../index.js';
export default async function commandAdder(pathAdditions = '') {
  const commandFiles = await readdir('./dist/bot/commands' + pathAdditions);

  for (const file of commandFiles) {

    if (file.startsWith('_') || (file.includes('.') && !file.endsWith('.js')))
      continue;

    if (!file.endsWith('.js')) {
      await commandAdder(pathAdditions + '/' + file);
      continue;
    }

    const command = await import(`./commands${pathAdditions}/${file}`);
    let commandName = file.split('.')[0];

    client.commands.set(commandName, command.default);
    Logger.info(`Loaded command: ${commandName}`);

    if (command.description?.aliases === undefined)
      continue;

    for (let i in command.description.aliases) {
      client.commands.set(command.description.aliases[i], command.default);
    }
  }
}

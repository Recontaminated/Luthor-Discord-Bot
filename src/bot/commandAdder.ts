import * as Discord from 'discord.js';
import { readdir } from 'fs/promises';
import Logger from '../utils/logger.js';
import client from '../index.js';
import path from 'node:path';
import * as fs from "fs"

async function addTextCommands(pathAdditions = ''): Promise<void> {
  Logger.info("Adding text commands")
  const textCommandFiles = await readdir('./dist/bot/commands/text' + pathAdditions);

  for (const file of textCommandFiles) {

    if (file.startsWith('_') || (file.includes('.') && !file.endsWith('.js')))
      continue;

    if (!file.endsWith('.js')) {
      await addTextCommands(pathAdditions + '/' + file);
      continue;
    }

    const command = await import(`./commands/text${pathAdditions}/${file}`);
    let commandName = command.description.name

    client.commands.text.set(commandName, command.default);
    Logger.info(`Loaded command: ${commandName}`);

    if (command.description?.aliases === undefined)
      continue;

    for (let i in command.description.aliases) {
      client.commands.set(command.description.aliases[i], command.default);
    }
  }

}
async function addSlashCommands(pathAdditions = ''): Promise<void> {

  Logger.info("Adding slash commands")
  const slashCommandFiles = await readdir('./dist/bot/commands/slash' + pathAdditions);

  for (const file of slashCommandFiles) {

    if (file.startsWith('_') || (file.includes('.') && !file.endsWith('.js')))
      continue;

    if (!file.endsWith('.js')) {
      await addSlashCommands(pathAdditions + '/' + file);
      continue;
    }

    const command = await import(`./commands/slash${pathAdditions}/${file}`);


    client.commands.slash.set(command.default.data.name, command);
    Logger.info(`Loaded command: ${command.default.data.name}`);
}
}

export default async function commandAdder() {
  await addTextCommands();
  await addSlashCommands();


  }
  
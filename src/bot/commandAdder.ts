import * as Discord from 'discord.js';
import { readdir } from 'fs/promises';

export default async function commandAdder(commandCollection: Discord.Collection<any, any>, pathAdditions: string = '') {
  const commandFiles = await readdir('./dist/commands' + pathAdditions);

  for (const file of commandFiles) {

    if (file.startsWith('_') || (file.includes('.') && !file.endsWith('.js')))
      continue;

    if (!file.endsWith('.js')) {
      await commandAdder(commandCollection, pathAdditions + '/' + file);
      continue;
    }

    const command = await import(`./commands${pathAdditions}/${file}`);
    let commandName = file.split('.')[0];

    commandCollection.set(commandName, command.default);
    console.log(`Loaded command: ${commandName}`);
    if (command.description.aliases === undefined)
      continue;

    for (let i in command.description.aliases) {
      commandCollection.set(command.description.aliases[i], command.default);
    }
  }
}

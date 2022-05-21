import * as Discord from 'discord.js';
import { readdir } from 'fs/promises';

export default async function eventHandler(client: Discord.Client, pathAdditions: string = '') {
  const eventFiles = await readdir('./dist/events' + pathAdditions);

  for (const file of eventFiles) {

    if (file.startsWith('_') || (file.includes('.') && !file.endsWith('.js')))
      continue;

    if (!file.endsWith('.js'))
      await eventHandler(client, pathAdditions + '/' + file);

    const event = await import(`./events${pathAdditions}/${file}`);

    let eventName = file.split('.')[0];
    if (event.settings.once)
      client.once(eventName, (...args: string[]) => event.default(...args));
    else
      client.on(eventName, (...args: string[]) => event.default(...args));
  }
}
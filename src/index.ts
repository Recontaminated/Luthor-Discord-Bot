import * as Discord from 'discord.js';
import config from './utils/readConfig.js';
import commandAdder from './bot/commandAdder.js';
import eventHandler from './bot/eventHandler.js';

const intents = new Discord.Intents();
intents.add(Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES);

const client = new Discord.Client({intents: intents});
const clientCollections = {
  commands: new Discord.Collection(),
};

export { clientCollections as default };

commandAdder(clientCollections.commands);
eventHandler(client);

client.login(config.token);
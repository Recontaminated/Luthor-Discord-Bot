import * as Discord from 'discord.js';
import config from './utils/readConfig.js';
import commandAdder from './bot/commandAdder.js';
import eventHandler from './bot/eventHandler.js';

// all intents fuck the pricintpal of least permisisons
const intents = new Discord.Intents(32767)

const client = new Discord.Client({intents: intents});
const clientCollections = {
  commands: new Discord.Collection(),
};

export { clientCollections as default };

commandAdder(clientCollections.commands);
eventHandler(client);

client.login(config.token);
import * as Discord from 'discord.js';
import config from './utils/readConfig.js';
import commandAdder from './bot/commandAdder.js';
import eventHandler from './bot/eventHandler.js';
import shutdown from './utils/shutdown.js';
import Logger from './utils/logger.js';
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
process.on('SIGINT', async function() {
  Logger.warn("Caught interrupt signal, itinating graceful shutdown");

  try{
    await shutdown();
    await client.destroy()
    process.exit();
  }
  catch(err:any){
    Logger.error(err);
  }




    



     
}
);
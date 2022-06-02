import * as Discord from 'discord.js';
import config from './utils/readConfig.js';
import commandAdder from './bot/commandAdder.js';
import eventHandler from './bot/eventHandler.js';
import shutdown from './utils/shutdown.js';
import Logger from './utils/logger.js';

declare module 'discord.js' {
  interface Client<Ready extends boolean = boolean> {
      commands: any

  }
}


// all intents fuck the pricintpal of least permisisons
const intents = new Discord.Intents(32767)

const client = new Discord.Client({intents: intents});
client.commands = new Discord.Collection();


export { client as default };

commandAdder();
eventHandler(client);

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	}
});

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
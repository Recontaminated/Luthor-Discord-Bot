import clientCollections from '../../index.js';
import * as Discord from 'discord.js';
import config from '../../utils/readConfig.js';
import client from '../../index.js'
export default async function (message: Discord.Message) {
  commandHandler(message);
}

function commandHandler(message: Discord.Message) {
  if (!message.content.startsWith(config.prefix))
    return;

  const messageArray = message.content.split(' ');

  let commandName = messageArray[0].toLowerCase();
  commandName = commandName.slice(config.prefix.length);
  const args = messageArray.slice(1);

  const command = clientCollections.commands.text.get(commandName);

  if (!command || typeof command !== 'function')
    return;

  command(message, args);
}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.slash.get(interaction.commandName);
	if (!command) return;

	try {
		await command.default.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
export const settings = {
  once: false,
  event: "messageCreate"
};
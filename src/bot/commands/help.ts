import * as Discord from 'discord.js';
import { readdirSync } from 'fs';
import { DescriptionTypes } from './_example.js';
import config from '../../utils/readConfig.js';

export default async function (message: Discord.Message, args: string[]) {
  await message.delete();
  const helpEmbed = new Discord.MessageEmbed;
  helpEmbed
    .setTitle(`${config.botName || message?.client?.user?.username || 'Bot'} Help`)
    .setDescription(`<> = Required Argument\n[] = Optional Argument\n${config.prefix} = Prefix`)
    .setColor('#00ff22');

  let commandFields: { [index: string]: any[] } = {
    0: [],
  };
  let totalCommands = 0;

  async function fileLoop(pathAdditions: string = '') {
    const files = readdirSync('./dist/commands' + pathAdditions);

    for (const file of files) {
      if (file.startsWith('_') || (file.includes('.') && !file.endsWith('.js')))
        continue;

      if (!file.endsWith('.js')) {
        await fileLoop(pathAdditions + '/' + file);
        continue;
      }

      let importedFile;
      if (pathAdditions === '')
        importedFile = await import('./' + file);
      else
        importedFile = await import('.' + pathAdditions + '/' + file);

      let fileDescription: DescriptionTypes = importedFile.description;

      if (!fileDescription)
        continue;

      let commandInfo = {
        name: `${config.prefix}${fileDescription.name} ${fileDescription.usage}`,
        value: `${fileDescription.description}`,
        inline: false,
      };
      if (fileDescription.aliases)
        commandInfo.value += `\nAliases: ${fileDescription.aliases.join(', ')}`;

      totalCommands++;

      if (commandFields[Math.floor(totalCommands / 25)] === undefined)
        commandFields[Math.floor(totalCommands / 25)] = [];

      commandFields[Math.floor(totalCommands / 25)].push(commandInfo);
    }
  }

  await fileLoop();

  let embedsArray = [];

  if (totalCommands <= 25) {
    embedsArray.push(helpEmbed);
    for (const field of commandFields[0])
      helpEmbed.addField(field.name, field.value, field.inline);
  } else {
    for (let i = 0; i <= Math.floor(totalCommands / 3); i++) {
      let copy = helpEmbed;
      copy.title += ` (Page ${i})`;
      for (const field of commandFields[i])
        copy.addField(field.name, field.value, field.inline);
      embedsArray.push(copy);
    }
  }

  return message.channel.send({
    embeds: embedsArray,
  });
}

export const description = {
  name: 'help',
  description: 'Shows help message.',
  usage: '',
};
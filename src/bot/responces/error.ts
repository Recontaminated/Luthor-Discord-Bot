import { Message, MessageEmbed } from 'discord.js';


export default function errorBuilder(error: string, commandName: string, message: Message) {
  const embed = new MessageEmbed()
    .setTitle(`Error with command \`${commandName}\``)
    .setColor('#ff0000')
    .setDescription(error)

  return {embeds: [embed]};
}
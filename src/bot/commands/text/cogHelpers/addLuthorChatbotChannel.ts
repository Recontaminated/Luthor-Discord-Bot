import * as Discord from 'discord.js';
import { Guild } from '../../../../utils/mongo/schemas/guild.js';
import client from "../../../../index.js"
import errorBuilder from '../../../responces/error.js';
export default async function (message: Discord.Message, args: string[]) {
    if (args.length < 1) return await message.channel.send(errorBuilder("Please provide a channelID!", "addLuthorChatbotChannel"));
    if (args.length > 1) return await message.channel.send(errorBuilder("Please provide only one arguement!", "addLuthorChatbotChannel"));

    const chatChannelId = args[0];
    const guild = await Guild.findOneAndUpdate({ guildId: message.guild?.id },{features:{luthorChatChannelId:chatChannelId}},{upsert:true} )

    client.cache.cog.luthorChatBot[message.guild.id] = chatChannelId;
    return await message.channel.send("Successfully added chatbot channel!");
}
export const description: DescriptionTypes = {
  name: 'chatbotchannel',
  description: 'set the channel for luthor to listen to',
  usage: '<ChannelID>',
};

export interface DescriptionTypes {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
}
import * as Discord from 'discord.js';

export default async function (message: Discord.Message, args: string[]) {
  return;
}

export const description: DescriptionTypes = {
  name: 'register',
  description: 'register ur username with bot',
  usage: '<Required Argument> [Optional Argument]',
};

export interface DescriptionTypes {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
}
import { EmbedBuilder, SelectMenuComponentOptionData } from 'discord.js';


export const categoryInfo: { [index: string]: CategoryInfo } = {
  config: {
    description: 'Allows you to configure elements of the bot like the prefix in the current guild',
    label: 'Config',
    value: 'config',
    embed: new EmbedBuilder(),
  },
  info: {
    description: 'Contain information about the bot, like performance, invite, etc...',
    label: 'Info',
    value: 'info',
    embed: new EmbedBuilder(),
  },

  games: {
    description: 'Fun little games that make the day less boring',
    label: 'Games',
    value: 'games',
    embed: new EmbedBuilder(),
  },
  externalApis: {
    description: 'Commands that use services from External APIs',
    label: 'External APIs',
    value: 'externalApis',
    embed: new EmbedBuilder(),
  },
  misc: {
    description: 'Random useful commands that didn\'t fit well in any other category',
    label: 'Misc',
    value: 'misc',
    embed: new EmbedBuilder(),
  },
};

export interface CategoryInfo extends SelectMenuComponentOptionData {
  embed: EmbedBuilder;
}

// make a list of types from CategoryInfo's value field
export type Category = keyof typeof categoryInfo;
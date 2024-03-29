import * as Discord from "discord.js";
import getUserFromMention from "../../../utils/discord/getUserFromMention.js";
import sleep from "../../../utils/sleep.js";

import { Command } from "../command.js";
import client from "../../../index.js";
import { Message } from "discord.js";
import LuthorClient from "../../../types/luthorClient.js";

export default class TextGame implements Command {
  aliases = [""];
  category = "fun";
  cooldown = 0;
  cooldowns: Set<any>;
  description = "that game michael told me about";
  name = "TextGame";
  usage = "<player 1> <player 2> ...";
  public async run(message: Message, args: string[]) {
    if (message.mentions.users.first() === undefined) {
      return;
    }

    for (let i = 0; i < args.length; i++) {
      const userInQuestion = getUserFromMention(message.client, args[i]);
      if (message.author.id == userInQuestion?.id) {
        await message.reply("you cant play a game with yourself in it idot");

        return;
      }
      if (userInQuestion?.bot) {
        await message.reply("bots arent smart enough to play games");
        return;
      }
    }

    const list_of_players: any = [];
    list_of_players.push(message.author);
    for (let i = 0; i < args.length; i++) {
      list_of_players.push(getUserFromMention(message.client, args[i]));
    }

    let message_to_send = "";
    for (let i = 0; i < list_of_players.length; i++) {
      message_to_send += list_of_players[i].toString();
    }

    // const row = new Discord.MessageActionRow()
    // .addComponents(
    //   new Discord.MessageButton()
    //     .setCustomId('primary')
    //     .setLabel('Start')
    //     .setStyle('PRIMARY'),
    // );

    const send = await message.channel.send({
      content: `${message_to_send}, you are now playing a game of what the is that word. React to this message to begin`,
    });

    await send.react("👍");
    const filter = (reaction: Discord.MessageReaction, user: Discord.User) => {
      for (let i = 0; i < list_of_players.length; i++) {
        if (user.id === undefined || user.id === null) {
          return false;
        }
        if (user.id === list_of_players[i].id) {
          return true;
        }
      }

      return false;
    };
    const readyPlayers: Discord.Collection<any, any> = new Discord.Collection();

    const collector = send.createReactionCollector({
      filter,
      max: list_of_players.length,
      time: 15000,
    });
    collector.on("collect", async (reaction, user) => {
      readyPlayers.set(user.id, user);
      await send.edit(
        `${message_to_send}, you are now playing a game of what the fuck is that word. React to this message to begin (${readyPlayers.size}/${list_of_players.length})`
      );
    });

    // collector.on('end', collected => {
    //   if (collected.size < list_of_players.length) {
    //     send.channel.send("Not enough players reacted, game cancelled");
    //     return
    //   }
    //   send.edit("Game started");

    // });

    try {
      const reactions = await send.awaitReactions({
        filter,
        max: list_of_players.length,
        time: 15000,
        errors: ["time", "max"],
      });

      //something here
    } catch (e) {
      send.channel.send("Not enough players reacted, game cancelled");
      return;
    }

    const messageFilter = (message: Discord.Message) => {
      for (let i = 0; i < list_of_players.length; i++) {
        if (message.author.id === undefined || message.author.id === null) {
          return false;
        }
        if (message.author.id === list_of_players[i].id) {
          return true;
        }
      }

      return false;
    };
    while (true) {
      const countdown = await message.channel.send(
        "Please select a random word from your imagination and type it in the chat in 5 seconds.."
      );
      await sleep(1500);
      await countdown.edit("4");
      await sleep(1500);
      await countdown.edit("3");
      await sleep(1500);
      await countdown.edit("2");
      await sleep(1500);
      await countdown.edit("1");
      await sleep(1500);
      await countdown.edit(`${message_to_send} GO!`);
      try {
        const answers = await message.channel.awaitMessages({
          filter: messageFilter,
          max: list_of_players.length,
          time: 2000,
          errors: ["time"],
        });
        if (!answers) {
          continue;
        }
        //TODO: make it so that check list if empty instead of just putting ! for safety
        if (
          answers.every(
            (message) =>
              message.content.toLowerCase() ==
              answers.first()!.content.toLowerCase()
          )
        ) {
          await message.channel.send(
            `congrats lol. the word was ${answers.first()!.content}`
          );
          break;
        }
      } catch (e) {
        await message.channel.send("No one answered in time, next round");
      }
    }
    // // @ts-ignore TODO: fix all the ts-ignores
    // const collector = await send.createReactionCollector({ filter, max:list_of_players.length, time: 2000 });

    // collector.on('collect', (reaction, user) => {
    //   readyPlayers.push(user)
    //   send.edit(`${message_to_send}, you are now playing a game of what the fuck is that word. React to this message to begin (${readyPlayers.length}/${list_of_players.length})`);
    //   console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
    // });

    // collector.on('end', collected => {
    //   if (collected.size < list_of_players.length) {
    //     send.channel.send("Not enough players reacted, game cancelled");
    //     return
    //   }
    //   send.edit("Game started");

    // });
  }
}

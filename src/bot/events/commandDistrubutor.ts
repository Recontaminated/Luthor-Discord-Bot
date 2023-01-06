import * as Discord from "discord.js";
import client from "../../index.js";
import { InteractionType } from "discord.js";
import Logger from "../../utils/logger.js";
import prettyMilliseconds from "pretty-ms";

export default async function (message: Discord.Message) {
  commandHandler(message);
}

async function commandHandler(message: Discord.Message) {
  let prefix;

  if (!message.guildId) {
    prefix = client.config.prefix;
  } else {
    prefix = client.prefix[message.guildId] || client.config.prefix;
  }
  // if the command starts with mentioning the bot
  if (message.content.startsWith(`<@${client.user.id}> `)) {
    prefix = `<@${client.user.id}> `;
  }
  if (!message.content.startsWith(prefix)) {
    return;
  }

  const commandMessage = message.content.slice(prefix.length);
  const messageArray = commandMessage.split(" ");
  const commandName = messageArray[0].toLowerCase();

  const args = messageArray.slice(1);
  let command = client.commands.text.get(commandName);
  if (!command) {
    return;
  }
  const commandFn = command.run;
  if (!commandFn || typeof commandFn !== "function") {
    return;
  }
  //check the cooldowns
  Logger.debug(command);
  if (command.cooldowns.has(message.author.id)) {
    return message.reply(
      "You are on cooldown for this command! Please wait " +
        prettyMilliseconds(command.cooldown) +
        " between each use"
    );
  }
  const timeStart = new Date().getTime();
  await commandFn(message, args);
  const timeEnd = new Date().getTime();
  Logger.info(
    `user ${message.author.username} ran the command ${commandName} in ${
      timeEnd - timeStart
    } ms`
  );
  command.cooldowns.add(message.author.id);
  setTimeout(() => {
    command.cooldowns.delete(message.author.id);
  }, command.cooldown);
}
client.on("interactionCreate", async (interaction) => {
  if (interaction.type !== InteractionType.ApplicationCommand) {
    return;
  }
  const command = client.commands.slash.get(interaction.commandName);
  if (!command) {
    return;
  }

  try {
    const timeStart = new Date().getTime();
    await command.default.execute(interaction);
    const timeEnd = new Date().getTime();
    Logger.info(
      `user ${interaction.user.username} ran the command ${
        interaction.commandName
      } in ${timeEnd - timeStart} ms`
    );
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});
export const settings = {
  once: false,
  event: "messageCreate",
};

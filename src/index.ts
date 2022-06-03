import * as Discord from "discord.js";
import config from "./utils/readConfig.js";
import commandAdder from "./bot/commandAdder.js";
import eventHandler from "./bot/eventHandler.js";
import shutdown from "./utils/shutdown.js";
import Logger from "./utils/logger.js";
import registerCommands from "./utils/registerCommands.js";
import DBClient from "./utils/mongoManager.js";

declare module "discord.js" {
  interface Client<Ready extends boolean = boolean> {
    commands: any;
  }
}

// all intents fuck the pricintpal of least permisisons
const intents = new Discord.Intents(32767);

const client = new Discord.Client({ intents: intents });
client.commands = new Discord.Collection();

const database = DBClient.db("Dev");

export { client as default };
//TODO: await theese by wrapping  all in a anyno function so it isnt top level
let loadCommands = async () => {
  await eventHandler(client);
  await commandAdder();
};
loadCommands();
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    Logger.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(config.token);
process.on("SIGINT", async function () {
  Logger.warn("Caught interrupt signal, itinating graceful shutdown");

  try {
    await client.destroy();
    await shutdown(() => {
      process.exit(1)
    });

  } catch (err: any) {
    Logger.error(err);
  }
});

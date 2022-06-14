import * as Discord from "discord.js";
import config from "./utils/readConfig.js";
import commandAdder from "./bot/commandAdder.js";
import eventHandler from "./bot/eventHandler.js";
import shutdown from "./utils/shutdown.js";
import Logger from "./utils/logger.js";
import { initMongo } from "./utils/mongo/mongoManager.js";
import deployCommands from "./utils/deployCommands.js";
import { Guild } from "./utils/mongo/schemas/guild.js";
declare module "discord.js" {
  interface Client<Ready extends boolean = boolean> {
    commands: any;
    prefix: any;
  }
}

// all intents f*** the pricintpal of least permisisons
const intents = new Discord.Intents(32767);

const client = new Discord.Client({ intents: intents });
client.commands = {}

client.commands.text = new Discord.Collection();
client.commands.slash = new Discord.Collection();
client.prefix = {}

export { client as default };


async function loadPrefixes(){
  Logger.info("Loading prefixes...");
  let guildsWithCustomPrefix = await Guild.find({ prefix: { $exists: true } });
  for (let index = 0; index < guildsWithCustomPrefix.length; index++) {
    const guild = guildsWithCustomPrefix[index];
    client.prefix[guild.guildId] = guild.prefix
  }
  Logger.debug(client.prefix)
}
let sycFunctions = async () => {
  Logger.info("Sync init functions");
  await eventHandler(client);
  await commandAdder();
  await deployCommands()
  await initMongo();
  await loadPrefixes();
  Logger.info("Siginaling for async init");
  client.emit("asyncInit")
};
sycFunctions();


client.login(config.token);
process.on("SIGINT", async function () {
  Logger.warn("Caught interrupt signal, itinating graceful shutdown");

  try {
    await client.destroy();
    await shutdown();
    process.exit(0)

  } catch (err: any) {
    Logger.error(err);
  }
});

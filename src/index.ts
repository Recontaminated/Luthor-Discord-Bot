import * as Discord from "discord.js";
import { GatewayIntentBits, IntentsBitField, Partials } from "discord.js";
// declare module "discord.js" {
//     interface Client<Ready extends boolean = boolean> {
//         config: configType;
//         commands: any;
//         prefix: any;
//     }
// }
import LuthorClient from "./types/luthorClient.js";

const intents = new IntentsBitField().add([
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.DirectMessageReactions,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.MessageContent,
]);

const client = new LuthorClient({
  intents: intents,
  failIfNotExists: false,
  allowedMentions: { repliedUser: false },
});
client.config = config;
client.commands = {};
client.commands.text = new Discord.Collection();
client.commands.slash = new Discord.Collection();
client.prefix = {};

export { client as default };
import config from "./utils/readConfig.js";
import { configType } from "./utils/readConfig.js";
console.log("imporitng command adder");
import commandAdder from "./bot/commandAdder.js";
import eventHandler from "./bot/eventHandler.js";
import shutdown from "./utils/discord/shutdown.js";
import Logger from "./utils/logger.js";
import { initMongo } from "./utils/mongo/mongoManager.js";
import deployCommands from "./utils/discord/deployCommands.js";
import { Guild } from "./utils/mongo/schemas/guild.js";
import { loadModules } from "./bot/moduleLoader.js";

async function loadPrefixes() {
  Logger.info("Loading prefixes...");
  const guildsWithCustomPrefix = await Guild.find({
    prefix: { $exists: true },
  });
  for (let index = 0; index < guildsWithCustomPrefix.length; index++) {
    const guild = guildsWithCustomPrefix[index];
    client.prefix[guild.guildId] = guild.prefix;
  }
}
const sycFunctions = async () => {
  Logger.info("Sync init functions");
  await eventHandler(client);
  await commandAdder();
  await initMongo();
  await loadModules();
  await loadPrefixes();
  await deployCommands();
  Logger.info("Signaling for async init");
  client.emit("asyncInit");
};
sycFunctions();

client.login(client.config.token);

process.on("uncaughtException", (err) => {
  Logger.error(err);
  Logger.error(err.stack);
});

process.on("SIGINT", async function () {
  Logger.warn("Caught interrupt signal, initiating graceful shutdown");

  try {
    await client.destroy();
    await shutdown();
    process.exit(0);
  } catch (err: any) {
    Logger.error(err);
  }
});
const stdin = process.openStdin();

stdin.addListener("data", async function (d) {
  // note:  d is an object, and when converted to a string it will
  // end with a linefeed.  so we (rather crudely) account for that
  // with toString() and then trim()
  const input = d.toString().trim();

  if (input === "stop") {
    Logger.warn("Initiating graceful shutdown");

    try {
      await client.destroy();
      await shutdown();
      process.exit(0);
    } catch (err: any) {
      Logger.error(err);
    }
  }
});

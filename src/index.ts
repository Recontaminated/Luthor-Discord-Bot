import * as Discord from "discord.js";
import { GatewayIntentBits,IntentsBitField,Partials  } from "discord.js";
declare module "discord.js" {
    interface Client<Ready extends boolean = boolean> {
        config: configType;
        commands: any;
        prefix: any;
    }
}
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

const client = new Discord.Client({ intents: intents });
import config from "./utils/readConfig.js";
import { configType } from "./utils/readConfig.js";
import commandAdder from "./bot/commandAdder.js";
import eventHandler from "./bot/eventHandler.js";
import shutdown from "./utils/shutdown.js";
import Logger from "./utils/logger.js";
import { initMongo } from "./utils/mongo/mongoManager.js";
import deployCommands from "./utils/deployCommands.js";
import { Guild } from "./utils/mongo/schemas/guild.js";
// TODO: make prefix inside cache
client.config = config;
client.commands = {};
client.commands.text = new Discord.Collection();
client.commands.slash = new Discord.Collection();
client.prefix = {};
export { client as default };

async function loadPrefixes() {
    Logger.info("Loading prefixes...");
    let guildsWithCustomPrefix = await Guild.find({
        prefix: { $exists: true },
    });
    for (let index = 0; index < guildsWithCustomPrefix.length; index++) {
        const guild = guildsWithCustomPrefix[index];
        client.prefix[guild.guildId] = guild.prefix;
    }
}
let sycFunctions = async () => {
    Logger.info("Sync init functions");
    await eventHandler(client);
    await commandAdder();
    await initMongo();
    await loadPrefixes();
    await deployCommands();
    Logger.info("Signaling for async init");
    client.emit("asyncInit");
};
sycFunctions();

client.login(client.config.token);
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
let stdin = process.openStdin();

stdin.addListener("data", async function (d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    let input = d.toString().trim();

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

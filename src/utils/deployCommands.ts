import { readdir } from 'fs/promises';
import fs from "node:fs";
import path from "node:path";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "./readConfig.js";
import Logger from './logger.js';


let clientId = config.clientId;
let guildId = config.guildID;
let token = config.token;
export default async function deployCommands():Promise<void>{
  const commands = [];


  const commandFiles = await readdir('./dist/bot/commands/slash' );



  for (const file of commandFiles) {
    if (file.startsWith('_') || (file.includes('.') && !file.endsWith('.js')))
    continue;
    const command = await import("../bot/commands/slash/"+file);
    commands.push(command.default.data.toJSON());
  }

  const rest = new REST({ version: "9" }).setToken(token);

  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => Logger.info("Successfully registered application commands."))
    .catch(console.error);
}

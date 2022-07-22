import { readdir } from "fs/promises";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import client from "../index.js";
import Logger from "./logger.js";

export default async function deployCommands(): Promise<void> {
    let clientId = client.config.clientID;
    let guildId = client.config.guildID;
    let token = client.config.token;
    const commands: {}[] = [];

    async function getCommands(pathAdditions = "") {
        const commandFiles = await readdir(
            "./dist/bot/commands/slash" + pathAdditions
        );

        for (const file of commandFiles) {
            if (
                file.startsWith("_") ||
                (file.includes(".") && !file.endsWith(".js"))
            )
                continue;
            if (!file.endsWith(".js")) {
                await getCommands(pathAdditions + "/" + file);
                continue;
            }
            const command = await import(
                `../bot/commands/slash${pathAdditions}/` + file
            );
            commands.push(command.default.data.toJSON());
        }
    }

    await getCommands();
    const rest = new REST({ version: "9" }).setToken(token);

    if (client.config.debug) {
    rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
    })
        .then(() =>
            Logger.info("Successfully registered application commands. to development server")
        )
        .catch(console.error);
}
    else {
        rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        })
            .then(() =>
                Logger.info("Successfully registered application commands.")
            )
            .catch(console.error);
    }}
import { readdir } from "fs/promises";
import Logger from "../utils/logger.js";
import client from "../index.js";
import {CommandType} from '../types/command.js';
async function addTextCommands(pathAdditions = ""): Promise<void> {
    const textCommandFiles = await readdir(
        "./dist/bot/commands/text" + pathAdditions
    );

    for (const file of textCommandFiles) {
        if (
            file.startsWith("_") ||
            (file.includes(".") && !file.endsWith(".js"))
        )
            continue;

        if (!file.endsWith(".js")) {
            await addTextCommands(pathAdditions + "/" + file);
            continue;
        }

        const command = await import(`./commands/text${pathAdditions}/${file}`) as CommandType;
    

        Logger.debug(command.meta)
        let commandName = command.meta.name;

        client.commands.text.set(commandName, command);
        Logger.info(`Loaded command: ${commandName}`);

        if (command.meta?.aliases === undefined) continue;

        for (let i in command.meta.aliases) {
            client.commands.set(
                command.meta.aliases[i],
                command.default
            );
        }
    }
}
async function addSlashCommands(pathAdditions = ""): Promise<void> {
    const slashCommandFiles = await readdir(
        "./dist/bot/commands/slash" + pathAdditions
    );

    for (const file of slashCommandFiles) {
        if (
            file.startsWith("_") ||
            (file.includes(".") && !file.endsWith(".js"))
        )
            continue;

        if (!file.endsWith(".js")) {
            await addSlashCommands(pathAdditions + "/" + file);
            continue;
        }

        const command = await import(
            `./commands/slash${pathAdditions}/${file}`
        );

        client.commands.slash.set(command.default.data.name, command);
        Logger.info(`Loaded command: ${command.default.data.name}`);
    }
}

export default async function commandAdder() {
    Logger.info("Adding text commands");
    await addTextCommands();
    Logger.info("Adding slash commands");
    await addSlashCommands();
}

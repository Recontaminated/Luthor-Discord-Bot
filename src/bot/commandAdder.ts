import { readdir } from "fs/promises";
import Logger from "@utils/logger.js";
import client from "index.js";
import {commandOptions, CommandType} from '../types/command.js';
import LuthorClient from "../types/luthorClient.js";

import assert from "assert";
import {type} from "os";
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
        const startTime = new Date().getTime()
        const commandClass:any = await import(`./commands/text${pathAdditions}/${file}`);
        const commandClassDefault = commandClass.default


        const command = new commandClassDefault(client)

        let commandName = command.name

        client.commands.text.set(commandName, command);
        const endTime = new Date().getTime()

        Logger.info(`Loaded command: ${commandName} in ${(endTime - startTime)} ms`);

        if (command.aliases === undefined) continue;

        for (let i in command.aliases) {
            client.commands.text.set(
                command.aliases[i],
                command
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

        const startTime = new Date().getTime()
        const command = await import(
            `./commands/slash${pathAdditions}/${file}`
        );

        client.commands.slash.set(command.default.data.name, command);

        const endTime = new Date().getTime()
        Logger.info(`Loaded command: ${command.default.data.name} in ${(endTime - startTime)} ms`);
    }
}

export default async function commandAdder() {
    Logger.info("Adding text commands");
    await addTextCommands();
    Logger.info("Adding slash commands");
    await addSlashCommands();
}

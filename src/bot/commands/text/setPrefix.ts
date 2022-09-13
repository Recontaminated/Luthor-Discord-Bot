import * as Discord from "discord.js";
import { Guild } from "@utils/mongo/schemas/guild.js";
import errorBuilder from "../../responces/error.js";
import client from "index.js";
import {Command} from "bot/command.js";
import LuthorClient from "../../../types/luthorClient.js";
import {Message} from "discord.js";
import {requirePermission} from "@utils/commandDecorators.js";

export default class SetPrefix implements Command{
    aliases= [""]
    category= "info";
    cooldown = 0
    cooldowns: Set<any>;
    description = "if you wana see if the bot is still wokring";
    guildOnly = true;
    name = "setprefix";
    usage = "<new prefix>";
    @requirePermission("ManageGuild")
    public async run(message: Message, args: string[]) {
        if (!message.guild)
            return await message.channel.send(
                errorBuilder(
                    "You can't use this command in DM! Please ping me instead",
                    "setprefix"
                )
            );
        let newPrefix = args[0];
        if (!newPrefix)
            return await message.channel.send(
                errorBuilder("Please provide a prefix!", "setPrefix")
            );
        if (newPrefix.length > 5)
            return await message.channel.send(
                errorBuilder("Prefix must be less than 5 characters!", "setPrefix")
            );
        if (newPrefix.length > 1) {
            await message.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(
                            `Warning, prefix will be set with a trailing space. Ex: ${newPrefix} <Command>`
                        )
                        .setColor("#ff0000"),
                ],
            });
            newPrefix = newPrefix + " ";
            console.log(newPrefix.length);
        }
        let data = await Guild.findOne({guildId: message.guild?.id});
        if (!data) data = await Guild.create({guildId: message.guild?.id});

        data.prefix = newPrefix;
        await data.save();
        client.prefix[message.guild.id] = newPrefix;
        return await message.channel.send({
            embeds: [
                {
                    description: `Successfully set prefix to ${newPrefix}`,
                    color: 0x00ff00,
                },
            ],
        });
    }
}


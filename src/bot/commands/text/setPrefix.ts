import * as Discord from "discord.js";
import { Guild } from "../../../utils/mongo/schemas/guild.js";
import errorBuilder from "../../responces/error.js";
import client from "../../../index.js";
export default async function (message: Discord.Message, args: string[]) {
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
    let data = await Guild.findOne({ guildId: message.guild?.id });
    if (!data) data = await Guild.create({ guildId: message.guild?.id });

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

export const meta = {
    name: "setprefix",
    description: "set the prefix for the bot",
    usage: "<Pefix> ",
    category: "config"
};


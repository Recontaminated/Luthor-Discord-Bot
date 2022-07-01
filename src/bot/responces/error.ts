import { MessageEmbed } from "discord.js";

export default function errorBuilder(
    errorDescription: string,
    commandName: string
) {
    const embed = new MessageEmbed()
        .setTitle(`Error with command \`${commandName}\``)
        .setColor("#ff0000")
        .setDescription(errorDescription);

    return { embeds: [embed] };
}

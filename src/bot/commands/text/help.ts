import * as Discord from "discord.js";
import {
    ActionRowBuilder,
    EmbedBuilder,
    InteractionCollector,
    SelectMenuBuilder,
    SelectMenuComponentOptionData
} from "discord.js";
import client from "../../../index.js";
import {categoryInfo} from "../../../utils/discord/catagories.js";

client.on("asyncInit", async () => {
    for (const category in categoryInfo) {
        categoryInfo[category].embed = new EmbedBuilder()
            .setTitle(`${client.config.botName} Help`)
            .setDescription(`<> - Required Argument\n[] - Option Argument`)
            .setFooter({text: "help command by Barely Awake"});
        client.commands.text.forEach((SingularCommand: any) => {
            if (categoryInfo[category].value !== SingularCommand.meta.category) {
                return;
            }
            categoryInfo[category].embed.addFields(
                [{"name":`${SingularCommand.meta.name} ${SingularCommand.meta.usage}`,value:
                SingularCommand.meta.description}],
            );
        })
    }
})

export default async function (message: Discord.Message, args: string[]) {
    await message.delete();
    if (!message.guildId) return;
    const prefix = client.prefix[message.guildId] || client.config.prefix;

    const baseEmbed = new EmbedBuilder()
        .setTitle(`${client.config.botName} Help`)
        .setDescription(`<> - Required Argument\n[] - Option Argument\n${prefix} Bot Prefix `);

    const selectMenuOptions: SelectMenuComponentOptionData[] = [];
    for (const category in categoryInfo) {
        baseEmbed.addFields([
            {
                name: categoryInfo[category].label,
                value: categoryInfo[category].description || ''
            }
        ]);
        const categoryDeepCopy = JSON.parse(JSON.stringify(categoryInfo[category]));
        delete categoryDeepCopy.embed;
        selectMenuOptions.push(categoryDeepCopy);
    }

    const actionRow = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(new SelectMenuBuilder()
            .setCustomId('categorySelector')
            .setPlaceholder('Categories')
            .addOptions(selectMenuOptions));

    const sentMessage = await message.channel.send({
        embeds: [baseEmbed],
        components: [actionRow],
    });
    const interactionCollector = new InteractionCollector(message.client, {
        message: sentMessage,
        time: 120 * 1000,
    });

    interactionCollector.on('collect', (interaction) => {
        if (!interaction.isSelectMenu())
            return;

        if (interaction.user.id !== message.author.id) {
            interaction.reply({
                content: 'You can\'t do that to this message!',
                ephemeral: true,
            });
            return
        }

        interaction.update({
            embeds: [categoryInfo[interaction.values[0]].embed],
            components: [actionRow],
        });
    });


}


export const meta = {
    name: "help",
    description: "Shows this message.",
    usage: "",
    category: "info"
};

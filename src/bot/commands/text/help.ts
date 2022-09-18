import * as Discord from "discord.js";
import {
    ActionRowBuilder,
    EmbedBuilder,
    InteractionCollector,
    SelectMenuBuilder,
    SelectMenuComponentOptionData
} from 'discord.js'
import client from "../../../index.js";
import {categoryInfo} from "../../../utils/discord/catagories.js";
import {Command} from "../command.js";
import LuthorClient from "../../../types/luthorClient.js";
import Logger from "../../../utils/logger.js";
//TODO: make this not rely on async init
export function generateHelpEmbed() {
    for (const category in categoryInfo) {
        categoryInfo[category].embed = new EmbedBuilder()
            .setTitle(`${client.config.botName} Help`)
            .setDescription(`<> - Required Argument\n[] - Option Argument`)
            .setFooter({text: "help command by Barely Awake"});
        client.commands.text.forEach((SingularCommand: any) => {
            if (categoryInfo[category].value !== SingularCommand.category) {
                return;
            }
            categoryInfo[category].embed.addFields(
                [{
                    "name": `${SingularCommand.name} ${SingularCommand.usage}`, value:
                    SingularCommand.description
                }],
            );
        })
    }
}

client.on("asyncInit", async () => {
    generateHelpEmbed();
})


const baseEmbed = new EmbedBuilder()
    .setTitle(`${client.config.botName} Help`)
    .setDescription(`<> - Required Argument\n[] - Option Argument\n${client.config.prefix} Bot Prefix `);

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


export default class Help implements Command{
    aliases= [""]
    category= "info";
    cooldown = 0
    cooldowns: Set<any>;
    description = "i needsomeby to help";
    guildOnly = false;
    name = "help";
    usage = "";

     async run(message: Discord.Message, args: string[]) {
        if (!message.guildId) return;
        const prefix = client.prefix[message.guildId] || client.config.prefix;



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
}





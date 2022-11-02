import { SlashCommandBuilder } from "@discordjs/builders";
import fetch from "node-fetch";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import Logger from "@utils/logger.js";

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("next")
    .setLabel("Next Result")
    .setStyle(ButtonStyle.Primary)
);
let command = {
  data: new SlashCommandBuilder()
    .setName("urban")
    .setDescription("better than brittanica")

    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("prompt for urband dict")
        .setRequired(true)
    ),

  async execute(interaction: any) {
    const term = interaction.options.getString("query");
    const query = new URLSearchParams({ term });
    Logger.debug(query.toString());
    const dictResult = await fetch(
      `https://api.urbandictionary.com/v0/define?${query.toString()}`
    );
    const list: any = await dictResult.json();
    Logger.debug(list);
    const length = list.list.length;
    if (length == 0) {
      return interaction.reply("No results found");
    }
    let index = 0;
    const result1 = list.list[index].definition;
    interaction.reply({ content: result1, components: [row] });
    const filter = (i: { customId: string; user: { id: any } }) =>
      i.customId === "next" && i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });
    //make button hide
    collector.on("end", () => {
      interaction.editReply({ components: [] });
    });
    //@ts-ignore
    collector.on("collect", async (i) => {
      if (index == length - 1) {
        index = 0;
        await i.update({
          content: list.list[index].definition,
          components: [row],
        });
        return;
      }

      await i.update({
        content: list.list[index + 1].definition,
        components: [row],
      });
      index++;
    });
    return;
  },
};

export default command;

import { SlashCommandBuilder } from "@discordjs/builders";
import client from "index.js";
const command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  //@ts-ignore
  async execute(interaction) {
    return interaction.reply(
      `Pong! 🏓 \n Total Latency is ${
        interaction.createdTimestamp - Date.now()
      }ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
  },
};

export default command;

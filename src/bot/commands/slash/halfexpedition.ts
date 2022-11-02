import { SlashCommandBuilder } from "@discordjs/builders";
import { AttachmentBuilder } from "discord.js";
import fetch from "node-fetch";
import Logger from "@utils/logger.js";

let queue: string[] = [];
let command = {
  data: new SlashCommandBuilder()
    .setName("halfexpedition")
    .setDescription("makes a shitty image")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Your prmopt idk")
        .setRequired(true)
    ),
  //@ts-ignore
  async createImage(interaction) {
    const api = `http://192.168.1.88:5000/?username=${interaction.options.getString(
      "prompt"
    )}`;

    // if the useris in the queue, return
    const controller = new AbortController();

    // 20 second timeout:
    const timeoutId = setTimeout(
      () => controller.abort("Request timeout"),
      20000
    );
    try {
      const response = await fetch(api, { signal: controller.signal });

      if (!response.ok) {
        return interaction.editReply({
          content: "Something went wrong",
          ephemeral: true,
        });
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const attachment = new AttachmentBuilder(buffer, {
        name: interaction.options.getString("prompt") + ".png",
      });

      if (response.headers.get("NSFW-detected") == "[True]") {
        await interaction.editReply("NSFW detected, aborting");
        return;
      }
      await interaction.editReply({ files: [attachment] });
      return;
    } catch (e) {
      Logger.error(e);
      return interaction.editReply("The backend service is offline");
    }
  },
  //@ts-ignore
  async execute(interaction) {
    // if (queue.includes(interaction.user.id)) {
    //     return interaction.reply("Please wait for your current image to finish processing")
    // }

    if (queue.length == 0) {
      queue.push(interaction.id);
      await interaction.deferReply("hang on a sec");
      try {
        await this.createImage(interaction);
      } finally {
        queue.splice(queue.indexOf(interaction.id), 1);
      }
    } else if (queue.length > 0) {
      queue.push(interaction.id);
      //    wait till elemenet before resloves promise. This is a really bad implementation but its late and I'd rather have a bad solution than no solution
      await new Promise<void>(async (resolve) => {
        let position = queue.indexOf(interaction.id);
        await interaction.reply("You are in the Queue! position: " + position);
        let interval = setInterval(() => {
          if (queue.indexOf(interaction.id) != position) {
            interaction.editReply(
              "You are in the Queue! position: " + queue.indexOf(interaction.id)
            );
            position = queue.indexOf(interaction.id);
          }
          if (queue.indexOf(interaction.id) == 0) {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      });
      let reply = await interaction.editReply("Generating image...");
      await this.createImage(interaction);
      queue.splice(queue.indexOf(interaction.id), 1);
    }
  },
};

export default command;

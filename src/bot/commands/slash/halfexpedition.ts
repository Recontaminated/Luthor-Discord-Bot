import prettyMilliseconds from "pretty-ms";
import { SlashCommandBuilder } from "@discordjs/builders";
import client from "index.js";
import {AttachmentBuilder} from "discord.js";
import fetch from 'node-fetch';
import Logger from "@utils/logger.js";
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
    async execute(interaction) {
        //make a post request to the api
        const api = `http://192.168.1.88:5000/?username=${interaction.options.getString("prompt")}`;
        let reply = await interaction.deferReply("hang on a sec")
        const response = await fetch(api);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const attachment = new AttachmentBuilder(buffer, {name: interaction.options.getString("prompt") + ".png"});
        Logger.debug(response.headers.get("NSFW-detected"));
        if (response.headers.get("NSFW-detected") == "[True]") {
            return await interaction.editReply("NSFW detected, aborting");
        }
        return await interaction.editReply({files: [attachment]});

        //response is a JPEG image

        //send the image



    },
};

export default command;

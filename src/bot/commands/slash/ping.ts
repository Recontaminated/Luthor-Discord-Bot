import prettyMilliseconds from "pretty-ms";
import { SlashCommandBuilder } from "@discordjs/builders";
import client from "../../../index.js";
let command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    //@ts-ignore
    async execute(interaction) {
        let clientUptime;
        if (client.uptime !== null)
            clientUptime = prettyMilliseconds(client.uptime);
        return interaction.reply(
            `Pong!🏓 \nAPI Latency is **${Math.round(
                client.ws.ping
            )}**ms \n Client Uptime is **${clientUptime}**`
        );
    },
};

export default command;

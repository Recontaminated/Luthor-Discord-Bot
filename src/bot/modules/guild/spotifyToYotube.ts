import Module from "../../../types/module.js";
import nodeFetch from "node-fetch";
import {Client, Message} from "discord.js";

export default class spotiToYT implements Module {
    public name = "spotiToYT";

    async entrypoint(client: Client) {
        client.on("messageCreate", async (message: Message) => {
            if (!message.content.toLowerCase().startsWith("https://open.spotify.com/track/")) return;
            let spotiYtAPI = "http://192.168.1.88:5001/?link="
            let response = await nodeFetch(spotiYtAPI + message.content);
            let content = await response.text();
            let messageChannel = message;
            message.delete()
            await messageChannel.channel.send(content + ` (${message.content})`);


        })
    }


}
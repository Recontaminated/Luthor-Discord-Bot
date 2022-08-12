import {Command} from "../../command.js";
import client from "../../../index.js";
import {Message} from "discord.js";
import LuthorClient from "../../../types/luthorClient.js";

export default class Ping extends Command{
    constructor(client: LuthorClient) {
        super(client,
            {
                name: "ping",
                description: "replies with pong",
                usage: "ping",
                category: "misc",
                cooldown: 1000
            });
    }
    public async run(message: Message){

    }

}
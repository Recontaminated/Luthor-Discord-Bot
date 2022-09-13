import {Command} from "../../command.js";
import client from "../../../index.js";
import {Message} from "discord.js";

export default class Ping implements Command{
    aliases= [""]
    category= "info";
    cooldown = 0
    cooldowns: Set<any>;
    description = "if you wana see if the bot is still wokring";
    guildOnly = false;
    name = "ping";
    usage = "";


    run(message: Message, args: string[]): Promise<any> {
        message.channel.send("pong")
        return Promise.resolve(undefined);
    }




}
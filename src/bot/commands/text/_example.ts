import {Command} from "../../command.js";
import {Message} from "discord.js";

export default class _example implements Command{
    aliases= [""]
    category= "info";
    cooldown = 0
    cooldowns: Set<any>;
    description = "if you wana see if the bot is still wokring";
    guildOnly = false;
    name = "ping";
    usage = "";
    public async run(message: Message){

    }

}
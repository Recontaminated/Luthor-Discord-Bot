import { Command } from "../command.js";
import { Message } from "discord.js";
import * as Discord from "discord.js";
export default class pingVC implements Command {
    aliases = [""];
    category = "info";
    cooldown = 0;
    cooldowns: Set<any>;
    description = "pings everyone in your current voice chat. useful for sending files while on calls or something";
    guildOnly = false;
    name = "pingvc";
    usage = "";
    public async run(message: Message) {
        //get the user's voice channel
        let voiceChannel = message.member?.voice.channel;
        //if the user is not in a voice channel, return
        if (voiceChannel === undefined) {
            await message.reply("you are not in a voice channel");
            return;
        }
        //get the members in the voice channel
        let members = voiceChannel.members;
        //create a string to send
        let messageToSend = "";
        //add the members to the string
        members.forEach(member => {
            messageToSend += member.toString();
        });
        //send the message
        await message.channel.send(messageToSend);
    }
}

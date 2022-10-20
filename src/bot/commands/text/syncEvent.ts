import {Command} from "../command.js";
import {GuildScheduledEventResolvable, Message, Snowflake} from "discord.js";
import {parse} from "url";
import Logger from "@utils/logger.js";

export default class syncEvent implements Command{
    aliases= [""]
    category= "misc";
    cooldown = 0
    cooldowns: Set<any>;
    description = "sync role to event";
    guildOnly = false;
    name = "syncevent";
    usage = "eventid";
    public async run(message: Message, args: String[]){
        Logger.debug("syncing event");
        const guild = message.guild;
        const channel = message.channel;
        const member = message.member;
        const role = guild.roles.cache.find(role => role.name === "event");
        //remove all users from this role
        role.members.forEach(member => {
            member.roles.remove(role);
        });
        //first arg is event url
        // @ts-ignore
        const eventName:string = args[0];
        //@ts-ignore
        let eventSnowflake:Snowflake = parse(eventName,true).query.event;
        Logger.debug("event snowflake: " + eventSnowflake);
        const event = await guild.scheduledEvents.fetch(eventSnowflake);
        //list users of event
        const users = await event.fetchSubscribers()
        users.forEach(user => {
            let userID = user.user.id;
            let member = guild.members.cache.get(userID);
            member.roles.add(role);
        })
        message.channel.send("Synced: " + event.name + "with users: " + users.map(user => user.user.username).join(", "));




    }

}

import { Command } from "../command.js";
import {
  Guild,
  GuildChannel,
  GuildMember,
  GuildScheduledEventResolvable,
  Message,
  Snowflake,
  TextChannel,
} from "discord.js";
import { parse } from "url";
import Logger from "@utils/logger.js";
import { argRegex, onlyInGuild } from "@utils/commandDecorators.js";

export default class syncEvent implements Command {
  aliases = [""];
  category = "misc";
  cooldown = 1800000;
  cooldowns = new Set<any>();
  description = "uses a bot to make someone say something";
  guildOnly = false;
  name = "sudo";
  usage = "<selector> <something to say>";

  @argRegex(/ ?([*]( (\w+))+)|(<@!*&*[0-9]+>( \w+)+)/)
  @onlyInGuild()
  public async run(message: Message, args: string[]) {
    const selector = args[0];
    const channel = message.channel as TextChannel;
    //TODO: fix this awfulness with a decorator or something

    const webhook = await channel.createWebhook({ name: "luthor" });
    Logger.debug("created webhook");
    const messageText = args.slice(1, args.length + 1);
    message.delete();
    if (selector == "*") {
      // channel.members.forEach(async (member:GuildMember) => {
      for (const member of channel.members.values()) {
        await webhook.send({
          content: messageText.join(" "),
          username: member.user.username,
          avatarURL: member.user.avatarURL(),
        });
        //wait for 0.5s
        await new Promise((r) => setTimeout(r, 300));
      }
    }
    else if (selector.startsWith("<@")) {
        const id = selector.slice(2, -1);
        const member = await channel.guild.members.fetch(id);
        await webhook.send({
            content: messageText.join(" "),
            username: member.user.username,
            avatarURL: member.user.avatarURL(),
        });
    }


    Logger.debug("done , deleting webhook");
    await webhook.delete();
  }
}

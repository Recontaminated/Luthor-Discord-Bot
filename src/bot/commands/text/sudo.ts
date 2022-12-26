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
  @argRegex(/[*].*/g)
  @onlyInGuild()
  public async run(message: Message, args: string[]) {
    const selector = args[0];
    let channel = message.channel as TextChannel;
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
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    Logger.debug("done , deleting webhook");
    await webhook.delete();
  }
}

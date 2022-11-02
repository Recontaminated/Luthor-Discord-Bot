import { commandOptions } from "../../types/command.js";
import { Client, Message, PermissionResolvable } from "discord.js";
import { Category } from "@utils/discord/catagories.js";

export abstract class Command {
  public cooldowns: Set<any>;
  name: string;
  aliases?: string[];
  category: Category;
  description: string;
  usage: string;
  cooldown: number; // millis

  abstract run(message: Message, args: string[]): Promise<any>;
}

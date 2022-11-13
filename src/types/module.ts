import client from "../index.js";
import * as Discord from "discord.js";
import {Category} from '@utils/discord/catagories.js'

interface ModuleCommand{
    name: string;
    aliases?: string[];
    category: Category;
    description: string;
    usage: string;
    cooldown?: number; // millis
    run(message: Discord.Message, args: string[]): Promise<void>;
}
export default interface Module {
  name: string;
  entrypoint: () => Promise<void> | void;
  shutdown: () => Promise<void> | void;
  commands?: ModuleCommand[];
}

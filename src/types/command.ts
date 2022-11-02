import { PermissionsString } from "discord.js";

interface meta {
  name: string;
  aliases?: string[];
  catagory?: string | "info";
  description: string;
  usage: string;
}
export interface CommandType {
  default: any;
  meta: meta;
}
export interface commandOptions {
  name: string;
  aliases?: string[];
  category: string;
  description: string;
  usage: string;
  cooldown: number;
  requiredPermissions?: PermissionsString[] | null;
}

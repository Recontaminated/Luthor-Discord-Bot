import {Client} from "discord.js";
import { configType } from "../utils/readConfig.js";

export default class LuthorClient extends Client{
    public config: configType
    public commands:any
    public prefix: any

}
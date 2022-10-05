import client from "../index.js";
import * as Discord from "discord.js"

export default interface Module {
    name: string;
    entrypoint: Function;
    shutdown: Function;
}
import client from "../index.js";
import * as Discord from "discord.js"

export default abstract class Module {
    protected client: Discord.Client
    public entrypoint: Function
    constructor(client: Discord.Client, entrypoint: Function) {
        this.client = client
        this.entrypoint = entrypoint
    }



}
import * as Discord from "discord.js";
import { closeLogStream } from "./logger.js";
//export default async function to shutdown

export default async function shutdown() {
    return new Promise<void>(async (resolve, reject) => {
        await closeLogStream();

        resolve();
    });
}

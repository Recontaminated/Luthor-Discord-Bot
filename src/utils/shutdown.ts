import * as Discord from 'discord.js';
import { closeLogStream } from './logger.js';
//export default async function to shutdown

export default async function shutdown(callback?:any) {
    await closeLogStream(() => {
    callback()
    })


    }
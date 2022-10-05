import { Message } from 'discord.js'
import Module from '../../../types/module.js'
import client from "index.js";
import Logger from "@utils/logger.js";
export default class AtSomeone implements Module{
    public name = "atsomeone";
    shutdown() {

    }
    async entrypoint() {
        client.on("messageCreate", async (message:Message) => {
            let firstRole = message.mentions.roles.first()
            if (!firstRole)
                if (!message.content.toLowerCase().includes("@someone"))
                    return;
                else if (!message.content.toLowerCase().includes("@someone") && firstRole.name !== "someone")
                    return;

            const members = message.guild.members.cache;

            let randomMember = members.random();

            let loop = 0;

            while (true) {
                loop++;
                if (loop > 5)
                    break;
                randomMember = members.random();
                if (randomMember.user.bot) continue;
                if (!randomMember.presence) continue;
                if (randomMember.presence.status == "offline") continue;
                break;
            }

            await message.channel.send(`${randomMember.user.toString()}`);
        })
    }
}


// // export default async function (message: Message) {
//     let firstRole = message.mentions.roles.first()
//     if (!firstRole)
//         if (!message.content.toLowerCase().includes("@someone"))
//             return;
//     else
//         if (!message.content.toLowerCase().includes("@someone") && firstRole.name !== "someone")
//             return;
//
//     const members = message.guild.members.cache;
//
//     let randomMember = members.random();
//
//     let loop = 0;
//
//     while (true) {
//         loop++;
//         if (loop > 5)
//             break;
//         randomMember = members.random();
//         if (randomMember.user.bot) continue;
//         if (!randomMember.presence) continue;
//         if (randomMember.presence.status == "offline") continue;
//         break;
//     }
//
//     await message.channel.send(`${randomMember.user.toString()}`);
// }

// export const settings = {
//     once: false,
//     event: "messageCreate",
// };

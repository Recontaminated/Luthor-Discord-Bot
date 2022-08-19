import { Message } from 'discord.js'
import Module from '../module.js'
import LuthorClient from "../../types/luthorClient.js";

export default class AtSomeone extends Module {
        async atSomeone(message: Message, args: string[]) {
        let firstRole = message.mentions.roles.first()
        if (!firstRole)
            if (!message.content.toLowerCase().includes("@someone"))
                return;
            else
            if (!message.content.toLowerCase().includes("@someone") && firstRole.name !== "someone")
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
import {Message} from 'discord.js'
import Module from '../../../types/module.js'
import client from "index.js";
import fetch from "node-fetch";
import Logger from "@utils/logger.js";
let regex = / <:[^:\s]+:\d+>|<a:[^:\s]+:\d+>|(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|\ufe0f)/g


const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + client.config.openAIKey,
}
let cooldowns:any = [];
export default class emojiOnly implements Module {
    public name = "emojiOnly";

    async entrypoint() {
        client.on("messageCreate", async (message: Message) => {
            //TODO: make this a configurable option. im too lazy to do it now
            if (message.channel.id != "959218470543827024") return;
            //check if a user is on cooldown
            if (cooldowns[message.author.id]) return;

            if (!regex.test(message.content)) {
                message.delete()
            //add user to cooldown 5s default
            cooldowns.push(message.author.id)
            setTimeout(() => {
                cooldowns = cooldowns.filter((id:string) => id != message.author.id)

            }, 5000);


                const data = {
                    model: 'text-davinci-002',
                    prompt:"Convert the following text into emoji only text.\n" +message.content,
                    temperature: 0.7,
                    max_tokens: 256,
                    top_p: 0.3,
                    frequency_penalty: 0.5,
                    presence_penalty: 0,
                }

                const completion = await fetch('https://api.openai.com/v1/completions', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(data),
                })
                const json = await completion.json()
                //create a webhook with the orginal message author as the name and the bot as the avatar
                //make sure its a guild channek
                //@ts-ignore

                    //@ts-ignore
                    const webhook = await message.channel.createWebhook({
                        name: message.author.username,
                        avatar: message.author.displayAvatarURL(),
                    })
                    //@ts-ignore im so done with this
                    await webhook.send(json.choices[0].text)
                    await webhook.delete()
                    //@ts-ignore
                    Logger.info("user " + message.author.username + " inputted " + message.content + " and got " + json.choices[0].text + " as a response")
                }

        })
    }
}

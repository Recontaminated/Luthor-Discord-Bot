import client from "../../../index.js";
import { Message } from "discord.js";
import help from "../../commands/text/help.js";
import fetch from "node-fetch";
import errorBuilder from "../../responces/error.js";
import { MessageMentions } from "discord.js";
import { resourceUsage } from "process";
import { config } from "dotenv";
import {Guild} from "../../../utils/mongo/schemas/guild.js";
interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
}

interface Choice {
  text: string;
  index: number;
  logprobs?: any;
  finish_reason: string;
}
const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + client.config.openAIKey,
};
const askedRecently = new Set();
function argsChecks(args:any){
if (args.length > 100) return "I know what you are trying to do here."
return ""
}

client.cache.cog = {};
client.cache.cog.luthorChatBot = {};

export default async function (message: Message) {

  if (!message.mentions.has(client.user)) return;
  if (client.cache.cog.luthorChatBot[message.guild.id] === null) return
  if (client.cache.cog.luthorChatBot[message.guild.id]===undefined){
    let chatChannelId = await Guild.findOne({guildId:message.guild.id})
    if (!chatChannelId) return;
    if (!chatChannelId.luthorChatChannelId) return client.cache.cog.luthorChatBot[message.guild.id] = null
    chatChannelId = chatChannelId.luthorChatChannelId
    console.log("searching for chat channel")
    client.cache.cog.luthorChatBot[message.guild.id] = chatChannelId
  }
    if (message.channel.id !== client.cache.cog.luthorChatBot[message.guild.id]) return;

//TODO: make a better ratelimiter using decorators
  if (askedRecently.has(message.author.id)){
     return await message.reply(errorBuilder("Im too tired rn lol. wait 10 secconds", "Talk"));
    }



    askedRecently.add(message.author.id);
    setTimeout(() => {
        askedRecently.delete(message.author.id);
    }
    , 1000 * 10 );



  console.log(message.content);
  const args = message.content.replace(MessageMentions.USERS_PATTERN, "");
  const checks = argsChecks(args)
  if (checks != ""){
    await message.reply(checks);
    return
  }
  const data = {
    model: "text-davinci-002",
    prompt: `Luthor is a chatbot that reluctantly answers questions with sarcastic responses:\n\nYou: How many pounds are in a kilogram?\nLuthor : This again? There are 2.2 pounds in a kilogram. Please make a note of this.\nYou: What does HTML stand for?\nLuthor : Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: When did the first airplane fly?\nLuthor : On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\nYou: What is the meaning of life?\nLuthor : I’m not sure. I’ll ask my friend Google.\nYou: ${args}?\nLuthor :`,
    temperature: 0.5,
    max_tokens: 60,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  };
  message.channel.sendTyping();
  const completion = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });
  // use the OpenAPIResponse interface to get the response
  const response = (await completion.json()) as OpenAIResponse;
  message.channel.send(response.choices[0].text);
}

export const settings = {
  once: false,
  event: "messageCreate",
};

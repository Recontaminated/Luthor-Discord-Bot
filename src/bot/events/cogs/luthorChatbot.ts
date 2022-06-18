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


async function contentFilter(prompt:string) {
  console.log("checking "+prompt)
  const data = {  "model": "content-filter-alpha",
  "prompt": `<|endoftext|>${prompt}\n--\nLabel:`,
  "max_tokens": 1,
  "temperature": 0.0,
  "top_p": 0,
  "logprobs":10}
  const completion = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  const response = (await completion.json()) as OpenAIResponse;
  console.log(response)
  let output_label = response["choices"][0]["text"];

// This is the probability at which we evaluate that a "2" is likely real
// vs. should be discarded as a false positive
var toxic_threshold = -0.355;

if (output_label == "2") {
    // If the model returns "2", return its confidence in 2 or other output-labels
    var logprobs = response["choices"][0]["logprobs"]["top_logprobs"][0];

    // If the model is not sufficiently confident in "2",
    // choose the most probable of "0" or "1"
    // Guaranteed to have a confidence for 2 since this was the selected token.
    if (logprobs["2"] < toxic_threshold) {
        var logprob_0 = logprobs.get("0", null);
        var logprob_1 = logprobs.get("1", null);

        // If both "0" and "1" have probabilities, set the output label
        // to whichever is most probable
        if (logprob_0 != null && logprob_1 != null) {
            if (logprob_0 >= logprob_1) {
                output_label = "0";
            } else {
                output_label = "1";
            }
        // If only one of them is found, set output label to that one
        } else if (logprob_0 != null) {
            output_label = "0";
        } else if (logprob_1 != null) {
            output_label = "1";
        }

        // If neither "0" or "1" are available, stick with "2"
        // by leaving output_label unchanged.
    }
}

// if the most probable token is none of "0", "1", or "2"
// this should be set as unsafe
if (output_label != "0" && output_label != "1" && output_label != "2") {
    output_label = "2";
}

return output_label;


  
  
}


export default async function (message: Message) {

  if (!message.mentions.has(client.user)) return;
  console.log(typeof client.cache.cog.luthorChatBot[message.guild.id])
  if (client.cache.cog.luthorChatBot[message.guild.id] === null) return
  if (client.cache.cog.luthorChatBot[message.guild.id]===undefined){
    let chatChannelId = await Guild.findOne({guildId:message.guild.id})
    if (!chatChannelId) return;
    if (!chatChannelId.features.luthorChatChannelId) return client.cache.cog.luthorChatBot[message.guild.id] = null
    chatChannelId = chatChannelId.features.luthorChatChannelId
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
  const contentFilterGauge = await contentFilter(response["choices"][0]["text"])
  if (contentFilterGauge == "0") return message.channel.send(response.choices[0].text);
  message.channel.send("This question asks about a sentive topic. Please refrain from prompting potentally illicit responces.")
}

export const settings = {
  once: false,
  event: "messageCreate",
};

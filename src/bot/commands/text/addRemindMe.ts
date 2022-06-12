import * as Discord from 'discord.js';
import parse from 'parse-duration'
import { Reminder } from '../../../utils/mongo/schemas/reminder.js';
import prettyMilliseconds from 'pretty-ms';
import client from "../../../index.js"

// subprocess of remindme module
const numberRegex = /^[^\d]*(\d+)/
export default async function (message: Discord.Message, args: string[]) {
  
  if (args.length < 2){
    await message.channel.send("Please use the correct input format.")
    return
  }

  let time = args[0]
  let match = time.match(numberRegex)
  if (match?.length == 0 || match == null) return await message.channel.send("Please use the correct input format.")
  if (parseInt(match![0]) < 0) return await message.channel.send("no negative times!")

  let duration = parse(args[0])
  let reminderArray = args.slice(1)
  let reminderText = reminderArray.join(" ")
  let messageURL = message.url
  let createdAt = Date.now()
  try {
    const reminder = await new Reminder({
      creatorId: message.author.id,
      orginalMessage: messageURL,
      duration: duration,
      reminder: reminderText,
      createdAt: createdAt
    })
    await reminder.save()
//TODO: make this a funciton so startup task can use
    await message.channel.send(`Alright, I'll remind you about ${reminderText} in ${prettyMilliseconds(duration)}`)
    setTimeout(async function() {
      
      let unixNow = Date.now()
      let createdAgo =  unixNow - createdAt
      let embed = new Discord.MessageEmbed()
      .addField("Reminder you requested", `${prettyMilliseconds(createdAgo,{compact: true})} ago you asked to be reminded of "${reminderText}"`)
      .addField("Orginal Message", messageURL)
      .setColor("BLUE")
      .setTimestamp()
      //@ts-ignore TODO: fix this
      .setFooter({text:client.user.username, iconURL:client.user.displayAvatarURL()})
      await message.author.send({embeds: [embed]})

    }
    , duration)

  } catch (error) {
    return await message.channel.send("There was an error trying to preform this action")
  }
}

export const description: DescriptionTypes = {
  name: 'remindme',
  description: 'set a reminder',
  usage: '<time> <reminder>',
};

export interface DescriptionTypes {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
}
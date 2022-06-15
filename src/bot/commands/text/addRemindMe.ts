import * as Discord from 'discord.js';
import parse from 'parse-duration';
import { Reminder } from '../../../utils/mongo/schemas/reminder.js';
import prettyMilliseconds from 'pretty-ms';
import client from '../../../index.js';
import Logger from '../../../utils/logger.js';

async function sendReminder(
    creatorId: string,
    createdAt: number,
    oraginalMessageURL: string,
    reminderText: string,
    duration: number,
) {
    setTimeout(async function () {
        Logger.debug(`Sending reminder to ${creatorId}`);
        let unixNow = Date.now();

        let createdAgo = unixNow - createdAt;

        let embed = new Discord.MessageEmbed()
            .addField(
                'Reminder you requested',
                `${prettyMilliseconds(createdAgo, {
                    compact: true,
                })} ago you asked to be reminded of "${reminderText}"`,
            )
            .addField('Orginal Message', oraginalMessageURL)
            .setColor('BLUE')
            .setTimestamp()
            .setFooter({
                text: client.user?.username || 'Bot',
                iconURL: client.user?.displayAvatarURL(),
            });
        //get DM channel using creatorId
        let dmChannel = await client.users.cache.get(creatorId)?.createDM();

        if (dmChannel) {
            await dmChannel.send({ embeds: [embed] });
        }
    }, duration);
}

// subprocess of remindme module

client.on('asyncInit', async () => {
    Logger.info('Refreshing reminders');
    const remincders = await Reminder.find({});
    remincders.forEach(async (document) => {
        const duration = document.duration;
        const createdAt = document.createdAt;
        const createdAgo = Date.now() - createdAt;
        const reminderText = document.reminder;
        const timeLeft = duration - createdAgo;
        if (timeLeft <= 0) {
            Logger.info(`Reminder ${reminderText} has expired`);
            await Reminder.deleteOne({ _id: document._id });
            return;
        }
        sendReminder(document.creatorId, createdAt, document.orginalMessage, reminderText, timeLeft);
    });
    Logger.info(`${remincders.length} reminders refreshed`);
});

const numberRegex = /^[^\d]*(\d+)/;
export default async function (message: Discord.Message, args: string[]) {
    if (args.length < 2) {
        await message.channel.send('Please use the correct input format.');
        return;
    }

    let time = args[0];
    let match = time.match(numberRegex);
    if (match?.length == 0 || match == null)
        return await message.channel.send(
            'Please use the correct input format.',
        );
    if (parseInt(match![0]) < 0)
        return await message.channel.send('no negative times!');

    let duration = parse(args[0]);
    let reminderArray = args.slice(1);
    let reminderText = reminderArray.join(' ');
    let messageURL = message.url;
    let createdAt = Date.now();
    try {
        const reminder = await new Reminder({
            creatorId: message.author.id,
            orginalMessage: messageURL,
            duration: duration,
            reminder: reminderText,
            createdAt: createdAt,
        });
        await reminder.save();
        //TODO: make this a funciton so startup task can use
        await message.channel.send(
            `Alright, I'll remind you about ${reminderText} in ${prettyMilliseconds(duration)}`,
        );
        sendReminder(
            message.author.id,
            createdAt,
            messageURL,
            reminderText,
            duration,
        );
    } catch (err) {
        Logger.error(err);
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

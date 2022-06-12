import { SlashCommandBuilder } from '@discordjs/builders';
import client from "../../../index.js"
import Logger from '../../../utils/logger.js';
import usernameToUUID from '../../../utils/minecraftUsernameToUUID.js';
import { Player } from '../../../utils/mongo/mongoManager.js';


let command = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Register your minecraft username with Luthor!')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your minecraft username')
                .setRequired(true))
                ,
//@ts-ignore
	async execute(interaction) {
        const { options } = interaction
        let username = options.get("username")
        let mojang
        try {
            mojang = await usernameToUUID(username.value)
        } catch (error) {
            return interaction.reply("Invalid username!")
        }


        const player = new Player({minecraft:{friendlyName: mojang.name, UUID: mojang.id}, discordId: interaction.user.id})
		await player.save()

        return interaction.reply("Sucessfulyl registered!");
	},
};

export default command;
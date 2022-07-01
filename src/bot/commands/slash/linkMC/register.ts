import { SlashCommandBuilder } from "@discordjs/builders";
import usernameToUUID from "../../../../utils/minecraftUsernameToUUID.js";
import { Player } from "../../../../utils/mongo/schemas/player.js";
import errorBuilder from "../../../responces/error.js";

let command = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register your minecraft username with Luthor!")
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("Your minecraft username")
                .setRequired(true)
        ),
    //@ts-ignore
    async execute(interaction) {
        const { options } = interaction;
        const existingDiscordData = await Player.find({
            discordId: interaction.user.id,
        });

        if (existingDiscordData.length !== 0)
            return interaction.reply(
                errorBuilder(
                    "You have already linked on this discord account. Please use the unlink command and then try " +
                        "linking again.",
                    command.data.name
                )
            );

        let username = options.get("username");
        let mojang;
        try {
            mojang = await usernameToUUID(username.value);
        } catch (error) {
            return interaction.reply(
                errorBuilder(
                    (error = `Couldn't find user ${username.value}`),
                    "register"
                )
            );
        }

        await Player.create({
            discordId: interaction.user.id,
            minecraft: { friendlyName: mojang.name, UUID: mojang.id },
        });

        return interaction.reply("Sucessfulyl registered!");
    },
};

export default command;

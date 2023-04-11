import { Command } from "../command.js";
import { Message } from "discord.js";

export default class _example implements Command {
    aliases = [""];
    category = "misc";
    cooldown = 0;
    cooldowns: Set<any>;
    description = "little motivional things to keep you goin";
    guildOnly = false;
    name = "reward";
    usage = "";




    public async run(message: Message) {

        const reward_probs = {
            "blaze pizza": 0.5,
            "4 laps around the house": 0.3,
            "5 minutes of reddit": 0.5,
            "next shower is warm": 0.5,
            "one round of bedwars": 0.2,
            "work on program": 0.1,
            "10 minutes do anything": 0.1,
            "Movie this weekend": 0.001,
            "board game with nearest person": 0.1,
            "2 minutes of fail army": 0.4,

        }
        //pick a random reward from the list using the probs as weights
        const reward = Object.keys(reward_probs)[Math.floor(Math.random() * Object.keys(reward_probs).length)];
        //send the reward to the user

        message.channel.send(`${reward}`);



    }
}

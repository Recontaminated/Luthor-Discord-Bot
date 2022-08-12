import {commandOptions} from "../types/command.js";
import {User, Guild, Client, Message, GuildMember} from "discord.js"

export abstract class Command{
    protected client;
    public conf: commandOptions
    public cooldowns: Set<any>;
    constructor(client:Client, options:commandOptions) {
        this.client = client
        this.conf = {
            name: options.name,
            description: options.description || 'No information specified.',
            usage: options.usage || '',
            category: options.category || 'Information',
            cooldown: options.cooldown || 1000,
            requiredPermissions: options.requiredPermissions || ['ReadMessageHistory']
        }

    }

    public hasPermission(user: User, message: Message): boolean {
     if(user instanceof  GuildMember && !user.permissions.has(this.conf.requiredPermissions)) {
            message.channel.send(
                "You don't have permission for this command"
            );
            return false;
        }
        return true;
    }
    public setCooldown(user: User, guild: Guild): void {
        this.cooldowns.add({ user, guild });

        setTimeout(() => {
            const cooldown = [...this.cooldowns].filter(
                cd => cd.user === user && cd.guild === guild
            )[0];
            this.cooldowns.delete(cooldown);
        }, this.conf.cooldown);
    }

}

import { ChannelType, EmbedBuilder, PermissionFlagsBits, type Guild } from "discord.js";
import type IEvent from "../Interfaces/Event";
import type { WalkieClient } from "../WalkieClient";

export default {
    name: 'guildCreate',
    once: false,
    execute: async (guild: Guild, client: WalkieClient) => {

        const welcomeEmbed = new EmbedBuilder()
            .setTitle("Hello!")
            .setDescription("Thank you for adding me to your server!")
            .setThumbnail(guild.iconURL({ extension: 'gif' }) as string)
            // .setAuthor({ name: client.user?.username as string, iconURL: client.user?.displayAvatarURL({ extension: 'gif' }) as string })
            .setTimestamp()

        let foundChannel = false;
        guild.channels.cache.filter(channel => channel.type == ChannelType.GuildText).forEach(channel => {
            if (!foundChannel && guild.members?.me && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages)) {
                channel.send({ embeds: [welcomeEmbed] });
                foundChannel = true;
            }
        });
    }
} as IEvent;
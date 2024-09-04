import { PermissionsBitField, SlashCommandBuilder, EmbedBuilder, ChannelType, GuildChannel, type EmbedData, type EmbedField, Colors, CategoryChannel, type CategoryChannelResolvable } from 'discord.js';
import type ICommand from '../Interfaces/Command';

export default 
{
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the bot for your server')
        .addIntegerOption(option => option
            .setName('default_channels')
            .setDescription('The number of default channels to create')
            .setRequired(true))
        .addChannelOption(option => option
                .setName('category')
                .setDescription('The category to create the channels in')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
    execute: async ({ interaction, client }) => {
        
        // See if the bot has the required permissions
        const botPermissions = interaction.guild?.members.me?.permissions;
        if (!botPermissions?.has(PermissionsBitField.Flags.ManageChannels))
        {
            await interaction.reply({ content: 'I do not have the required permissions to setup the server!', ephemeral: true });
            return;
        }

        // Defer the reply
        await interaction.deferReply({ ephemeral: true });
        
        const defaultChannels = interaction.options.get('default_channels', true);
        const category = interaction.options.get('category');

        // Create the category if it doesn't exist
        let categoryChannel;
        if (category)
        {
            categoryChannel = await interaction.guild?.channels.cache.get(category.value as string);

            if (!categoryChannel)
            {
                await interaction.editReply({ content: 'Category not found! Creating one now...' });
                categoryChannel = await interaction.guild?.channels.create({ name: 'Lethal Company Channels', type: ChannelType.GuildCategory, permissionOverwrites: [] }) as CategoryChannel;

                console.log(`Created Category: ${categoryChannel?.name} ID: ${categoryChannel?.id}`);
            }
        }
        else
        {
            categoryChannel = await interaction.guild?.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name === 'Lethal Company Channels');

            if (!categoryChannel)
            {
                await interaction.editReply({ content: 'Category not found! Creating one now...' });
                categoryChannel = await interaction.guild?.channels.create({ name: 'Lethal Company Channels', type: ChannelType.GuildCategory, permissionOverwrites: [] }) as CategoryChannel;

                console.log(`Created Category: ${categoryChannel?.name} ID: ${categoryChannel?.id}`);
            }
        }

        // Create the "lobby" channel
        await interaction.guild?.channels.create({ name: 'Lobby', type: ChannelType.GuildVoice, parent: categoryChannel as CategoryChannelResolvable });

        //! Should NEVER be ran, but just in case
        if (!defaultChannels) { return await interaction.editReply({ content: 'No default channels specified!' }); }

        // Create the default channels
        for (let i = 0; i < parseInt(defaultChannels?.value as string); i++)
        {
            await interaction.guild?.channels.create({name: `Channel ${i + 1}`, type: ChannelType.GuildVoice, parent: categoryChannel as CategoryChannelResolvable});
        }

        const embedFields: EmbedField[] = [
            { name: 'Category', value: categoryChannel?.name || 'None', inline: true },
            { name: 'Default Channels', value: defaultChannels?.value?.toString() as string, inline: true }
        ];

        const setupEmbed = new EmbedBuilder()
            .setTitle('Setup')
            .setDescription('Setup Complete!')
            .setAuthor({ name: client.user?.username as string, iconURL: client.user?.displayAvatarURL({ extension: 'gif' }) as string })
            .addFields(embedFields)
            .setColor(Colors.Green)
            .setTimestamp();

        await interaction.editReply({ embeds: [setupEmbed] });
    }
} as ICommand;
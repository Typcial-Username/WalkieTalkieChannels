import { PermissionFlagsBits, SlashCommandBuilder, Events } from "discord.js";
import type ICommand from "../Interfaces/Command";
import { GetFiles } from "../Utils";
import path from "path";

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription(`Test Events`)
        .addStringOption(option => option
            .setName('event')
            .setDescription('The event to test')
            .setRequired(true)
            .setAutocomplete(true)
        )

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    autocomplete: async ({ interaction, focusedOption }) => {
        const choices = GetFiles(path.join(__dirname, '../Events'))
            .map(file => {
                const name = file.split('/')[file.split('/').length - 1].split('.')[0];
                return name;
            })
            .filter(name => name.toLowerCase() !== 'ready');

        const filteredChoices = choices.filter(choice => choice.toLowerCase().includes(focusedOption.get('event')?.value as string));
        // Filter the filteredChoices to only include the first 25 choices
        const finalChoices = filteredChoices.slice(0, 25);

        await interaction.respond(filteredChoices.map(choice => ({ name: choice, value: choice })));
    },
    execute: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });
        const event = interaction.options.get('event', true).value as string;

        const allEvents = GetFiles(path.join(__dirname, '../Events'))
        .map(file => {
            const name = file.split('/')[file.split('/').length - 1].split('.')[0];
            return `${name}`;
        });
        if (!allEvents.includes(event)) {
            await interaction.editReply({ content: `Event \`${event}\` not found!` });
            return;
        }

        switch (event)
        {
            case 'GuildCreate':
                if (interaction.guild) {
                    interaction.client.emit('guildCreate', interaction.guild);
                }

                await interaction.editReply({ content: 'Guild Create Event' });
                break;
        }
        
    },
} as ICommand;
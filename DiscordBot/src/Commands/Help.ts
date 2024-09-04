import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, type Interaction } from "discord.js";
import type ICommand from "../Interfaces/Command";
import { GetFiles } from "../Utils";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays the help menu'),
    execute: async ({ interaction }) => {
        // Get the number of pages
        let numPages = GetFiles('../Commands').length

        if (numPages < 25) numPages = 1;
        else numPages = Math.ceil(numPages / 25) + 1;

        const pages: EmbedBuilder[] = [];

        const homeEmbed = new EmbedBuilder()
            .setTitle('Help Menu')
            .setDescription('Welcome to the help menu!')

        pages.push(homeEmbed);

        for (let i = 0; i < numPages; i++)
        {
            const pageEmbed = new EmbedBuilder()
                .setTitle(`Help Menu - Page ${i + 1}`)
                .setDescription('This is a help menu page');

            pages.push(pageEmbed);
        }

        const buttons = [
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Secondary),
        ]

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(buttons);

        const message = await interaction.reply({ embeds: [pages[0]], components: [row] });

        let currentPage = 0;

        const filter = (i: Interaction) => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            if (i.customId === 'previous')
            {
                if (currentPage === 0) return;

                currentPage--;
                await i.update({ embeds: [pages[currentPage]], components: [row] });
            }
            else if (i.customId === 'next')
            {
                if (currentPage === pages.length - 1) return;

                currentPage++;
                await i.update({ embeds: [pages[currentPage]], components: [row] });
            }
        });
    }
} as ICommand
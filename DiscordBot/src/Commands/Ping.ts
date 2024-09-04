import { SlashCommandBuilder } from "discord.js";
import type ICommand from "../Interfaces/Command";
import type ICommandArgs from "../Interfaces/Command";

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    execute: async ({ interaction }) => {
        await interaction.reply('Pong!');
    }
} as ICommand;
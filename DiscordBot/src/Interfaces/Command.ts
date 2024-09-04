import { AutocompleteInteraction, CommandInteraction, Guild, SlashCommandBuilder } from 'discord.js';
import type { WalkieClient } from '../WalkieClient';

export interface ICommandArgs
{
    interaction: CommandInteraction;
    client: WalkieClient;
    // guild: Guild;
    args: CommandInteraction['options'];
}

export interface IAutocompleteArgs
{
    interaction: AutocompleteInteraction;
    client: WalkieClient;
    focusedOption: CommandInteraction['options'];
}

export default interface ICommand
{
    data: SlashCommandBuilder;
    execute: (args: ICommandArgs) => Promise<void>;
    autocomplete?: (args: IAutocompleteArgs) => Promise<void>;
}
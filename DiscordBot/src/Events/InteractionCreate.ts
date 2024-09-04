import type IEvent from '../Interfaces/Event'
import { BaseInteraction, CommandInteraction } from 'discord.js';
import type { WalkieClient } from '../WalkieClient';

export default {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction: BaseInteraction) => {
        if (interaction.isCommand())
        {
            const { commandName } = interaction;
    
            const client = interaction.client as WalkieClient;
    
            if (!client.commands.has(commandName)) return console.error(`No Command matching ${commandName} found!`);
    
            try
            {
                const commandInteraction = interaction as CommandInteraction;
    
                await client.commands.get(commandName)?.execute({
                    interaction: commandInteraction,
                    client: client,
                    // guild: commandInteraction.guild,
                    args: commandInteraction.options
                });
            }
            catch (error)
            {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                }
                else
                {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
    }
    else if (interaction.isAutocomplete())
    {
        const client = interaction.client as WalkieClient;
        const command = client.commands.get(interaction.commandName);

        if (!command) { return console.error(`No Command matching ${interaction.commandName} found!`); }

        try
        {
            await command.autocomplete?.({
                interaction,
                client,
                focusedOption: interaction.options
            });
        }
        catch (error)
        {
            console.error(error);
            // await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
    }
} as IEvent;
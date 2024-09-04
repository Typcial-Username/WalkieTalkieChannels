import { config } from 'dotenv';
import { REST, Routes } from 'discord.js';
import path from 'path';
import { Colors, GetFiles } from './Utils';

import type ICommand from './Interfaces/Command';

config({ path: path.join(__dirname, '..', '.env') });

const commands = [] as ICommand[];

const commandsPath = path.join(__dirname, 'Commands');
const commandFiles = GetFiles(commandsPath);

for (const file of commandFiles)
{
    if (!file.endsWith('.ts')) continue;

    const command = require(file)['default'];
    console.log({ command });

    if ('data' in command && 'execute' in command) 
    {
        commands.push(command.data.toJSON());
    }
    else
    {
        console.log(`⚠️ ${Colors.Fg.Yellow}${Colors.Fg.Bold}[Warning] Command ${file} is missing 'data' or 'execute'!${Colors.Reset}`);
    }

}

const rest = new REST().setToken(process.env.BOT_TOKEN as string);

(async () => {
    console.log(`${Colors.Fg.Cyan}Received ${commands.length} commands${Colors.Reset}`);
    try 
    {
        console.log(`${Colors.Fg.Green}${Colors.Fg.Bold}Started refreshing ${commands.length} application (/) commands.${Colors.Reset}`);

        if (process.env.PRODUCTION === 'true')
        {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID as string),
                { body: commands }
            );
        }
        else
        {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.TEST_GUILD_ID as string),
                { body: commands }
            );
        }
       
        console.log(`${Colors.Fg.Green}${Colors.Fg.Bold}Successfully reloaded ${commands.length} application (/) commands.${Colors.Reset}`);
    }
    catch (error)
    {
        console.error(`${Colors.Fg.Red}${Colors.Fg.Bold}Error refreshing application (/) commands: ${error}${Colors.Reset}`);
    }
})();
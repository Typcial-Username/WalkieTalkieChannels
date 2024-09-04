import { ActivityType, GatewayIntentBits, Partials } from 'discord.js';
import { config } from 'dotenv';
import { Colors, GetFiles } from './Utils'
import { WalkieClient } from './WalkieClient';
import type ICommand from './Interfaces/Command';
import type IEvent from './Interfaces/Event';

config({
    'path': `${__dirname}/../.env`
});

export const client = new WalkieClient(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
        ],
        partials: [Partials.Channel, Partials.User, Partials.GuildMember],
        presence: {
            activities: [
                {
                    name: 'The Company',
                    type: ActivityType.Listening
                }
            ]
        }
    }
);

const commandsPath = `${__dirname}/Commands`;
const eventsPath = `${__dirname}/Events`;

const commandFiles = GetFiles(commandsPath).filter(file => file.endsWith('.ts'));
const eventFiles = GetFiles(eventsPath).filter(file => file.endsWith('.ts'));

console.log(`${Colors.Fg.Cyan}Registering Commands:${Colors.Reset}`)
commandFiles.forEach(file =>
{
    const commandName = file.split('/')[file.split('/').length - 1].split('.')[0];
    
    const command: ICommand = require(file)['default'];
    client.registerCommand(command);
    console.log(`\t${Colors.Fg.Cyan}Registered Command: ${commandName}${Colors.Reset}`);
});

console.log(`${Colors.Fg.Cyan}Registering Events:${Colors.Reset}`)
eventFiles.forEach(file =>
{
    const eventName = file.split('/')[file.split('/').length - 1].split('.')[0];
    
    const event: IEvent = require(file)['default'];
    client.registerEvent(event);
    console.log(`\t${Colors.Fg.Cyan}Registered Event: ${eventName}${Colors.Reset}`);
    
    if (event.once)
    {
        client.once(event.name, (...args) => event.execute(...args));
    } 
    else
    {
        client.on(event.name, (...args) => event.execute(...args));
    }
});

client.login(process.env.BOT_TOKEN);

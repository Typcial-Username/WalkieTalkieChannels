import { Client, Collection, type ClientOptions } from 'discord.js'
import type ICommand from './Interfaces/Command'
import type IEvent from './Interfaces/Event';

export class WalkieClient extends Client
{
    private _commands: Collection<string, ICommand> = new Collection();
    private _events: Collection<string, IEvent> = new Collection();
    
    constructor(options: ClientOptions)
    {
        super(options)
    }

    public get commands(): Collection<string, ICommand>
    {
        return this._commands;
    }

    public get events(): Collection<string, IEvent>
    {
        return this._events;
    }

    public registerCommand(command: ICommand): void
    {
        this.commands.set(command.data.name, command);
    }

    public registerEvent(event: IEvent): void
    {
        this.events.set(event.name, event);
    }

    public registerCommands(commands: ICommand[]): void
    {
        commands.forEach(command => this.registerCommand(command));
    }

    public registerEvents(events: IEvent[]): void
    {
        events.forEach(event => this.registerEvent(event));
    }
}
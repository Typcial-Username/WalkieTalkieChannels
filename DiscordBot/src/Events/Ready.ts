import type IEvent from "../Interfaces/Event";
import { Colors } from "../Utils";
import type { WalkieClient } from "../WalkieClient";

export default {
    name: 'ready',
    once: true,
    execute: async (client: WalkieClient) => {
        console.log(`${Colors.Fg.Green}${Colors.Fg.Bold}Ready! Logged in as ${client?.user?.tag}${Colors.Reset}`);

        console.log(`Registered Commands: ${client.commands.size} | Registered Events: ${client?.events.size}${Colors.Reset}`);

        // Run the API from api.ts
        require('../api');
    }
} as IEvent;
import consola from 'consola';
import { ActivityType, type Client, Events } from 'discord.js';
import { type Event } from '../types.js';

const readyEvent: Event = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    const serverCount = client.guilds.cache.size;

    client.user?.setActivity({
      name: `👀 | Watching ${serverCount} Discord Servers!`,
      type: ActivityType.Custom
    });

    consola.success(`✅ Logged in as ${client.user?.username}!`);
  }
};

export default readyEvent;

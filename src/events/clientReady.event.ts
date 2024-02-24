import consola from 'consola';
import { ActivityType, Client, Events } from 'discord.js';

const event = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    const serverCount = client.guilds.cache.size;

    client.user?.setActivity({
      name: `👀 | Watching ${serverCount} Discord Servers!`,
      type: ActivityType.Custom
    });

    consola.success(`Logged in as ${client.user?.tag}!`);
  }
};

export default event;

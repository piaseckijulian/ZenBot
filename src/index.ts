import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { TOKEN } from './config.js';
import { Command } from './types.js';

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, './handlers');
readdirSync(handlersDir).forEach(handler => {
  if (!handler.endsWith('.handler.js')) return;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const handlerFunction = require(`${handlersDir}/${handler}`);

  handlerFunction(client);
});

client.login(TOKEN);

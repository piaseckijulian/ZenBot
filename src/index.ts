import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { glob } from 'glob';
import path from 'path';
import { TOKEN } from './env';
import { getEnvironment } from './lib/utils';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cooldowns = new Collection();

(async () => {
  const env = getEnvironment();
  const handlersPath =
    env === 'dev'
      ? './src/handlers/*.handler.ts'
      : './dist/handlers/*.handler.js';

  const files = (await glob(handlersPath)).map(filePath =>
    path.resolve(filePath)
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  files.map(file => require(file).default(client));
})();

client.login(TOKEN);

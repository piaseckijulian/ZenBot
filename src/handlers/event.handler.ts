import consola from 'consola';
import { type Client } from 'discord.js';
import { glob } from 'glob';
import path from 'path';
import { getEnvironment } from '../lib/utils';
import { type Event } from '../types';

const eventHandler = async (client: Client) => {
  const env = getEnvironment();
  const handlersPath =
    env === 'dev' ? './src/events/*.event.ts' : './dist/events/*.event.js';

  const files = (await glob(handlersPath)).map(filePath =>
    path.resolve(filePath)
  );

  files.map(file => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const event: Event = require(file).default;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const execute = (...args: any) => event.execute(...args);

    // @ts-expect-error event.name is compatible with ClientEvents
    if (event.once) client.once(event.name, execute);
    // @ts-expect-error event.name is compatible with ClientEvents
    else client.on(event.name, execute);
  });

  consola.success('✅ Successfully loaded events!');
};

export default eventHandler;

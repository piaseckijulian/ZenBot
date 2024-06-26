import consola from 'consola';
import { type Client, type ClientEvents } from 'discord.js';
import { glob } from 'glob';
import path from 'path';
import { pathToFileURL } from 'url';
import { fileDirName } from '../lib/utils.js';
import { type Event } from '../types.js';

const { __dirname } = fileDirName(import.meta.url);

const eventHandler = async (client: Client) => {
  const eventsPath = __dirname.includes('dist')
    ? './dist/events/*.event.js'
    : './src/events/*.event.ts';

  const files = (await glob(eventsPath)).map(filePath =>
    path.resolve(filePath)
  );

  files.map(async file => {
    const eventPath = pathToFileURL(file).href;
    const { default: event }: { default: Event } = await import(eventPath);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const execute = (...args: any) => event.execute(...args);

    if (event.once) {
      client.once(event.name as keyof ClientEvents, execute);
    } else {
      client.on(event.name as keyof ClientEvents, execute);
    }
  });

  consola.success('✅ Successfully loaded events!');
};

export default eventHandler;

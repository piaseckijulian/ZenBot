import consola from 'consola';
import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Event } from '../types.js';

module.exports = (client: Client) => {
  const eventsDir = join(__dirname, '../events');

  readdirSync(eventsDir).forEach(file => {
    if (!file.endsWith('.event.js')) return;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const event: Event = require(`${eventsDir}/${file}`).default;

    event.once
      ? client.once(event.name, (...args) => event.execute(...args))
      : client.on(event.name, (...args) => event.execute(...args));
  });

  consola.success('Successfully loaded events');
};

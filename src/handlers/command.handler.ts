import consola from 'consola';
import {
  Client,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes
} from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { CLIENT_ID, TOKEN } from '../config.js';
// import { GUILD_ID } from '../config' // Development Only
import { getFileExtension } from '../lib/utils.js';
import { Command } from '../types.js';

const fileExtension = getFileExtension();

export default async (client: Client) => {
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  const commandsDir = join(__dirname, '../commands');

  readdirSync(commandsDir).forEach(file => {
    if (!file.endsWith(`.command${fileExtension}`)) return;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command: Command = require(`${commandsDir}/${file}`).default;

    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  });

  const rest = new REST().setToken(TOKEN!);

  try {
    // Update Guild Slash Commands
    // await rest.put(Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID!), {
    //   body: commands
    // });

    // Update Global Slash Commands
    await rest.put(Routes.applicationCommands(CLIENT_ID!), { body: commands });

    consola.success('Successfully loaded commands');
  } catch (error) {
    consola.error(error);
  }
};

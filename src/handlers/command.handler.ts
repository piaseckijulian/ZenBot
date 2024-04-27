import consola from 'consola';
import {
  type Client,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  REST,
  Routes
} from 'discord.js';
import { glob } from 'glob';
import path from 'path';
import { CLIENT_ID, TOKEN } from '../env';
import { getEnvironment } from '../lib/utils';
import { type Command } from '../types';
// import { GUILD_ID } from '../env' // Development Only

const commandHandler = async (client: Client) => {
  const env = getEnvironment();
  const handlersPath =
    env === 'dev'
      ? './src/commands/*.command.ts'
      : './dist/commands/*.command.js';
  const rest = new REST().setToken(TOKEN!);
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  const files = (await glob(handlersPath)).map(filePath =>
    path.resolve(filePath)
  );

  files.map(file => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command: Command = require(file).default;

    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  });

  try {
    // Update Guild Slash Commands
    // await rest.put(Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID!), {
    //   body: commands
    // });
    // Update Global Slash Commands

    await rest.put(Routes.applicationCommands(CLIENT_ID!), { body: commands });
    consola.success('✅ Successfully loaded commands!');
  } catch (error) {
    consola.error(`❌ ${error}`);
  }
};

export default commandHandler;

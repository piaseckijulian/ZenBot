import consola from 'consola';
import {
  type Client,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  REST,
  Routes
} from 'discord.js';
import { glob } from 'glob';
import path from 'path';
import { pathToFileURL } from 'url';
import { CLIENT_ID, TOKEN } from '../env.js';
// import { GUILD_ID } from '../env.js'; // Development only
import { fileDirName } from '../lib/utils.js';
import { type Command } from '../types.js';

const { __dirname } = fileDirName(import.meta.url);

const commandHandler = async (client: Client) => {
  const commandsPath = __dirname.includes('dist')
    ? './dist/commands/*.command.js'
    : './src/commands/*.command.ts';

  const rest = new REST().setToken(TOKEN!);
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  const files = (await glob(commandsPath)).map(filePath =>
    path.resolve(filePath)
  );

  const commandPromise = files.map(async file => {
    const commandPath = pathToFileURL(file).href;
    const { default: command }: { default: Command } = await import(
      commandPath
    );

    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  });

  await Promise.all(commandPromise);

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

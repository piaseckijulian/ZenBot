import {
  type ChatInputCommandInteraction,
  type Collection,
  type ColorResolvable,
  type SlashCommandBuilder,
  Events
} from 'discord.js';

export interface Command {
  data: Omit<SlashCommandBuilder, 'addSubcommandGroup' | 'addSubcommand'>;
  execute: (interaction: ChatInputCommandInteraction) => void;
}

export interface Event {
  name: Events;
  once: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: any) => void;
}

export interface Colors {
  [key: string]: ColorResolvable;
}

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    cooldowns: Collection<string, Collection<string, number>>;
  }
}

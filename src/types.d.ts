import {
  ChatInputCommandInteraction,
  Collection,
  ColorResolvable,
  SlashCommandBuilder
} from 'discord.js';

export interface Command {
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (interaction: ChatInputCommandInteraction) => void;
}

export interface Event {
  name: string;
  once?: boolean | false;
  execute: (...args) => void;
}

export interface Colors {
  [key: string]: ColorResolvable;
}

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    cooldowns: Collection<string, Collection>;
  }
}

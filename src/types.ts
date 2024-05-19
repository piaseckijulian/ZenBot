import {
  type ChatInputCommandInteraction,
  type Collection,
  type ColorResolvable,
  type SlashCommandOptionsOnlyBuilder,
  Events
} from 'discord.js';

export interface Command {
  data: SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
}

export interface Event {
  name: Events;
  once: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: any) => void;
}

export interface Colors {
  primary: ColorResolvable;
  error: ColorResolvable;
}

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    cooldowns: Collection<string, Collection<string, number>>;
  }
}

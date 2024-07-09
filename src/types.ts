import type {
  ChatInputCommandInteraction,
  Collection,
  ColorResolvable,
  Events,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js"

export interface Command {
  data: SlashCommandOptionsOnlyBuilder
  execute: (interaction: ChatInputCommandInteraction) => void
}

export interface Event {
  name: Events
  once: boolean
  // biome-ignore lint/suspicious/noExplicitAny: REST parameters
  execute: (...args: any) => void
}

export interface Colors {
  primary: ColorResolvable
  error: ColorResolvable
}

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>
    cooldowns: Collection<string, Collection<string, number>>
  }
}

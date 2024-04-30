import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { colors } from '../config';
import { type Command } from '../types';

const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Checks bot's latency"),
  execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle(
        `Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms`
      )
      .setColor(colors.primary);

    interaction.reply({ embeds: [embed] });
  }
};

export default pingCommand;

import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { colors } from '../config.js';
import { Command } from '../types.js';

export default {
  // eslint-disable-next-line quotes
  data: new SlashCommandBuilder().setName('ping').setDescription("Checks bot's latency"),
  execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle(`Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms`)
      .setColor(colors.primary);

    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
} satisfies Command;

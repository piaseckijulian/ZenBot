import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder
} from 'discord.js';
import { colors } from '../config';
import { validateCommand } from '../lib/validateCommand';
import { type Command } from '../types';

const banCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('User that we want to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for the ban')
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('target')!;
    const reason =
      interaction.options.getString('reason') || 'No reason provided';

    const { isValid, targetUser, message } = await validateCommand(
      interaction,
      'ban',
      user
    );

    if (!isValid || !targetUser) {
      const errorEmbed = new EmbedBuilder()
        .setTitle(message)
        .setColor(colors.error);

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const oneWeekSecs = 604800;
    targetUser.ban({ deleteMessageSeconds: oneWeekSecs, reason });

    const fields = [
      { name: 'User', value: `<@!${targetUser.id}>`, inline: true },
      { name: 'Reason', value: reason, inline: true }
    ];

    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.user.username} has been banned from the server`)
      .setColor(colors.primary)
      .setThumbnail(targetUser.displayAvatarURL())
      .setFields(fields);

    interaction.reply({ embeds: [embed] });
  }
};

export default banCommand;

import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { colors } from '../config.js';
import { Command } from '../types.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('User that we want to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for the kick')
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const targetUser = await interaction.guild?.members.fetch(user?.id || '');

    const errorEmbed = new EmbedBuilder().setColor(colors.error);

    if (!targetUser) {
      return interaction.reply({
        embeds: [errorEmbed.setTitle('This user is not a member of this server!')],
        ephemeral: true
      });
    }

    if (targetUser.id === interaction.guild?.ownerId) {
      return interaction.reply({
        embeds: [errorEmbed.setTitle('This user is the owner of this server!')],
        ephemeral: true
      });
    }

    if (targetUser.user.bot) {
      return interaction.reply({
        embeds: [errorEmbed.setTitle('You cannot kick bots!')],
        ephemeral: true
      });
    }

    if (targetUser.id === interaction.user.id) {
      return interaction.reply({
        embeds: [errorEmbed.setTitle('You cannot kick yourself!')],
        ephemeral: true
      });
    }

    if (!interaction.inCachedGuild()) throw new Error('Not in cached guild');

    // Highest role of the target user
    const targetUserRolePosition = targetUser.roles.highest.position;
    // Highest role of the user running the cmd
    const requestUserRolePosition = interaction.member?.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      return interaction.reply({
        embeds: [
          errorEmbed.setTitle(
            'You cannot kick that user because they have the same/higher role than you!'
          )
        ],
        ephemeral: true
      });
    }

    targetUser.kick(reason);

    const fields = [
      {
        name: 'User',
        value: `<@!${targetUser.id}>`,
        inline: true
      },
      {
        name: 'Reason',
        value: reason,
        inline: true
      }
    ];

    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.user.username} has been kicked from the server`)
      .setColor(colors.primary)
      .setThumbnail(targetUser.displayAvatarURL())
      .setFields(fields);

    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
} satisfies Command;

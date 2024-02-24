import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import ms from 'ms';
import { colors } from '../config.js';
import { Command } from '../types.js';

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeouts the user for certain amount of time')
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('User that we want to timeout')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('duration')
        .setDescription('Length of the timeout (1d. 2h, 5m etc.)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for the timeout')
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const duration = interaction.options.getString('duration');
    const targetUser = await interaction.guild?.members.fetch(user?.id || '');

    const errorEmbed = new EmbedBuilder().setColor(colors.error);
    await interaction.deferReply({ ephemeral: true });

    if (!targetUser) {
      return interaction.editReply({
        embeds: [errorEmbed.setTitle('This user is not a member of this server')]
      });
    }

    if (targetUser.id === interaction.guild?.ownerId) {
      return interaction.editReply({
        embeds: [errorEmbed.setTitle('This user is the owner of this server!')]
      });
    }

    if (targetUser.user.bot) {
      return interaction.editReply({
        embeds: [errorEmbed.setTitle('You cannot timeout bots')]
      });
    }

    if (targetUser.id === interaction.user.id) {
      return interaction.editReply({
        embeds: [errorEmbed.setTitle('You cannot timeout yourself')]
      });
    }

    if (!interaction.inCachedGuild()) throw new Error('Not in cached guild');

    // Highest role of the target user
    const targetUserRolePosition = targetUser.roles.highest.position;
    // Highest role of the user running the cmd
    const requestUserRolePosition = interaction.member.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      return interaction.editReply({
        embeds: [
          errorEmbed.setTitle(
            'You cannot timeout that user because they have the same/higher role than you'
          )
        ]
      });
    }

    const msDuration = ms(duration || '');

    if (isNaN(msDuration)) {
      return interaction.editReply({
        embeds: [errorEmbed.setTitle('Invalid duration provided')]
      });
    }

    const seconds28Days = 2.419e6;

    if (msDuration < 5000 || msDuration > seconds28Days) {
      return interaction.editReply({
        embeds: [errorEmbed.setTitle('Duration must be between 5 seconds and 28 days')]
      });
    }

    const { default: prettyMs } = await import('pretty-ms');

    if (targetUser.isCommunicationDisabled()) {
      await targetUser.timeout(msDuration, reason);
      interaction.editReply(
        `Updated time out for <@!${targetUser.id}> reason: ${reason} (${prettyMs(
          msDuration,
          { verbose: true }
        )})`
      );
    }

    await targetUser.timeout(msDuration, reason);

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
      },
      {
        name: 'Duration',
        value: prettyMs(msDuration, {
          verbose: true
        }),
        inline: true
      }
    ];

    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.user.username} has been timed out`)
      .setColor(colors.primary)
      .setThumbnail(targetUser.displayAvatarURL())
      .setFields(fields);

    interaction.editReply({
      embeds: [embed]
    });
  }
} satisfies Command;

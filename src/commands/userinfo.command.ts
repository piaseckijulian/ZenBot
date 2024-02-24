import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { colors, dayjs } from '../config.js';
import { Command } from '../types.js';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Displays info about the user')
    .addUserOption(option =>
      option.setName('target').setDescription('User that we want info about')
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('target') || interaction.user;
    const targetUser = await interaction.guild?.members.fetch(user.id);

    if (!targetUser) {
      const embed = new EmbedBuilder()
        // eslint-disable-next-line quotes
        .setTitle("This user isn't a member of this server!")
        .setColor(colors.error);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const fields = [
      {
        name: 'Username',
        value: targetUser.user.username
      },
      {
        name: 'User ID',
        value: targetUser.id
      },
      {
        name: 'Member since',
        value: `${dayjs(targetUser.joinedTimestamp).format('D MMMM YYYY')} (${dayjs(
          targetUser.joinedTimestamp
        ).fromNow()})`
      }
    ];

    const embed = new EmbedBuilder()
      .setTitle(`Information about ${targetUser.user.username}`)
      .setColor(colors.primary)
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(fields);

    interaction.reply({ embeds: [embed] });
  }
} satisfies Command;

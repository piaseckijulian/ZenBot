import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { colors, dayjs } from '../config';
import { type Command } from '../types';

const userInfoCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Displays info about the user')
    .setDMPermission(false)
    .addUserOption(option =>
      option.setName('target').setDescription('User that we want info about')
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('target') || interaction.user;

    if (!interaction.guild) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('You are not in guild!')
        .setColor(colors.error);

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const targetUser = await interaction.guild.members.fetch(user.id);

    if (!targetUser) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('This user is not a member of this server!')
        .setColor(colors.error);

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const fields = [
      { name: 'Username', value: targetUser.user.username },
      { name: 'User ID', value: targetUser.id },
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
};

export default userInfoCommand;

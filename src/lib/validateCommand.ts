import { type ChatInputCommandInteraction, type User } from 'discord.js';

type Action = 'ban' | 'kick' | 'timeout';

export const validateCommand = async (
  interaction: ChatInputCommandInteraction,
  action: Action,
  user: User
) => {
  if (!interaction.guild || !interaction.inCachedGuild()) {
    return { isValid: false, message: 'You are not in guild!' };
  }

  const targetUser = await interaction.guild.members.fetch(user.id)!;

  if (!targetUser) {
    return {
      isValid: false,
      message: 'This user is not a member of this server!'
    };
  }

  if (targetUser.id === interaction.guild.ownerId) {
    return {
      isValid: false,
      message: 'This user is the owner of this server!'
    };
  }

  if (targetUser.user.bot) {
    return { isValid: false, message: `You cannot ${action} bots!` };
  }

  if (targetUser.id === interaction.user.id) {
    return { isValid: false, message: `You cannot ${action} yourself!` };
  }

  // Highest role of the target user
  const targetUserRolePosition = targetUser.roles.highest.position;
  // Highest role of the user running the cmd
  const requestUserRolePosition = interaction.member.roles.highest.position;

  if (targetUserRolePosition >= requestUserRolePosition) {
    return {
      isValid: false,
      message: `You cannot ${action} that user because they have the same/higher role than you!`
    };
  }

  return {
    isValid: true,
    message: '',
    targetUser
  };
};

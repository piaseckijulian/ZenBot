import type { ChatInputCommandInteraction, User } from "discord.js"

type CheckForErrorsParams = {
  action: "ban" | "kick" | "timeout"
  interaction: ChatInputCommandInteraction
  user: User
}

const validateCommand = async (params: CheckForErrorsParams) => {
  const { action, interaction, user } = params
  const targetUser = await interaction.guild?.members.fetch(user.id)

  if (!targetUser) {
    return {
      error: "This user is not a member of this server!"
    }
  }

  if (!interaction.guild || !interaction.inCachedGuild()) {
    return {
      error: "You are not in guild!"
    }
  }

  if (targetUser.id === interaction.guild.ownerId) {
    return {
      error: "This user is the owner of this server!"
    }
  }

  if (targetUser.user.bot) {
    return {
      error: `You cannot ${action} bots!`
    }
  }

  if (targetUser.id === interaction.user.id) {
    return {
      error: `You cannot ${action} yourself!`
    }
  }

  // Highest role of the target user
  const targetUserRolePosition = targetUser.roles.highest.position
  // Highest role of the user running the command
  const requestUserRolePosition = interaction.member.roles.highest.position

  if (targetUserRolePosition >= requestUserRolePosition) {
    return {
      error: `You cannot ${action} that user because they have the same/higher role than you!`
    }
  }

  return {
    targetUser
  }
}

export default validateCommand

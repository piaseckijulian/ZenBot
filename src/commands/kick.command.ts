import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js"
import { colors } from "../config.js"
import validateCommand from "../lib/validateCommand.js"
import type { Command } from "../types.js"

const kickCommand = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User that we want to kick")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the kick"),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("target")
    const reason =
      interaction.options.getString("reason") || "No reason provided"

    if (!user) return

    const { error, targetUser } = await validateCommand({
      action: "kick",
      interaction,
      user,
    })

    if (error || !targetUser) {
      const errorEmbed = new EmbedBuilder()
        .setTitle(error)
        .setColor(colors.error)

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
    }

    targetUser.kick(reason)

    const fields = [
      { name: "User", value: `<@!${targetUser.id}>`, inline: true },
      { name: "Reason", value: reason, inline: true },
    ]

    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.user.username} has been kicked from the server`)
      .setColor(colors.primary)
      .setThumbnail(targetUser.displayAvatarURL())
      .setFields(fields)

    interaction.reply({ embeds: [embed] })
  },
} satisfies Command

export default kickCommand

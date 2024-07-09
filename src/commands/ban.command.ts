import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js"
import { colors } from "../config.js"
import validateCommand from "../lib/validateCommand.js"
import type { Command } from "../types.js"

const banCommand = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to be banned")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the ban"),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("target")
    const reason =
      interaction.options.getString("reason") || "No reason provided"

    if (!user) return

    const { error, targetUser } = await validateCommand({
      action: "ban",
      user,
      interaction,
    })

    if (error || !targetUser) {
      const errorEmbed = new EmbedBuilder()
        .setTitle(error)
        .setColor(colors.error)

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
    }

    const SECONDS_IN_ONE_WEEK = 60 * 60 * 24 * 7

    targetUser.ban({
      reason,
      deleteMessageSeconds: SECONDS_IN_ONE_WEEK,
    })

    const fields = [
      { name: "User", value: `<@!${targetUser.id}>`, inline: true },
      { name: "Reason", value: reason, inline: true },
    ]

    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.user.username} has been banned from the server`)
      .setColor(colors.primary)
      .setThumbnail(targetUser.displayAvatarURL())
      .setFields(fields)

    interaction.reply({ embeds: [embed] })
  },
} satisfies Command

export default banCommand

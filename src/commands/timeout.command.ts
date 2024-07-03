import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder
} from "discord.js"
import ms from "ms"
import prettyMs from "pretty-ms"
import { colors } from "../config.js"
import validateCommand from "../lib/validateCommand.js"
import type { Command } from "../types.js"

const timeoutCommand = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeouts the user for certain amount of time")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option =>
      option
        .setName("target")
        .setDescription("User that we want to timeout")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("duration")
        .setDescription("Length of the timeout (1d. 2h, 5m etc.)")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason for the timeout")
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("target")
    const reason =
      interaction.options.getString("reason") || "No reason provided"
    const duration = interaction.options.getString("duration")

    if (!user || !duration) return

    const errorEmbed = new EmbedBuilder().setColor(colors.error)
    await interaction.deferReply()

    const { error, targetUser } = await validateCommand({
      action: "timeout",
      interaction,
      user
    })

    if (error || !targetUser) {
      errorEmbed.setTitle(error).setColor(colors.error)

      return interaction.editReply({ embeds: [errorEmbed] })
    }

    const msDuration = ms(duration)

    if (Number.isNaN(msDuration)) {
      return interaction.editReply({
        embeds: [errorEmbed.setTitle("Invalid duration provided")]
      })
    }

    const SECONDS_IN_TWENTY_EIGHT_DAYS = 60 * 60 * 24 * 28

    if (msDuration < 5000 || msDuration > SECONDS_IN_TWENTY_EIGHT_DAYS) {
      return interaction.editReply({
        embeds: [
          errorEmbed.setTitle("Duration must be between 5 seconds and 28 days")
        ]
      })
    }

    if (targetUser.isCommunicationDisabled()) {
      await targetUser.timeout(msDuration, reason)
      interaction.editReply(
        `Updated timeout for <@!${targetUser.id}> | reason: ${reason} (${prettyMs(
          msDuration,
          { verbose: true }
        )})`
      )
    }

    await targetUser.timeout(msDuration, reason)

    const fields = [
      { name: "User", value: `<@!${targetUser.id}>`, inline: true },
      { name: "Reason", value: reason, inline: true },
      {
        name: "Duration",
        value: prettyMs(msDuration, { verbose: true }),
        inline: true
      }
    ]

    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.user.username} has been timed out`)
      .setColor(colors.primary)
      .setThumbnail(targetUser.displayAvatarURL())
      .setFields(fields)

    interaction.editReply({ embeds: [embed] })
  }
} satisfies Command

export default timeoutCommand

import consola from "consola"
import {
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js"
import { colors } from "../config.js"
import type { Command } from "../types.js"

const purgeCommand = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Deletes channel messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of messages to delete")
        .setMinValue(5)
        .setMaxValue(100),
    ),
  async execute(interaction) {
    const { channel } = interaction

    if (channel?.type !== ChannelType.GuildText) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("You are not in text channel!")
        .setColor(colors.error)

      return interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      })
    }

    const amountMessagesToDelete = interaction.options.getInteger("amount") ?? 5

    const embed = new EmbedBuilder()
      .setTitle(`Deleting ${amountMessagesToDelete} messages...`)
      .setColor(colors.primary)

    await interaction.reply({ embeds: [embed], ephemeral: true })

    const messages = await channel.bulkDelete(amountMessagesToDelete, true)

    try {
      const editedEmbed = new EmbedBuilder()
        .setTitle(`Deleted ${messages.size} messages`)
        .setColor(colors.primary)

      await interaction.editReply({ embeds: [editedEmbed] })
    } catch (error) {
      consola.error(`❌ ${error}`)
    }
  },
} satisfies Command

export default purgeCommand

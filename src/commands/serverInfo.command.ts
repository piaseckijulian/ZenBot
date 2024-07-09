import { EmbedBuilder, SlashCommandBuilder } from "discord.js"
import { colors, dayjs } from "../config.js"
import type { Command } from "../types.js"

const serverInfoCommand = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Display info about the server")
    .setDMPermission(false),
  execute(interaction) {
    const guild = interaction.guild

    if (!guild) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("You are not in guild!")
        .setColor(colors.error)

      return interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      })
    }

    const boostTier = guild.premiumTier ? `${guild.premiumTier} Tier` : "None"

    const fields = [
      { name: "Server name", value: `${guild.name}` },
      { name: "Server ID", value: `${guild.id}` },
      { name: "Member count", value: `${guild.memberCount} members` },
      { name: "Owner", value: `<@!${guild.ownerId}>` },
      { name: "Boost tier", value: boostTier },
      {
        name: "Boost count",
        value: `${guild.premiumSubscriptionCount || "0"} boosts`,
      },
      {
        name: "Created on",
        value: `${dayjs(guild.createdTimestamp).format("D MMMM YYYY")} (${dayjs(
          guild.createdTimestamp,
        ).fromNow()})`,
      },
    ]

    const embed = new EmbedBuilder()
      .setTitle("Server Information")
      .setDescription(`Information about the server **${guild.name}**`)
      .setColor(colors.primary)
      .setThumbnail(guild.iconURL())
      .addFields(fields)

    interaction.reply({ embeds: [embed] })
  },
} satisfies Command

export default serverInfoCommand

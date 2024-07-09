import { EmbedBuilder, SlashCommandBuilder } from "discord.js"
import { author, colors } from "../config.js"
import type { Command } from "../types.js"

const authorCommand = {
  data: new SlashCommandBuilder()
    .setName("author")
    .setDescription("Displays information about the bot's author"),
  execute(interaction) {
    const fields = [
      { name: "Name", value: author.name },
      { name: "Username", value: `<@!${author.discordUserId}>` },
      { name: "Website", value: `[Link](${author.websiteUrl})`, inline: true },
      { name: "Github", value: `[Link](${author.githubUrl})`, inline: true },
      { name: "X", value: `[Link](${author.xUrl})`, inline: true },
    ]

    const embed = new EmbedBuilder()
      .setTitle("Author Information")
      .setColor(colors.primary)
      .setThumbnail(author.avatarUrl)
      .addFields(fields)

    interaction.reply({ embeds: [embed] })
  },
} satisfies Command

export default authorCommand

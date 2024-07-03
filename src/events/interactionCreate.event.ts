import consola from "consola"
import { Collection, Events, type Interaction } from "discord.js"
import { COOLDOWN } from "../config.js"
import type { Event } from "../types.js"

const interactionCreateEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)
    const cooldowns = interaction.client.cooldowns

    if (!command) {
      consola.error(
        `❌ No command matching ${interaction.commandName} was found.`
      )

      return
    }

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.data.name)
    const cooldownAmount = COOLDOWN * 1000

    if (!timestamps) return

    if (timestamps.has(interaction.user.id)) {
      const lastUserTimestamp = timestamps.get(interaction.user.id)

      if (!lastUserTimestamp) return

      const expirationTime = lastUserTimestamp + cooldownAmount

      if (now < expirationTime) {
        const expirationTimestamp = Math.round(expirationTime / 1000)

        return interaction.reply({
          content: `Please wait <t:${expirationTimestamp}:R> before reusing the \`${command.data.name}\` command.`,
          ephemeral: true
        })
      }
    }

    timestamps.set(interaction.user.id, now)
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

    try {
      command.execute(interaction)
    } catch (error) {
      const replyMsg = {
        content: "There was an error while executing this command!",
        ephemeral: true
      }

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(replyMsg)
      } else {
        await interaction.reply(replyMsg)
      }

      consola.error(`❌ ${error}`)
    }
  }
} satisfies Event

export default interactionCreateEvent

import consola from 'consola';
import { Collection, Events, type Interaction } from 'discord.js';
import { COOLDOWN } from '../config';
import { type Event } from '../types';

const interactionCreateEvent: Event = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    const { cooldowns } = interaction.client;

    if (!command) {
      consola.error(
        `❌ No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name)!;
    const cooldownAmount = COOLDOWN * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id)! + cooldownAmount;

      if (now < expirationTime) {
        const expirationTimestamp = Math.round(expirationTime / 1000);

        return interaction.reply({
          content: `Please wait <t:${expirationTimestamp}:R> before reusing the \`${command.data.name}\` command.`,
          ephemeral: true
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction);
    } catch (error) {
      const replyMsg = {
        content: 'There was an error while executing this command!',
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred)
        await interaction.followUp(replyMsg);
      else await interaction.reply(replyMsg);

      consola.error(`❌ ${error}`);
    }
  }
};

export default interactionCreateEvent;

import path from "node:path"
import { pathToFileURL } from "node:url"
import consola from "consola"
import {
  type Client,
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes
} from "discord.js"
import { glob } from "glob"
import env from "../env.js"
import { fileDirName } from "../lib/utils.js"
import type { Command } from "../types.js"

const { __dirname } = fileDirName(import.meta.url)

const commandHandler = async (client: Client) => {
  const commandsPath = __dirname.includes("dist")
    ? "./dist/commands/*.command.js"
    : "./src/commands/*.command.ts"

  const rest = new REST().setToken(env.TOKEN)
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []

  const files = (await glob(commandsPath)).map(filePath =>
    path.resolve(filePath)
  )

  const commandPromise = files.map(async file => {
    const commandPath = pathToFileURL(file).href
    const { default: command }: { default: Command } = await import(commandPath)

    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command)
  })

  await Promise.all(commandPromise)

  try {
    // Update Guild Slash Commands
    // await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), {
    //   body: commands
    // });

    // Update Global Slash Commands
    await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
      body: commands
    })

    consola.success("✅ Successfully loaded commands!")
  } catch (error) {
    consola.error(`❌ ${error}`)
  }
}

export default commandHandler

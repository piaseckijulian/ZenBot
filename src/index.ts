import path from "node:path"
import { pathToFileURL } from "node:url"
import { Client, Collection, GatewayIntentBits } from "discord.js"
import { glob } from "glob"
import env from "./env.js"
import { fileDirName } from "./lib/utils.js"

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()
client.cooldowns = new Collection()

const { __dirname } = fileDirName(import.meta.url)

const handlersPath = __dirname.includes("dist")
  ? "./dist/handlers/*.handler.js"
  : "./src/handlers/*.handler.ts"

const files = (await glob(handlersPath)).map(filePath => path.resolve(filePath))

files.map(async file => {
  const handlerPath = pathToFileURL(file).href

  const { default: handler }: { default: (client: Client) => Promise<void> } =
    await import(handlerPath)

  handler(client)
})

client.login(env.TOKEN)

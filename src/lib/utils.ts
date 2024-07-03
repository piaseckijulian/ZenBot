import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

export const fileDirName = (url: string) => {
  const __filename = fileURLToPath(url)
  const __dirname = dirname(__filename)

  return { __dirname, __filename }
}

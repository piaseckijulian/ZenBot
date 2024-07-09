import "dotenv/config"
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

const env = createEnv({
  server: {
    TOKEN: z.string().min(1),
    CLIENT_ID: z.string().min(1),
    AVATAR_URL: z.string().url().min(1),
    // GUILD_ID: z.string().min(1) // Development only
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})

export default env

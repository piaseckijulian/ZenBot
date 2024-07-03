import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime.js"
import env from "./env.js"
import type { Colors } from "./types.js"

dayjs.extend(relativeTime)

export const COOLDOWN = 5 // in seconds

export const author = {
  name: "Julian Piasecki",
  discordUserId: "572116744576172032",
  githubUrl: "https://github.com/piaseckijulian",
  xUrl: "https://x.com/piaseckijulian",
  websiteUrl: "https://julian-portfolio.vercel.app",
  avatarUrl: env.AVATAR_URL
}

export const colors = {
  primary: "#a600ff",
  error: "#cc0000"
} satisfies Colors

export { dayjs }

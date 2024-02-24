import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { config } from 'dotenv';
import { Colors } from './types.js';
config();
dayjs.extend(relativeTime);

export const TOKEN = process.env.TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;
export const GUILD_ID = process.env.GUILD_ID;
export const COOLDOWN = 5; // seconds
export const author = {
  name: 'Julian Piasecki',
  discordUserId: '572116744576172032',
  githubUrl: 'https://github.com/piaseckijulian',
  twitterUrl: 'https://twitter.com/piaseckijulian',
  websiteUrl: 'https://julian-portfolio.vercel.app',
  avatarUrl: process.env.AVATAR_URL
};
export const colors: Colors = {
  primary: '#718dc7',
  error: '#cc0000'
};
export { dayjs };

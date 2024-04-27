import consola from 'consola';
import 'dotenv/config';

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
// const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN) consola.error('❌ TOKEN was not found!');
if (!CLIENT_ID) consola.error('❌ CLIENT_ID was not found!');
// if (!GUILD_ID) consola.error('❌ GUILD_ID was not found');

export {
  // GUILD_ID,
  CLIENT_ID,
  TOKEN
};

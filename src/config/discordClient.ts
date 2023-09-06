import { Client } from 'discord.js';
import 'dotenv/config';
import setStatusForAvailableQuests from '../scripts/setStatusForAvailableQuests';

let client: Client | null;

if (!process.env.DISCORD_TOKEN) {
  client = null;
} else {
  client = new Client({
    intents: ['Guilds'],
  });

  client.on('ready', async () => {
    console.log('Bot Online!');

    await setStatusForAvailableQuests();
  });

  client.login(process.env.DISCORD_TOKEN);
}

export default client;

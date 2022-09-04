import { Client } from 'discord.js';
import 'dotenv/config';
import setStatusForAvailableQuests from '../scripts/setStatusForAvailableQuests';

const token = process.env.DISCORD_TOKEN;
const client = new Client({
  intents: ['GuildMessages', 'Guilds', 'MessageContent'],
});

client.on('ready', async () => {
  console.log('Bot Online!');

  await setStatusForAvailableQuests();
});

client.login(token);

export default client;

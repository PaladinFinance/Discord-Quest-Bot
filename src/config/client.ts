import { Client } from 'discord.js';
import 'dotenv/config';

const token = process.env.DISCORD_TOKEN;
const client = new Client({
  intents: ['GuildMessages', 'Guilds', 'MessageContent'],
});

client.on('ready', () => {
  console.log('Bot Online!');
});

client.login(token);

export default client;

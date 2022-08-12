import { ChannelType } from 'discord.js';
import fs from 'fs';
import client from '../../config/client';

const setTargetChannel = (command: string, dataType: string) => {
  try {
    client.on('messageCreate', async (msg) => {
      const data = JSON.parse(
        fs.readFileSync('./src/data/data.json', {
          encoding: 'utf8',
          flag: 'r',
        }),
      );
      if (data.interactionChannelId !== msg.channel.id) return;
      const args = msg.content.split(' ');
      if (args[0] === command) {
        const expectedNbArgs = 2;
        if (args.length !== expectedNbArgs) {
          msg.reply(`${command} takes ${expectedNbArgs} arguments`);
        } else {
          const channel = client.channels.cache.get(args[1].replace('<#', '').replace('>', ''));
          if (!channel) {
            msg.reply(`${args[1]} is not a valid channel name`);
          } else {
            if (channel.type !== ChannelType.GuildNews) {
              msg.reply(`${args[1]} is not a announcement channel`);
              return;
            }
            data[dataType] = channel.id;
            fs.writeFileSync('./src/data/data.json', JSON.stringify(data));
            msg.reply('target channel set');
            console.log(`${dataType} set to ${data[dataType]}`);
          }
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
};

export default setTargetChannel;

import fs from 'fs';
import getTextChannelIdFromName from '../../scripts/getTextChannelIdFromName';
import client from '../../config/client';

const setTargetChannel = (command: string, dataType: string) => {
  try {
    client.on('messageCreate', (msg) => {
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
          const channelId = getTextChannelIdFromName(args[1]);
          if (!channelId) {
            msg.reply(`${args[1]} is not a valid channel name`);
          } else {
            data[dataType] = getTextChannelIdFromName(args[1]);
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

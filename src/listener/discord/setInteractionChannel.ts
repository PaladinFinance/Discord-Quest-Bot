import fs from 'fs';
import checkHasRole from '../../scripts/checkHasRole';
import client from '../../config/discordClient';

const setInteractionChannel = (command: string, dataType: string, roleNeeded: string) => {
  try {
    client.on('messageCreate', (msg) => {
      if (msg.content === command && checkHasRole(msg, roleNeeded)) {
        const data = JSON.parse(
          fs.readFileSync('./src/data/data.json', { encoding: 'utf8', flag: 'r' }),
        );
        data[dataType] = msg.channel.id;
        fs.writeFileSync('./src/data/data.json', JSON.stringify(data));
        msg.reply('interaction channel set');
        console.log(`${dataType} set to ${msg.channel.id}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

export default setInteractionChannel;

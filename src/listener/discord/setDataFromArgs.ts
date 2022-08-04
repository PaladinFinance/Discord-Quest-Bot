import fs from 'fs';
import client from '../../config/client';

const setDataFromArgs = (
  command: string,
  dataType: string[],
  fallback?: (args: string[]) => any,
) => {
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
      const expectedNbArgs = dataType.length + 1;
      if (args.length !== expectedNbArgs) {
        msg.reply(`${command} takes ${expectedNbArgs} arguments`);
      } else {
        for (let i = 1; i <= dataType.length; ++i) {
          data[dataType[i - 1]] = args[i];
        }
        fs.writeFileSync('./src/data/data.json', JSON.stringify(data));
        fallback?.(args);
        msg.reply('data set');
      }
    }
  });
};

export default setDataFromArgs;

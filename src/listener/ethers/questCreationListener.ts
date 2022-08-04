// eslint-disable-next-line import/no-extraneous-dependencies
import { Listener } from '@ethersproject/abstract-provider';
import schedule from 'node-schedule';
import fs from 'fs';
import client from '../../config/client';
import dateToCron from '../../scripts/dateToCron';
import { ChannelType } from 'discord.js';

const questCreationListener: Listener = (
  questID,
  creator,
  gauge,
  rewardToken,
  duration,
  startPeriod,
  objectiveVotes,
  rewardPerVote,
) => {
  const dateConverted = dateToCron(new Date(startPeriod));
  schedule.scheduleJob(dateConverted, () => {
    const data = JSON.parse(
      fs.readFileSync('./src/data/data.json', {
        encoding: 'utf8',
        flag: 'r',
      }),
    );
    console.log(
      questID,
      creator,
      gauge,
      rewardToken,
      duration,
      startPeriod,
      objectiveVotes,
      rewardPerVote,
    );
    // TODO send embeeded message to the channel
    /*
    const channel = client.channels.cache.get(data.targetChannelId);
    const exampleEmbed = {
      color: 0xffa500,
      title: `New veCRV Quest: ${gauge}`,
      url: 'http://app.warden.vote/quest/',
      description: `rewards are now available on app.warden.vote\n\ncan be captured by users who vote for ${gauge}`,
      timestamp: new Date().toISOString(),
    };
    if (channel?.type === ChannelType.GuildText) channel.send({ embeds: [exampleEmbed] });
    */
  });
};

export default questCreationListener;

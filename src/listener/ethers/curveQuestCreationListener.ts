// eslint-disable-next-line import/no-extraneous-dependencies
import { Listener } from '@ethersproject/abstract-provider';
import schedule from 'node-schedule';
import fs from 'fs';
import client from '../../config/client';
import dateToCron from '../../scripts/dateToCron';
import { ChannelType } from 'discord.js';
import getCurveEmbed from '../../scripts/getCurveEmbed';

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
  try {
    const dateConverted = dateToCron(new Date(startPeriod.toNumber() * 1000));

    schedule.scheduleJob(dateConverted, async () => {
      const data = JSON.parse(
        fs.readFileSync('./src/data/data.json', {
          encoding: 'utf8',
          flag: 'r',
        }),
      );

      const channel = client.channels.cache.get(data.targetChannelId);
      const exampleEmbed = await getCurveEmbed(gauge, rewardToken, objectiveVotes, rewardPerVote);
      if (channel?.type === ChannelType.GuildText) channel.send({ embeds: [exampleEmbed] });
    });
  } catch (err) {
    console.error(err);
  }
};

export default questCreationListener;

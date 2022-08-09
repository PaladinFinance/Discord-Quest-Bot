// eslint-disable-next-line import/no-extraneous-dependencies
import { Listener } from '@ethersproject/abstract-provider';
import fs from 'fs';
import client from '../../config/client';
import { ChannelType } from 'discord.js';
import getBalancerEmbed from '../../scripts/getBalancerEmbed';

const questCreationListener: Listener = async (
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
    const data = JSON.parse(
      fs.readFileSync('./src/data/data.json', {
        encoding: 'utf8',
        flag: 'r',
      }),
    );

    const channel = client.channels.cache.get(data.targetChannelId);
    const exampleEmbed = await getBalancerEmbed(gauge, rewardToken, objectiveVotes, rewardPerVote);
    if (channel?.type === ChannelType.GuildText) channel.send({ embeds: [exampleEmbed] });
  } catch (err) {
    console.error(err);
  }
};

export default questCreationListener;

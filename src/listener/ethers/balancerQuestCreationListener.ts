// eslint-disable-next-line import/no-extraneous-dependencies
import { Listener } from '@ethersproject/abstract-provider';
import fs from 'fs';
import client from '../../config/client';
import { ChannelType } from 'discord.js';
import { getProtocolEmbed, ProtocolType } from '../../scripts/getProtocolEmbed';

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
    const exampleEmbed = await getProtocolEmbed(
      gauge,
      rewardToken,
      objectiveVotes,
      rewardPerVote,
      duration,
      startPeriod,
      ProtocolType.Balancer,
    );
    if (channel?.type === ChannelType.GuildNews) {
      const message = channel.send({ embeds: [exampleEmbed] });
      (await message).crosspost();
    }
  } catch (err) {
    console.error(err);
  }
};

export default questCreationListener;

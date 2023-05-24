// eslint-disable-next-line import/no-extraneous-dependencies
import { Listener } from '@ethersproject/abstract-provider';
import discordClient from '../../config/discordClient';
import twitterClient from '../../config/twitterClient';
import { ChannelType } from 'discord.js';
import { getProtocolEmbed, ProtocolType } from '../../scripts/getProtocolEmbed';
import { BigNumber } from 'ethers';
import getTweet from 'src/scripts/getTweet';
import data from '../../data/data.json';

const questCreationListener =
  (protocolType: ProtocolType): Listener =>
  async (
    questID: BigNumber,
    creator: string,
    gauge: string,
    rewardToken: string,
    duration: BigNumber,
    startPeriod: BigNumber,
    objectiveVotes: BigNumber,
    rewardPerVote: BigNumber,
  ) => {
    try {
      const tweet = await getTweet(gauge, rewardToken, objectiveVotes, rewardPerVote, protocolType);

      await twitterClient.v2.tweet(tweet);

      const embed = await getProtocolEmbed(
        gauge,
        rewardToken,
        objectiveVotes,
        rewardPerVote,
        duration,
        startPeriod,
        protocolType,
      );

      const channels =
        protocolType === ProtocolType.Curve
          ? data.curveTargetChannelIds
          : data.balancerTargetChannelIds;

      channels.forEach(async (channelId: string) => {
        const channel = discordClient.channels.cache.get(channelId);
        if (
          channel &&
          (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildNews)
        ) {
          await channel.send({ embeds: [embed] });
        } else {
          console.error(`Channel ${channelId} not found.`);
        }
      });
      console.log(`New ${protocolType} quest created.`);
    } catch (err) {
      console.error(err);
    }
  };

export default questCreationListener;

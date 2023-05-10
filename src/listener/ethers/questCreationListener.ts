// eslint-disable-next-line import/no-extraneous-dependencies
import { Listener } from '@ethersproject/abstract-provider';
import fs from 'fs';
import client from '../../config/client';
import { ChannelType } from 'discord.js';
import { getProtocolEmbed, ProtocolType } from '../../scripts/getProtocolEmbed';
import { BigNumber } from 'ethers';

const getChannels = (protocol: ProtocolType, data: any): string[] => {
  switch (protocol) {
    case ProtocolType.Balancer:
      return data.balancerTargetChannelIds;
    case ProtocolType.Bunni:
      return data.bunniTargetChannelIds;
    case ProtocolType.Curve:
      return data.curveTargetChannelIds;
    default:
      return [];
  }
}

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
      const data = JSON.parse(
        fs.readFileSync('./src/data/data.json', {
          encoding: 'utf8',
          flag: 'r',
        }),
      );

      const embed = await getProtocolEmbed(
        gauge,
        rewardToken,
        objectiveVotes,
        rewardPerVote,
        duration,
        startPeriod,
        protocolType,
      );

      const channels = getChannels(protocolType, data);

      channels.forEach(async (channelId: string) => {
        const channel = client.channels.cache.get(channelId);
        if (
          channel &&
          (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement)
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

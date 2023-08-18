// eslint-disable-next-line import/no-extraneous-dependencies
import discordClient from '../../config/discordClient';
import twitterClient from '../../config/twitterClient';
import { ChannelType } from 'discord.js';
import { getProtocolEmbed } from '../../scripts/getProtocolEmbed';
import { Listener } from 'ethers';
import getTweet from '../../scripts/getTweet';
import data from '../../data/data.json';
import getSymbolFromGauge from '../../scripts/getSymbolFromGauge';
import getSymbolFromToken from '../../scripts/getSymbolFromToken';
import getDecimalsFromToken from '../../scripts/getDecimalsFromToken';
import getTotalRewardToken from '../../scripts/getTotalRewardToken';
import moment from 'moment';
import getTotalPricePerToken from '../../scripts/getTotalPricePerToken';
import formatRewardPerVote from '../../scripts/formatRewardPerVote';

export enum ProtocolType {
  Curve,
  Balancer,
  Bunni,
}

const getChannels = (protocol: ProtocolType): string[] => {
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
};

const postDiscordMessage = async (
  protocolType: ProtocolType,
  embedColor: number,
  protocolName: string,
  gaugeSymbol: string,
  startPeriodFormatted: string,
  protocolURI: string,
  duration: bigint,
  totalRewardTokenFormatted: string,
  rewardTokenSymbol: string,
  totalPriceFormatted: string,
): Promise<void> => {
  try {
    const embed = await getProtocolEmbed(
      embedColor,
      protocolName,
      gaugeSymbol,
      startPeriodFormatted,
      protocolURI,
      duration,
      totalRewardTokenFormatted,
      rewardTokenSymbol,
      totalPriceFormatted,
    );

    const channels = getChannels(protocolType);

    channels.forEach(async (channelId: string) => {
      const channel = discordClient.channels.cache.get(channelId);
      if (
        channel &&
        (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement)
      ) {
        await channel.send({ embeds: [embed] });
      } else {
        console.error(`Channel ${channelId} not found.`);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

const postTweet = async (
  gaugeSymbol: string,
  totalRewardTokenFormatted: string,
  rewardTokenSymbol: string,
  objectiveVotesFormatted: string,
  rewardPerVoteFormatted: string,
  protocolName: string,
): Promise<void> => {
  try {
    const tweet = getTweet(
      gaugeSymbol,
      totalRewardTokenFormatted,
      rewardTokenSymbol,
      objectiveVotesFormatted,
      rewardPerVoteFormatted,
      protocolName,
    );

    await twitterClient.v2.tweet(tweet);
  } catch (err) {
    console.error(err);
  }
};

const getProtocolName = (protocol: ProtocolType): string => {
  switch (protocol) {
    case ProtocolType.Balancer:
      return 'veBAL';
    case ProtocolType.Curve:
      return 'veCRV';
    case ProtocolType.Bunni:
      return 'veLIT';
    default:
      return '';
  }
};

const getProtocolURI = (protocol: ProtocolType): string => {
  switch (protocol) {
    case ProtocolType.Balancer:
      return 'protocol=bal';
    case ProtocolType.Curve:
      return 'protocol=crv';
    case ProtocolType.Bunni:
      return 'protocol=lit';
    default:
      return '';
  }
};

const getEmbedColor = (protocol: ProtocolType): number => {
  switch (protocol) {
    case ProtocolType.Balancer:
      return 0x00000;
    case ProtocolType.Curve:
      return 0xfffff;
    case ProtocolType.Bunni:
      return 0x800080;
    default:
      return 0x00000;
  }
};

const questCreationListener =
  (protocolType: ProtocolType): Listener =>
  async (
    questID: bigint,
    creator: string,
    gauge: string,
    rewardToken: string,
    duration: bigint,
    startPeriod: bigint,
    objectiveVotes: bigint,
    rewardPerVote: bigint,
  ) => {
    console.log(`Quest ${questID} created by ${creator} on ${protocolType}`);
    try {
      const gaugeSymbol = await getSymbolFromGauge(gauge, protocolType);
      const rewardTokenSymbol = await getSymbolFromToken(rewardToken);
      const rewardTokenDecimals = await getDecimalsFromToken(rewardToken);
      const totalRewardToken = getTotalRewardToken(
        objectiveVotes,
        rewardPerVote,
        rewardTokenDecimals,
      );
      const protocolName = getProtocolName(protocolType);
      const totalRewardTokenFormatted = totalRewardToken
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const objectiveVotesFormatted = (objectiveVotes / 10n ** 18n)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const totalPrice = await getTotalPricePerToken(totalRewardToken, rewardToken);
      const rewardPerVoteFormatted = formatRewardPerVote(rewardPerVote);
      const protocolURI = getProtocolURI(protocolType);
      const embedColor = getEmbedColor(protocolType);
      const startPeriodFormatted = moment.unix(Number(startPeriod)).format('D MMMM YYYY');
      const totalPriceFormatted = totalPrice
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      await Promise.all([
        postDiscordMessage(
          protocolType,
          embedColor,
          protocolName,
          gaugeSymbol,
          startPeriodFormatted,
          protocolURI,
          duration,
          totalRewardTokenFormatted,
          rewardTokenSymbol,
          totalPriceFormatted,
        ),
        postTweet(
          gaugeSymbol,
          totalRewardTokenFormatted,
          rewardTokenSymbol,
          objectiveVotesFormatted,
          rewardPerVoteFormatted,
          protocolName,
        ),
      ]);
    } catch (err) {
      console.error(err);
    }
  };

export default questCreationListener;

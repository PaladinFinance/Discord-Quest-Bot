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

export enum ProtocolType {
  Curve,
  Balancer,
}

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
    const tweet = await getTweet(
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

const formatRewardPerVote = (rewardPerVote: bigint): string => {
  const rewardPerVoteString = rewardPerVote.toString();

  let indexBefore0s = 0;
  for (let i = rewardPerVoteString.length - 1; i >= 0; i--) {
    if (rewardPerVoteString[i] !== '0') {
      indexBefore0s = i + 1;
      break;
    }
  }
  let rewardPerVoteFormatted =
    18 - rewardPerVoteString.length < 0
      ? rewardPerVoteString.substring(0, indexBefore0s) +
        '0'.repeat(rewardPerVoteString.length - 18)
      : '0'.repeat(18 - rewardPerVoteString.length) +
        rewardPerVoteString.substring(0, indexBefore0s);

  const indexToInsertDot =
    rewardPerVoteString.length - 18 < 0 ? 0 : rewardPerVoteString.length - 18;
  rewardPerVoteFormatted =
    rewardPerVoteFormatted.slice(0, indexToInsertDot) +
    '.' +
    rewardPerVoteFormatted.slice(indexToInsertDot);
  if (rewardPerVoteString.length - 18 <= 0) {
    rewardPerVoteFormatted = '0' + rewardPerVoteFormatted;
  }
  return rewardPerVoteFormatted;
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
      const protocolName = protocolType === ProtocolType.Curve ? 'veCRV' : 'veBAL';
      const totalRewardTokenFormatted = totalRewardToken
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const objectiveVotesFormatted = (objectiveVotes / (10n**18n))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const totalPrice = await getTotalPricePerToken(totalRewardToken, rewardToken);
      const rewardPerVoteFormatted = formatRewardPerVote(rewardPerVote);
      const protocolURI = protocolType === ProtocolType.Curve ? 'protocol=crv' : 'protocol=bal';
      const embedColor = protocolType === ProtocolType.Curve ? 0xfffff : 0x00000;
      const startPeriodFormatted = moment.unix(Number(startPeriod)).format('D MMMM YYYY');
      const totalPriceFormatted = totalPrice
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      await Promise.all([postDiscordMessage(
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
      ), postTweet(
        gaugeSymbol,
        totalRewardTokenFormatted,
        rewardTokenSymbol,
        objectiveVotesFormatted,
        rewardPerVoteFormatted,
        protocolName,
      )]);
    } catch (err) {
      console.error(err);
    }
  };

export default questCreationListener;

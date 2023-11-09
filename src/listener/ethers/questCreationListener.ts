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
import { ProtocolType } from '../../type/protocolType';
import getQuestPeriod from '../../scripts/getQuestPeriods';
import { QuestType } from '../../type/questType';

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
  questType: QuestType,
  embedColor: number,
  protocolName: string,
  questTypeName: string,
  gaugeSymbol: string,
  startPeriodFormatted: string,
  protocolURI: string,
  duration: bigint,
  minTotalRewardTokenFormatted: string,
  maxTotalRewardTokenFormatted: string,
  rewardTokenSymbol: string,
  minTotalPriceFormatted: string,
  maxTotalPriceFormatted: string,
): Promise<void> => {
  if (!discordClient) return;
  try {
    const embed = getProtocolEmbed(
      embedColor,
      protocolName,
      questType,
      questTypeName,
      gaugeSymbol,
      startPeriodFormatted,
      protocolURI,
      duration,
      minTotalRewardTokenFormatted,
      maxTotalRewardTokenFormatted,
      rewardTokenSymbol,
      minTotalPriceFormatted,
      maxTotalPriceFormatted,
    );

    const channels = getChannels(protocolType);

    channels.forEach(async (channelId: string) => {
      const channel = discordClient!.channels.cache.get(channelId);
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
  minTotalRewardTokenFormatted: string,
  maxTotalRewardTokenFormatted: string,
  rewardTokenSymbol: string,
  minObjectiveVotesFormatted: string,
  maxObjectiveVotesFormatted: string,
  minRewardPerVoteFormatted: string,
  maxRewardPerVoteFormatted: string,
  protocolName: string,
  questType: QuestType,
  questTypeName: string,
): Promise<void> => {
  if (!twitterClient) return;
  try {
    const tweet = getTweet(
      gaugeSymbol,
      minTotalRewardTokenFormatted,
      maxTotalRewardTokenFormatted,
      rewardTokenSymbol,
      minObjectiveVotesFormatted,
      maxObjectiveVotesFormatted,
      minRewardPerVoteFormatted,
      maxRewardPerVoteFormatted,
      protocolName,
      questType,
      questTypeName,
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

const getQuestTypeName = (questType: QuestType): string => {
  switch (questType) {
    case QuestType.Fixe:
      return 'Fixed';
    case QuestType.Range:
      return 'Ranged';
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
  (protocolType: ProtocolType, questBoardAddress: string): Listener =>
  async (
    questID: bigint,
    creator: string,
    gauge: string,
    rewardToken: string,
    duration: bigint,
    startPeriod: bigint,
  ) => {
    console.log(`Quest ${questID} created by ${creator} on ${protocolType}`);
    try {
      const periods = await getQuestPeriod(questBoardAddress, questID);
      const latestPeriod = periods[periods.length - 1];

      const maxObjectiveVotes = latestPeriod.maxObjectiveVotes;
      const maxRewardPerVote = latestPeriod.maxRewardPerVote;
      const minObjectiveVotes = latestPeriod.minObjectiveVotes;
      const minRewardPerVote = latestPeriod.minRewardPerVote;

      const questType = minRewardPerVote == maxRewardPerVote ? QuestType.Fixe : QuestType.Range;

      const gaugeSymbol = await getSymbolFromGauge(gauge, protocolType);
      const rewardTokenSymbol = await getSymbolFromToken(rewardToken);
      const rewardTokenDecimals = await getDecimalsFromToken(rewardToken);
      const minTotalRewardToken = getTotalRewardToken(
        minObjectiveVotes,
        minRewardPerVote,
        rewardTokenDecimals,
      );
      const maxTotalRewardToken = getTotalRewardToken(
        maxObjectiveVotes,
        maxRewardPerVote,
        rewardTokenDecimals,
      );
      const protocolName = getProtocolName(protocolType);
      const questTypeName = getQuestTypeName(questType);
      const minTotalRewardTokenFormatted = minTotalRewardToken.toLocaleString();
      const maxTotalRewardTokenFormatted = maxTotalRewardToken.toLocaleString();
      const minObjectiveVotesFormatted = (minObjectiveVotes / 10n ** 18n).toLocaleString();
      const maxObjectiveVotesFormatted = (maxObjectiveVotes / 10n ** 18n).toLocaleString();
      const minTotalPrice = await getTotalPricePerToken(minTotalRewardToken, rewardToken);
      const maxTotalPrice = await getTotalPricePerToken(maxTotalRewardToken, rewardToken);
      const minRewardPerVoteFormatted = formatRewardPerVote(minRewardPerVote);
      const maxRewardPerVoteFormatted = formatRewardPerVote(maxRewardPerVote);
      const protocolURI = getProtocolURI(protocolType);
      const embedColor = getEmbedColor(protocolType);
      const startPeriodFormatted = moment.unix(Number(startPeriod)).format('D MMMM YYYY');
      const minTotalPriceFormatted = minTotalPrice.toFixed(2).toLocaleString();
      const maxTotalPriceFormatted = maxTotalPrice.toFixed(2).toLocaleString();

      await Promise.all([
        postDiscordMessage(
          protocolType,
          questType,
          embedColor,
          protocolName,
          questTypeName,
          gaugeSymbol,
          startPeriodFormatted,
          protocolURI,
          duration,
          minTotalRewardTokenFormatted,
          maxTotalRewardTokenFormatted,
          rewardTokenSymbol,
          minTotalPriceFormatted,
          maxTotalPriceFormatted,
        ),
        postTweet(
          gaugeSymbol,
          minTotalRewardTokenFormatted,
          maxTotalRewardTokenFormatted,
          rewardTokenSymbol,
          minObjectiveVotesFormatted,
          maxObjectiveVotesFormatted,
          minRewardPerVoteFormatted,
          maxRewardPerVoteFormatted,
          protocolName,
          questType,
          questTypeName,
        ),
      ]);
    } catch (err) {
      console.error(err);
    }
  };

export default questCreationListener;

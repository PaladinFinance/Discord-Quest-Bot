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
    case ProtocolType.Fx:
      return data.fxTargetChannelIds;
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
  totalRewardTokenFormatted: string,
  rewardTokenSymbol: string,
  totalPriceFormatted: string,
  minRewardPerVoteFormatted: string,
  maxRewardPerVoteFormatted: string,
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
      totalRewardTokenFormatted,
      rewardTokenSymbol,
      totalPriceFormatted,
      minRewardPerVoteFormatted,
      maxRewardPerVoteFormatted,
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
  totalRewardTokenFormatted: string,
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
      totalRewardTokenFormatted,
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
    case ProtocolType.Fx:
      return 'veFXN';
    default:
      return '';
  }
};

const getProtocolURI = (protocol: ProtocolType): string => {
  switch (protocol) {
    case ProtocolType.Balancer:
      return 'bal';
    case ProtocolType.Curve:
      return 'crv';
    case ProtocolType.Bunni:
      return 'lit';
    case ProtocolType.Fx:
      return 'fxn';
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
    case ProtocolType.Fx:
      return 0xff0000;
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
      const totalRewardToken = getTotalRewardToken(
        maxObjectiveVotes,
        maxRewardPerVote,
        rewardTokenDecimals,
      );
      const protocolName = getProtocolName(protocolType);
      const questTypeName = getQuestTypeName(questType);
      const totalRewardTokenFormatted = totalRewardToken.toLocaleString();
      const minObjectiveVotesFormatted = (minObjectiveVotes / 10n ** 18n).toLocaleString();
      const maxObjectiveVotesFormatted = (maxObjectiveVotes / 10n ** 18n).toLocaleString();
      const totalPrice = await getTotalPricePerToken(totalRewardToken, rewardToken);
      const minRewardPerVoteFormatted = formatRewardPerVote(minRewardPerVote, rewardTokenDecimals);
      const maxRewardPerVoteFormatted = formatRewardPerVote(maxRewardPerVote, rewardTokenDecimals);
      const protocolURI = getProtocolURI(protocolType);
      const embedColor = getEmbedColor(protocolType);
      const startPeriodFormatted = moment.unix(Number(startPeriod)).format('D MMMM YYYY');
      const totalPriceFormatted = totalPrice.toFixed(2).toLocaleString();

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
          totalRewardTokenFormatted,
          rewardTokenSymbol,
          totalPriceFormatted,
          minRewardPerVoteFormatted,
          maxRewardPerVoteFormatted,
        ),
        postTweet(
          gaugeSymbol,
          totalRewardTokenFormatted,
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

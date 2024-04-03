import { APIEmbed } from 'discord.js';
import { QuestType } from '../type/questType';

export const getProtocolEmbed = (
  embedColor: number,
  protocolName: string,
  questType: QuestType,
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
): APIEmbed => {
  const exampleEmbed: APIEmbed = {
    color: embedColor,
    title: `New ${protocolName} ${questTypeName} Quest: ${gaugeSymbol}`,
    url: `https://quest.paladin.vote/#/${protocolURI}`,
    description: `Starting ${startPeriodFormatted} for ${duration.toString()} weeks\n\n`,
    fields: [
      {
        name: ':coin: Amount',
        value: `${totalRewardTokenFormatted} ${rewardTokenSymbol}`,
        inline: true,
      },
      {
        name: ':moneybag: USD Value',
        value: `$${totalPriceFormatted}`,
        inline: true,
      },
      {
        name: ':chart_with_upwards_trend: Reward per Vote',
        value:
          questType == QuestType.Fixe
            ? `${minRewardPerVoteFormatted} ${rewardTokenSymbol}`
            : `${minRewardPerVoteFormatted} - ${maxRewardPerVoteFormatted} ${rewardTokenSymbol}`,
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
  };
  return exampleEmbed;
};

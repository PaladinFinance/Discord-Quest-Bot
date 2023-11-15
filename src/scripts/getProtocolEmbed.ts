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
  minTotalRewardTokenFormatted: string,
  maxTotalRewardTokenFormatted: string,
  rewardTokenSymbol: string,
  minTotalPriceFormatted: string,
  maxTotalPriceFormatted: string,
): APIEmbed => {
  const exampleEmbed: APIEmbed = {
    color: embedColor,
    title: `New ${protocolName} ${questTypeName} Quest: ${gaugeSymbol}`,
    url: `https://quest.paladin.vote/#/${protocolURI}`,
    description: `Starting ${startPeriodFormatted} for ${duration.toString()} weeks\n\n`,
    fields: [
      {
        name: ':coin: Amount',
        value:
          questType == QuestType.Fixe
            ? `${minTotalRewardTokenFormatted} ${rewardTokenSymbol}`
            : `${minTotalRewardTokenFormatted} - ${maxTotalRewardTokenFormatted} ${rewardTokenSymbol}`,
        inline: true,
      },
      {
        name: ':moneybag: USD Value',
        value:
          questType == QuestType.Fixe
            ? `$${minTotalPriceFormatted}`
            : `$${minTotalPriceFormatted} - $${maxTotalPriceFormatted}`,
        inline: true,
      },
      {
        name: ':page_with_curl: Gauge',
        value: `${gaugeSymbol}`,
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
  };
  return exampleEmbed;
};

import { APIEmbed } from 'discord.js';

export const getProtocolEmbed = (
  embedColor: number,
  protocolName: string,
  gaugeSymbol: string,
  startPeriodFormatted: string,
  protocolURI: string,
  duration: bigint,
  totalRewardTokenFormatted: string,
  rewardTokenSymbol: string,
  totalPriceFormatted: string,
): APIEmbed => {
  const exampleEmbed: APIEmbed = {
    color: embedColor,
    title: `New ${protocolName} Quest: ${gaugeSymbol}`,
    url: `http://app.warden.vote/quest/?${protocolURI}`,
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
        name: ':page_with_curl: Gauge',
        value: `${gaugeSymbol}`,
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
  };
  return exampleEmbed;
};

import { APIEmbed } from 'discord.js';
import { BigNumber } from 'ethers';
import getSymbolFromGauge from './getSymbolFromGauge';
import getSymbolFromToken from './getSymbolFromToken';
import getTotalPricePerToken from './getTotalPricePerToken';
import getTotalRewardToken from './getTotalRewardToken';
import getDecimalsFromToken from './getDecimalsFromToken';
import moment from 'moment';

export enum ProtocolType {
  Curve,
  Balancer,
  Bunni,
}

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

export const getProtocolEmbed = async (
  gauge: string,
  rewardToken: string,
  objectiveVotes: BigNumber,
  rewardPerVote: BigNumber,
  duration: BigNumber,
  startPeriod: BigNumber,
  protocol: ProtocolType,
): Promise<APIEmbed> => {
  const gaugeSymbol = await getSymbolFromGauge(gauge, protocol);
  const rewardTokenSymbol = await getSymbolFromToken(rewardToken);
  const rewardTokenDecimals = await getDecimalsFromToken(rewardToken);
  const totalRewardToken = getTotalRewardToken(objectiveVotes, rewardPerVote, rewardTokenDecimals);
  const totalPrice = await getTotalPricePerToken(totalRewardToken, rewardToken);
  const protocolName = getProtocolName(protocol);
  const protocolURI = getProtocolURI(protocol);
  const embedColor = getEmbedColor(protocol);
  const totalRewardTokenFormatted = totalRewardToken
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const statPeriodFormatted = moment.unix(startPeriod.toNumber()).format('D MMMM YYYY');
  const totalPriceFormatted = totalPrice
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const exampleEmbed: APIEmbed = {
    color: embedColor,
    title: `New ${protocolName} Quest: ${gaugeSymbol}`,
    url: `http://app.warden.vote/quest/?${protocolURI}`,
    description: `Starting ${statPeriodFormatted} for ${duration.toString()} weeks\n\n`,
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

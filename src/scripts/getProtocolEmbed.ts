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
}

export const getProtocolEmbed = async (
  gauge: string,
  rewardToken: string,
  objectiveVotes: BigNumber,
  rewardPerVote: BigNumber,
  duration: BigNumber,
  startPeriod: BigNumber,
  protocol: ProtocolType,
): Promise<APIEmbed> => {
  const gaugeSymbol = await getSymbolFromGauge(gauge).then(g => g.replace('-gauge', ''));
  const rewardTokenSymbol = await getSymbolFromToken(rewardToken);
  const rewardTokenDecimals = await getDecimalsFromToken(rewardToken);
  const totalRewardToken = getTotalRewardToken(objectiveVotes, rewardPerVote, rewardTokenDecimals);
  const totalPrice = await getTotalPricePerToken(totalRewardToken, rewardToken);
  const protocolName = protocol === ProtocolType.Curve ? 'veCRV' : 'veBAL';
  const protocolURI = protocol === ProtocolType.Curve ? 'protocol=crv' : 'protocol=bal';
  const embedColor = protocol === ProtocolType.Curve ? 0xfffff : 0x00000;
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

import { APIEmbed } from 'discord.js';
import { BigNumber } from 'ethers';
import getSymbolFromGauge from './getSymbolFromGauge';
import getSymbolFromToken from './getSymbolFromToken';
import getTotalPricePerToken from './getTotalPricePerToken';
import getTotalRewardToken from './getTotalRewardToken';
import getDecimalsFromToken from './getDecimalsFromToken';

export enum ProtocolType {
  Curve,
  Balancer,
}

export const getProtocolEmbed = async (
  gauge: string,
  rewardToken: string,
  objectiveVotes: BigNumber,
  rewardPerVote: BigNumber,
  protocol: ProtocolType,
): Promise<APIEmbed> => {
  const gaugeSymbol = await getSymbolFromGauge(gauge);
  const rewardTokenSymbol = await getSymbolFromToken(rewardToken);
  const rewardTokenDecimals = await getDecimalsFromToken(rewardToken);
  const totalRewardToken = getTotalRewardToken(objectiveVotes, rewardPerVote, rewardTokenDecimals);
  const totalPrice = await getTotalPricePerToken(totalRewardToken, rewardToken);
  const protocolName = protocol === ProtocolType.Curve ? 'veCRV' : 'veBAL';
  const protocolURI = protocol === ProtocolType.Curve ? 'protocol=crv' : 'protocol=bal';

  const exampleEmbed = {
    color: 0xfffff,
    title: `New ${protocolName} Quest: ${gaugeSymbol}`,
    url: `http://app.warden.vote/quest/?${protocolURI}`,
    description: `$${rewardTokenSymbol} rewards are now available on app.warden.vote\n\n${totalRewardToken
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} $${rewardTokenSymbol} ($${totalPrice
      .toFixed(3)
      .toString()
      .replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ',',
      )}) can be captured by users who vote for ${gaugeSymbol}`,
    timestamp: new Date().toISOString(),
  };
  return exampleEmbed;
};

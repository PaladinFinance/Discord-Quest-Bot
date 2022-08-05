import { APIEmbed } from 'discord.js';
import { BigNumber } from 'ethers';
import getSymbolFromGauge from './getSymbolFromGauge';
import getSymbolFromToken from './getSymbolFromToken';
import getTotalPricePerToken from './getTotalPricePerToken';
import getTotalRewardToken from './getTotalRewardToken';

const getCurveEmbed = async (
  gauge: string,
  rewardToken: string,
  objectiveVotes: BigNumber,
  rewardPerVote: BigNumber,
): Promise<APIEmbed> => {
  const gaugeSymbol = await getSymbolFromGauge(gauge);
  const rewardTokenSymbol = await getSymbolFromToken(rewardToken);
  const totalRewardToken = getTotalRewardToken(objectiveVotes, rewardPerVote);
  const totalPrice = await getTotalPricePerToken(totalRewardToken, rewardToken);

  const exampleEmbed = {
    color: 0xfffff,
    title: `New veCRV Quest: ${gaugeSymbol}`,
    url: 'http://app.warden.vote/quest/',
    description: `$${rewardTokenSymbol} rewards are now available on app.warden.vote\n\n${totalRewardToken.toString()} $${rewardTokenSymbol} ($${totalPrice.toFixed(
      3,
    )}) can be captured by users who vote for ${gaugeSymbol}`,
    timestamp: new Date().toISOString(),
  };
  return exampleEmbed;
};

export default getCurveEmbed;

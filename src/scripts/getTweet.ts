import { BigNumber } from 'ethers';
import { ProtocolType } from './getProtocolEmbed';
import getSymbolFromGauge from './getSymbolFromGauge';
import getSymbolFromToken from './getSymbolFromToken';
import getDecimalsFromToken from './getDecimalsFromToken';
import getTotalRewardToken from './getTotalRewardToken';
import getTotalPricePerToken from './getTotalPricePerToken';
import moment from 'moment';

const getTweet = async (
  gauge: string,
  rewardToken: string,
  objectiveVotes: BigNumber,
  rewardPerVote: BigNumber,
  startPeriod: BigNumber,
  protocol: ProtocolType,
): Promise<string> => {
  const gaugeSymbol = await getSymbolFromGauge(gauge, protocol);
  const rewardTokenSymbol = await getSymbolFromToken(rewardToken);
  const rewardTokenDecimals = await getDecimalsFromToken(rewardToken);
  const totalRewardToken = getTotalRewardToken(objectiveVotes, rewardPerVote, rewardTokenDecimals);
  const totalPrice = await getTotalPricePerToken(totalRewardToken, rewardToken);
  const protocolName = protocol === ProtocolType.Curve ? 'veCRV' : 'veBAL';
  const protocolURI = protocol === ProtocolType.Curve ? 'protocol=crv' : 'protocol=bal';
  const totalRewardTokenFormatted = totalRewardToken
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const statPeriodFormatted = moment.unix(startPeriod.toNumber()).format('D MMMM YYYY');
  const totalPriceFormatted = totalPrice
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let result = `The ${gaugeSymbol} is requesting ${objectiveVotes} and pay ${totalRewardTokenFormatted} ${rewardTokenSymbol} - ${totalPriceFormatted}$`;
  return result;
};

export default getTweet;

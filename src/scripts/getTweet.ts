import { BigNumber } from 'ethers';
import { ProtocolType } from './getProtocolEmbed';
import getSymbolFromGauge from './getSymbolFromGauge';
import getSymbolFromToken from './getSymbolFromToken';
import getDecimalsFromToken from './getDecimalsFromToken';
import getTotalRewardToken from './getTotalRewardToken';

const formatRewardPerVote = (rewardPerVote: BigNumber): string => {
  // TODO refactr this as it's really really bad code
  const rewardPerVoteString = rewardPerVote.toString();

  let indexBefore0s = 0;
  for (let i = rewardPerVoteString.length - 1; i >= 0; i--) {
    if (rewardPerVoteString[i] !== '0') {
      indexBefore0s = i + 1;
      break;
    }
  }
  let rewardPerVoteFormatted =
    18 - rewardPerVoteString.length < 0
      ? rewardPerVoteString.substring(0, indexBefore0s) +
        '0'.repeat(rewardPerVoteString.length - 18)
      : '0'.repeat(18 - rewardPerVoteString.length) +
        rewardPerVoteString.substring(0, indexBefore0s);

  const indexToInsertDot =
    rewardPerVoteString.length - 18 < 0 ? 0 : rewardPerVoteString.length - 18;
  rewardPerVoteFormatted =
    rewardPerVoteFormatted.slice(0, indexToInsertDot) +
    '.' +
    rewardPerVoteFormatted.slice(indexToInsertDot);
  if (rewardPerVoteString.length - 18 <= 0) {
    rewardPerVoteFormatted = '0' + rewardPerVoteFormatted;
  }
  return rewardPerVoteFormatted;
};

const getTweet = async (
  gauge: string,
  rewardToken: string,
  objectiveVotes: BigNumber,
  rewardPerVote: BigNumber,
  protocol: ProtocolType,
): Promise<string> => {
  const gaugeSymbol = await getSymbolFromGauge(gauge, protocol);
  const rewardTokenSymbol = await getSymbolFromToken(rewardToken);
  const rewardTokenDecimals = await getDecimalsFromToken(rewardToken);
  const totalRewardToken = getTotalRewardToken(objectiveVotes, rewardPerVote, rewardTokenDecimals);
  const protocolName = protocol === ProtocolType.Curve ? 'veCRV' : 'veBAL';
  const totalRewardTokenFormatted = totalRewardToken
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const objectiveVotesFormatted = objectiveVotes
    .div(BigNumber.from(10).pow(18))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rewardPerVoteFormatted = formatRewardPerVote(rewardPerVote);

  let result = `New Quest for: ${gaugeSymbol} gauge!\n${totalRewardTokenFormatted} $${rewardTokenSymbol} is available for ${objectiveVotesFormatted} $${protocolName} at ${rewardPerVoteFormatted} $${rewardTokenSymbol} / $${protocolName}.`;
  return result;
};

export default getTweet;

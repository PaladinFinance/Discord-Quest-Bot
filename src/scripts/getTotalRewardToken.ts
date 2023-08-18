import { WeiPerEther } from 'ethers';
import bigintToDecimalString from './bigintToDecimalString';

const getTotalRewardToken = (
  objectiveVotes: bigint,
  rewardPerVote: bigint,
  rewardDecimals: bigint,
): number => {
  try {
    return Number(bigintToDecimalString((objectiveVotes * rewardPerVote) / WeiPerEther, rewardDecimals));
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export default getTotalRewardToken;

import { WeiPerEther } from 'ethers';
import bigintToDecimal from './bigintToDecimal';

const getTotalRewardToken = (
  objectiveVotes: bigint,
  rewardPerVote: bigint,
  rewardDecimals: bigint,
): number => {
  try {
    return bigintToDecimal((objectiveVotes * rewardPerVote) / WeiPerEther, rewardDecimals);
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export default getTotalRewardToken;

import { WeiPerEther } from 'ethers';

const getTotalRewardToken = (
  objectiveVotes: bigint,
  rewardPerVote: bigint,
  rewardDecimals: bigint,
): bigint => {
  try {
    return objectiveVotes
      * rewardPerVote
      / (10n ** rewardDecimals)
      / WeiPerEther;
  } catch (err) {
    console.error(err);
    return BigInt(0);
  }
};

export default getTotalRewardToken;

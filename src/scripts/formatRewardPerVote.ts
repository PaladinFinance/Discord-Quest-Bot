import { ethers } from 'ethers';

const formatRewardPerVote = (rewardPerVote: bigint, decimals: bigint): string => {
  return ethers.formatUnits(rewardPerVote, decimals);
}

export default formatRewardPerVote;

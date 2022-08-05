import { BigNumber } from 'ethers';

const getTotalRewardToken = (objectiveVotes: BigNumber, rewardPerVote: BigNumber): BigNumber => {
  return objectiveVotes
    .mul(rewardPerVote)
    .div(BigNumber.from(10).pow(18))
    .div(BigNumber.from(10).pow(18));
};

export default getTotalRewardToken;

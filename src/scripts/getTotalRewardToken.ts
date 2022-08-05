import { BigNumber } from 'ethers';

const getTotalRewardToken = (objectiveVotes: BigNumber, rewardPerVote: BigNumber): BigNumber => {
  try {
    return objectiveVotes
      .mul(rewardPerVote)
      .div(BigNumber.from(10).pow(18))
      .div(BigNumber.from(10).pow(18));
  } catch (err) {
    console.error(err);
    return BigNumber.from(0);
  }
};

export default getTotalRewardToken;

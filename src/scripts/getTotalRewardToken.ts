import { BigNumber, constants } from 'ethers';

const getTotalRewardToken = (
  objectiveVotes: BigNumber,
  rewardPerVote: BigNumber,
  rewardDecimals: BigNumber,
): BigNumber => {
  try {
    return objectiveVotes
      .mul(rewardPerVote)
      .div(BigNumber.from(10).pow(rewardDecimals))
      .div(constants.WeiPerEther);
  } catch (err) {
    console.error(err);
    return BigNumber.from(0);
  }
};

export default getTotalRewardToken;

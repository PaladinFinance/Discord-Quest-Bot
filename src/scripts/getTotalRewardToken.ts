import bigintToDecimal from './bigintToDecimal';

const getTotalRewardToken = (
  rewardAmountPerPeriod: bigint,
  duration: bigint,
  rewardDecimals: bigint,
): number => {
  try {
    return bigintToDecimal(rewardAmountPerPeriod * duration, rewardDecimals);
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export default getTotalRewardToken;

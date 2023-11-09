import { QuestType } from 'src/type/questType';

const getTweet = (
  gaugeSymbol: string,
  minTotalRewardTokenFormatted: string,
  maxTotalRewardTokenFormatted: string,
  rewardTokenSymbol: string,
  minObjectiveVotesFormatted: string,
  maxObjectiveVotesFormatted: string,
  minRewardPerVoteFormatted: string,
  maxRewardPerVoteFormatted: string,
  protocolName: string,
  questType: QuestType,
  questTypeName: string,
): string => {
  let result =
    questType == QuestType.Fixe
      ? `New ${questTypeName} Quest for: ${gaugeSymbol} gauge!\n${minTotalRewardTokenFormatted} $${rewardTokenSymbol} is available for ${minObjectiveVotesFormatted} $${protocolName} at ${minRewardPerVoteFormatted} $${rewardTokenSymbol} / $${protocolName}.`
      : `New ${questTypeName} Quest for: ${gaugeSymbol} gauge!\n${minTotalRewardTokenFormatted} - ${maxTotalRewardTokenFormatted} $${rewardTokenSymbol} is available for ${minObjectiveVotesFormatted} - ${maxObjectiveVotesFormatted} $${protocolName} at ${minRewardPerVoteFormatted} - ${maxRewardPerVoteFormatted} $${rewardTokenSymbol} / $${protocolName}.`;
  return result;
};

export default getTweet;

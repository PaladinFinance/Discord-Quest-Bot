const formatRewardPerVote = (rewardPerVote: bigint): string => {
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

  export default formatRewardPerVote;
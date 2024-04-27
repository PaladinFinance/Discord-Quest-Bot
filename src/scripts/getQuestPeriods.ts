import { Contract } from 'ethers';
import provider from '../config/etherProvider';
import QuestBoardAbi from '../data/abi/QuestBoardAbi.json';
import { ChainIds } from '../globals/chainIds';

enum PeriodState {
  ZERO,
  ACTIVE,
  CLOSED,
  DISTRIBUTED,
}

type QuestPeriod = {
  // Total reward amount that can be distributed for that period
  rewardAmountPerPeriod: bigint;
  // Min Amount of reward for each vote (for 1 veToken)
  minRewardPerVote: bigint;
  // Max Amount of reward for each vote (for 1 veToken)
  maxRewardPerVote: bigint;
  // Min Target Bias for the Gauge
  minObjectiveVotes: bigint;
  // Max Target Bias for the Gauge
  maxObjectiveVotes: bigint;
  // Amount of reward to distribute, at period closing
  rewardAmountDistributed: bigint;
  // Timestamp of the Period start
  periodStart: bigint;
  // Current state of the Period
  currentState: PeriodState;
};

const getQuestPeriod = async (
  questBoard: string,
  questId: bigint,
  chainId: ChainIds,
): Promise<QuestPeriod[]> => {
  const contract = new Contract(questBoard, QuestBoardAbi, provider[chainId]);
  const periods = await contract.getAllQuestPeriodsForQuestId(questId);
  return periods;
};

export default getQuestPeriod;

import { BigNumber, Contract } from 'ethers';
import { WEEK } from '../globals/time';
import provider from '../config/etherProvider';
import QuestBoardAbi from '../data/abi/QuestBoardAbi.json';

const getAvailableQuestsForPeriod = async (address: string): Promise<BigNumber> => {
  try {
    const contract = new Contract(address, QuestBoardAbi, provider);
    const availableQuestsNb = await contract.getQuestIdsForPeriod(
      BigNumber.from(Date.now()).div(1000).div(WEEK).mul(WEEK),
    );
    return availableQuestsNb.length;
  } catch (err) {
    console.error(err);
    return BigNumber.from(0);
  }
};

export default getAvailableQuestsForPeriod;

import { BigNumber, Contract } from 'ethers';
import provider from '../config/etherProvider';
import QuestBoardAbi from '../data/abi/QuestBoardAbi.json';

const getAvailableQuestsForPeriod = async (address: string): Promise<BigNumber> => {
  try {
    const contract = new Contract(address, QuestBoardAbi, provider);
    const week = 7 * 24 * 60 * 60;
    const availableQuestsNb = await contract.getQuestIdsForPeriod(
      BigNumber.from(Date.now()).div(1000).div(week).mul(week),
    );
    return availableQuestsNb.length;
  } catch (err) {
    console.error(err);
    return BigNumber.from(0);
  }
};

export default getAvailableQuestsForPeriod;

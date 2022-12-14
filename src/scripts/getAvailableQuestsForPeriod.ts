import { BigNumber, Contract } from 'ethers';
import { WEEK } from '../globals/time';
import provider from '../config/etherProvider';
import QuestBoardAbi from '../data/abi/QuestBoardAbi.json';

const getAvailableQuestsForPeriod = async (addresses: string[]): Promise<BigNumber> => {
  let amount = BigNumber.from(0);

  await Promise.all(
    addresses.map(async (address) => {
      try {
        const contract = new Contract(address, QuestBoardAbi, provider);
        const availableQuestsNb = await contract.getQuestIdsForPeriod(
          BigNumber.from(Date.now()).div(1000).div(WEEK).mul(WEEK),
        );
        amount = amount.add(availableQuestsNb.length);
      } catch (err) {
        console.error(err);
      }
    }),
  );
  return amount;
};

export default getAvailableQuestsForPeriod;

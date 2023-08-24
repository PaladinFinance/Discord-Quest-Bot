import { Contract } from 'ethers';
import { WEEK } from '../globals/time';
import provider from '../config/etherProvider';
import QuestBoardAbi from '../data/abi/QuestBoardAbi.json';

const getAvailableQuestsForPeriod = async (addresses: string[]): Promise<BigInt> => {
  let amount = 0n;

  await Promise.all(
    addresses.map(async (address) => {
      try {
        const contract = new Contract(address, QuestBoardAbi, provider);
        const availableQuestsNb = await contract.getQuestIdsForPeriod(
          (BigInt(Date.now()) / 1000n / WEEK) * WEEK,
        );
        amount = amount + BigInt(availableQuestsNb.length);
      } catch (err) {
        console.error(err);
      }
    }),
  );
  return amount;
};

export default getAvailableQuestsForPeriod;

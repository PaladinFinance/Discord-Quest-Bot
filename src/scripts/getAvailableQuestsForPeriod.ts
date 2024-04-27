import { Contract } from 'ethers';
import { WEEK } from '../globals/time';
import provider from '../config/etherProvider';
import QuestBoardAbi from '../data/abi/QuestBoardAbi.json';
import { ChainIds } from '../globals/chainIds';

const getAvailableQuestsForPeriod = async (addresses: {
  [key: string]: string[];
}): Promise<BigInt> => {
  const amounts = await Promise.all(
    Object.keys(addresses).map(async (chainId) => {
      let amount = 0n;
      await Promise.all(
        addresses[chainId].map(async (address) => {
          try {
            const contract = new Contract(address, QuestBoardAbi, provider[chainId as ChainIds]);
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
    }),
  );

  return amounts.reduce((a, b) => a + b, 0n);
};

export default getAvailableQuestsForPeriod;

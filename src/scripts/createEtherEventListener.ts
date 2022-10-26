// eslint-disable-next-line import/no-extraneous-dependencies
import { Listener } from '@ethersproject/abstract-provider';
import { Contract } from 'ethers';
import provider from '../config/etherProvider';

const createEtherEventListener = (
  addresses: string[],
  abi: any,
  eventName: string,
  listener: Listener,
) => {
  addresses.forEach((address) => {
    try {
      const contract = new Contract(address, abi, provider);
      contract.on(eventName, listener);
      console.log(`Listening to ${address}`);
    } catch (err) {
      console.error(err);
    }
  });
};

export default createEtherEventListener;

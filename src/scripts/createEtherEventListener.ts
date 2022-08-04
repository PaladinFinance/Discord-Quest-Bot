// eslint-disable-next-line import/no-extraneous-dependencies
import { Listener } from '@ethersproject/abstract-provider';
import { Contract } from 'ethers';
import provider from '../config/etherProvider';

const createEtherEventListener = (
  address: string,
  abi: any,
  eventName: string,
  listener: Listener,
) => {
  const contract = new Contract(address, abi, provider);
  contract.on(eventName, listener);
};

export default createEtherEventListener;

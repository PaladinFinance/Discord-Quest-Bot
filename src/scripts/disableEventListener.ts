// eslint-disable-next-line import/no-extraneous-dependencies
import { Listener } from '@ethersproject/abstract-provider';
import { Contract } from 'ethers';
import provider from '../config/etherProvider';

const disableEventListener = (address: string, abi: any, eventName: string, listener: Listener) => {
  const contract = new Contract(address, abi, provider);
  contract.off(eventName, listener);
};

export default disableEventListener;

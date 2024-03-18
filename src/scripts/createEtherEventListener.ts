import { Contract, Listener } from 'ethers';
import provider from '../config/etherProvider';
import { ProtocolType } from '../type/protocolType';

const createEtherEventListener = (
  addresses: string[],
  abi: any,
  eventName: string,
  listener: (protocolType: ProtocolType, questBoardAddress: string) => Listener,
  protocolType: ProtocolType,
) => {
  addresses.forEach((address) => {
    try {
      const contract = new Contract(address, abi, provider);
      contract.on(eventName, listener(protocolType, address));
      console.log(`Listening to ${address}`);
    } catch (err) {
      console.error(err);
    }
  });
};

export default createEtherEventListener;

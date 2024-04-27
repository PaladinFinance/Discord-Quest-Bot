import { Contract, Listener } from 'ethers';
import provider from '../config/etherProvider';
import { ProtocolType } from '../type/protocolType';
import { ChainIds } from '../globals/chainIds';

const createEtherEventListener = (
  addresses: { [key: string]: string[] },
  abi: any,
  eventName: string,
  listener: (protocolType: ProtocolType, questBoardAddress: string, chainId: ChainIds) => Listener,
  protocolType: ProtocolType,
) => {
  for (const chainId in addresses) {
    addresses[chainId].forEach((address) => {
      try {
        const contract = new Contract(address, abi, provider[chainId as ChainIds]);
        contract.on(eventName, listener(protocolType, address, chainId as ChainIds));
        console.log(`Listening to ${address}`);
      } catch (err) {
        console.error(err);
      }
    });
  }
};

export default createEtherEventListener;

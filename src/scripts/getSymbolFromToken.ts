import { Contract } from 'ethers';
import provider from '../config/etherProvider';
import tokenAbi from '../data/tokenAbi.json';

const getSymbolFromToken = async (tokenAddress: string): Promise<string> => {
  const gaugeContract = new Contract(tokenAddress, tokenAbi, provider);
  const symbol = await gaugeContract.symbol();
  return symbol;
};

export default getSymbolFromToken;
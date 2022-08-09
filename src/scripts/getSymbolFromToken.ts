import { Contract } from 'ethers';
import provider from '../config/etherProvider';
import tokenAbi from '../data/abi/tokenAbi.json';

const getSymbolFromToken = async (tokenAddress: string): Promise<string> => {
  try {
    const tokenContract = new Contract(tokenAddress, tokenAbi, provider);
    const symbol = await tokenContract.symbol();
    return symbol;
  } catch (err) {
    console.error(err);
    return '';
  }
};

export default getSymbolFromToken;

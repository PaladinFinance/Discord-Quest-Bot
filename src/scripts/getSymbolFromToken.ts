import { Contract } from 'ethers';
import provider from '../config/etherProvider';
import ERC20 from '../data/abi/ERC20.json';

const getSymbolFromToken = async (tokenAddress: string): Promise<string> => {
  try {
    const tokenContract = new Contract(tokenAddress, ERC20, provider);
    const symbol = await tokenContract.symbol();
    return symbol;
  } catch (err) {
    console.error(err);
    return '';
  }
};

export default getSymbolFromToken;

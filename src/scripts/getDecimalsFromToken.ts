import { Contract } from 'ethers';
import provider from '../config/etherProvider';
import ERC20 from '../data/abi/ERC20.json';

const getDecimalsFromToken = async (tokenAddress: string): Promise<bigint> => {
  try {
    const tokenContract = new Contract(tokenAddress, ERC20, provider);
    const decimals = await tokenContract.decimals();
    return decimals;
  } catch (err) {
    console.error(err);
    return 18n;
  }
};

export default getDecimalsFromToken;

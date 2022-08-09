import { BigNumber, Contract } from 'ethers';
import provider from '../config/etherProvider';
import tokenAbi from '../data/abi/tokenAbi.json';

const getDecimalsFromToken = async (tokenAddress: string): Promise<BigNumber> => {
  try {
    const tokenContract = new Contract(tokenAddress, tokenAbi, provider);
    const decimals = await tokenContract.decimals();
    return decimals;
  } catch (err) {
    console.error(err);
    return BigNumber.from(18);
  }
};

export default getDecimalsFromToken;

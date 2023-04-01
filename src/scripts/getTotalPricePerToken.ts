import axios from 'axios';
import { BigNumber } from 'ethers';

const getTotalPricePerToken = async (
  tokenAmount: BigNumber,
  tokenAddress: string,
): Promise<number> => {
  try {
    tokenAddress = tokenAddress.toLowerCase();
    const res = await axios.get(`https://coins.llama.fi/prices/current/ethereum:${tokenAddress}`);
    const result = tokenAmount.toNumber() * res.data.coins[`ethereum:${tokenAddress}`].price;
    return result;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export default getTotalPricePerToken;

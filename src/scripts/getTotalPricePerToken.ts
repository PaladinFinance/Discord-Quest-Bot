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
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`,
      );
      const result = tokenAmount.toNumber() * res.data[tokenAddress].usd;
      return result;
    } catch (err2) {
      console.error(err2);
    }
    return 0;
  }
};

export default getTotalPricePerToken;

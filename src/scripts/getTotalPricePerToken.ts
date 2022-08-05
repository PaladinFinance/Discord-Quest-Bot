import axios from 'axios';
import { BigNumber } from 'ethers';

const getTotalPricePerToken = async (
  tokenAmount: BigNumber,
  tokenAddress: string,
): Promise<number> => {
  const res = await axios.get(
    'https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xab846fb6c81370327e784ae7cbb6d6a6af6ff4bf&vs_currencies=usd',
  );
  const result = tokenAmount.toNumber() * res.data[tokenAddress].usd;
  return result;
};

export default getTotalPricePerToken;

import { ethers } from 'ethers';
import 'dotenv/config';
import { ChainIds } from '../globals/chainIds';

const provider = {
  [ChainIds.MAINNET]: new ethers.JsonRpcProvider(process.env.MAINNET_JSON_RPC_URL),
  [ChainIds.ARBITRUM]: new ethers.JsonRpcProvider(process.env.ARBITRUM_JSON_RPC_URL),
  [ChainIds.OPTIMISM]: new ethers.JsonRpcProvider(process.env.OPTIMISM_JSON_RPC_URL),
  [ChainIds.POLYGON]: new ethers.JsonRpcProvider(process.env.POLYGON_JSON_RPC_URL),
};

export default provider;

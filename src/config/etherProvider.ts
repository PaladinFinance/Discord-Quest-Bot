import { ethers } from 'ethers';
import 'dotenv/config';

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_JSON_RPC_URL);

export default provider;

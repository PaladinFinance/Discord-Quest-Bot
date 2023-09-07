import { ethers } from 'ethers';
import 'dotenv/config';

const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_URL);

export default provider;

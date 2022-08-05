import { Contract } from 'ethers';
import provider from '../config/etherProvider';
import gaugeAbi from '../data/abi/gaugeAbi.json';

const getSymbolFromGauge = async (gauge: string): Promise<string> => {
  const gaugeContract = new Contract(gauge, gaugeAbi, provider);
  const symbol = await gaugeContract.symbol();
  return symbol;
};

export default getSymbolFromGauge;

import { Contract } from 'ethers';
import provider from '../config/etherProvider';
import gaugeAbi from '../data/abi/gaugeAbi.json';

const getSymbolFromGauge = async (gauge: string): Promise<string> => {
  try {
    const gaugeContract = new Contract(gauge, gaugeAbi, provider);
    const symbol = await gaugeContract.symbol();
    return symbol;
  } catch (err) {
    console.error(err);
    return '';
  }
};

export default getSymbolFromGauge;
